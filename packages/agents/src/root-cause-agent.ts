import { BaseAgent, type AgentContext, type AgentOutput } from './orchestrator';
import { createClient, type Database } from '../lib/supabase/client';

interface RootCauseInput {
  metric: string;
  anomalyTimestamp: Date;
  dimensions?: Record<string, string>;
  lookbackDays?: number;
}

interface RootCauseOutput extends AgentOutput {
  output: {
    rootCauses: Array<{
      dimension: string;
      value: string;
      contribution: number; // % contribution to anomaly
      confidence: number;
      evidence: string;
      drillDownSql: string;
    }>;
    summary: string;
    recommendedActions: string[];
  };
}

export class RootCauseAgent extends BaseAgent {
  private db = createClient<Database>();

  async execute(input: RootCauseInput, context: AgentContext): Promise<RootCauseOutput> {
    const { metric, anomalyTimestamp, dimensions = {}, lookbackDays = 30 } = input;

    // 1. Get the anomalous value and expected baseline
    const anomalyData = await this.getAnomalyContext(metric, anomalyTimestamp, dimensions, context.orgId);
    const baseline = await this.getBaseline(metric, anomalyTimestamp, dimensions, lookbackDays, context.orgId);

    // 2. Identify contributing dimensions
    const contributors = await this.identifyContributors(metric, anomalyTimestamp, dimensions, lookbackDays, context.orgId);

    // 3. For each contributor, run drill-down analysis
    const rootCauses = await Promise.all(
      contributors.map(async (contrib) => {
        const drillDown = await this.drillDown(metric, contrib.dimension, contrib.value, anomalyTimestamp, lookbackDays, context.orgId);
        return {
          dimension: contrib.dimension,
          value: contrib.value,
          contribution: contrib.contribution,
          confidence: contrib.confidence,
          evidence: this.generateEvidence(contrib, anomalyData, baseline),
          drillDownSql: this.generateDrillDownSql(metric, contrib.dimension, contrib.value, anomalyTimestamp, lookbackDays),
        };
      })
    );

    // 4. Generate summary and recommendations
    const summary = this.generateSummary(rootCauses, anomalyData, baseline);
    const recommendations = this.generateRecommendations(rootCauses, metric);

    return {
      output: { rootCauses, summary, recommendedActions: recommendations },
      tokensUsed: 0,
      metadata: { contributorsAnalyzed: contributors.length },
    };
  }

  private async getAnomalyContext(metric: string, timestamp: Date, dimensions: Record<string, string>, orgId: string) {
    // Fetch the actual anomalous value and context
    const { data } = await this.db
      .from('metric_cache')
      .select('value, dimension_values')
      .eq('metric_id', metric)
      .eq('period_start', timestamp.toISOString().split('T')[0])
      .match(dimensions)
      .single();
    return data;
  }

  private async getBaseline(metric: string, timestamp: Date, dimensions: Record<string, string>, lookbackDays: number, orgId: string) {
    const start = new Date(timestamp);
    start.setDate(start.getDate() - lookbackDays);

    const { data } = await this.db
      .from('metric_cache')
      .select('value')
      .eq('metric_id', metric)
      .gte('period_start', start.toISOString().split('T')[0])
      .lt('period_start', timestamp.toISOString().split('T')[0])
      .match(dimensions);

    if (!data || data.length === 0) return { mean: 0, std: 0 };

    const values = data.map(d => d.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);

    return { mean, std, count: values.length };
  }

  private async identifyContributors(
    metric: string, 
    timestamp: Date, 
    dimensions: Record<string, string>, 
    lookbackDays: number, 
    orgId: string
  ): Promise<Array<{ dimension: string; value: string; contribution: number; confidence: number }>> {
    // Fetch dimension breakdown around the anomaly
    const { data } = await this.db
      .from('metric_cache')
      .select('value, dimension_values')
      .eq('metric_id', metric)
      .gte('period_start', new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .lte('period_start', new Date().toISOString().split('T')[0])
      .not('dimension_values', 'is', null);

    if (!data || data.length === 0) return [];

    // Group by dimensions and calculate contribution
    const dimensionGroups = new Map<string, Map<string, number[]>>();
    
    for (const row of data) {
      if (!row.dimension_values) continue;
      for (const [dim, val] of Object.entries(row.dimension_values)) {
        if (!dimensionGroups.has(dim)) dimensionGroups.set(dim, new Map());
        const group = dimensionGroups.get(dim)!;
        if (!group.has(val)) group.set(val, []);
        group.get(val)!.push(row.value);
      }
    }

    const contributors: Array<{ dimension: string; value: string; contribution: number; confidence: number }> = [];

    for (const [dimension, groups] of dimensionGroups) {
      for (const [value, values] of groups) {
        if (values.length < 3) continue;
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const overallMean = data.reduce((a, b) => a + b.value, 0) / data.length;
        const contribution = ((mean - overallMean) / overallMean) * 100;
        
        if (Math.abs(contribution) > 5) { // Only significant contributors
          contributors.push({
            dimension,
            value,
            contribution,
            confidence: Math.min(values.length / 10, 1),
          });
        }
      }
    }

    return contributors
      .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
      .slice(0, 5); // Top 5 contributors
  }

  private async drillDown(
    metric: string,
    dimension: string,
    value: string,
    timestamp: Date,
    lookbackDays: number,
    orgId: string
  ): Promise<{ trend: string; comparison: string; relatedMetrics: string[] }> {
    // Analyze trend for this specific dimension value
    const { data } = await this.db
      .from('metric_cache')
      .select('value, period_start')
      .eq('metric_id', metric)
      .contains('dimension_values', { [dimension]: value })
      .gte('period_start', new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('period_start', { ascending: true });

    if (!data || data.length < 3) return { trend: 'insufficient_data', comparison: '', relatedMetrics: [] };

    const values = data.map(d => d.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstMean = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondMean = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const trend = secondMean > firstMean * 1.1 ? 'increasing' : 
                  secondMean < firstMean * 0.9 ? 'decreasing' : 'stable';
    
    const comparison = `${dimension}=${value} is ${trend} (${((secondMean - firstMean) / firstMean * 100).toFixed(1)}% vs first half)`;

    return { trend, comparison, relatedMetrics: [] };
  }

  private generateEvidence(contributor: any, anomalyData: any, baseline: any): string {
    const anomalyValue = anomalyData?.value ?? 0;
    const expectedValue = baseline.mean;
    const contributorMean = anomalyValue * (1 + contributor.contribution / 100);
    
    return `${contributor.dimension}=${contributor.value} contributed ${contributor.contribution.toFixed(1)}% ` +
           `(${contributorMean.toFixed(0)} vs expected ${expectedValue.toFixed(0)}). ` +
           `Confidence: ${(contributor.confidence * 100).toFixed(0)}%`;
  }

  private generateDrillDownSql(
    metric: string, 
    dimension: string, 
    value: string, 
    timestamp: Date, 
    lookbackDays: number
  ): string {
    const start = new Date(timestamp);
    start.setDate(start.getDate() - lookbackDays);
    
    return `
WITH filtered AS (
  SELECT 
    date_trunc('day', created_at) as day,
    SUM(amount) as ${metric}
  FROM finance_transactions
  WHERE organization_id = current_org_id()
    AND ${dimension} = '${value}'
    AND created_at >= '${start.toISOString().split('T')[0]}'
    AND created_at <= '${timestamp.toISOString().split('T')[0]}'
  GROUP BY 1
  ORDER BY 1
)
SELECT * FROM filtered;
    `.trim();
  }

  private generateSummary(rootCauses: any[], anomalyData: any, baseline: any): string {
    if (rootCauses.length === 0) {
      return `No significant dimension-level contributors found for the anomaly in ${anomalyData?.value ?? 'metric'}. The anomaly may be driven by external factors or multiple small factors.`;
    }

    const topCause = rootCauses[0];
    const totalContribution = rootCauses.reduce((sum, c) => sum + Math.abs(c.contribution), 0);
    
    return `The anomaly (${anomalyData?.value?.toFixed(0) ?? 'N/A'} vs expected ${baseline.mean?.toFixed(0) ?? 'N/A'}) ` +
           `is primarily driven by ${topCause.dimension}=${topCause.value} ` +
           `(${topCause.contribution.toFixed(1)}% contribution). ` +
           `${rootCauses.length} significant contributors explain ${totalContribution.toFixed(1)}% of the deviation.`;
  }

  private generateRecommendations(rootCauses: any[], metric: string): string[] {
    const recommendations: string[] = [];
    
    for (const cause of rootCauses.slice(0, 3)) {
      if (cause.contribution < -10) {
        recommendations.push(`Investigate ${cause.dimension}=${cause.value} for ${metric} decline - potential revenue leak`);
      } else if (cause.contribution > 10) {
        recommendations.push(`Replicate success factors from ${cause.dimension}=${cause.value} to other segments`);
      }
    }

    if (rootCauses.length === 0) {
      recommendations.push('No clear dimension-level cause - consider external factors (market, seasonality, competition)');
    }

    recommendations.push('Set up automated anomaly detection for this metric with 3σ threshold');
    recommendations.push('Create alert for when this metric deviates >15% from forecast');

    return recommendations;
  }

  // Type helpers
  output(output: RootCauseOutput['output']): RootCauseOutput {
    return { output, tokensUsed: 0, metadata: {} };
  }
}

// Type definitions
interface LLMProvider {
  complete(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }>;
}

function createClient<Database>() {
  return {} as any;
}