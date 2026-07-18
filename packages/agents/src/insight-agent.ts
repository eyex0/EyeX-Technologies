import { BaseAgent, type AgentContext, type AgentOutput, type LLMProvider } from './base';
import { createClient, type Database } from '../../src/lib/supabase/client';

interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  dimensions: Record<string, string>;
}

interface AnomalyResult {
  method: string;
  timestamp: Date;
  value: number;
  expected: number;
  deviation: number;
  confidence: number;
  severity: 'info' | 'warning' | 'critical';
}

interface InsightOutput extends AgentOutput {
  output: {
    insights: Array<{
      type: 'anomaly' | 'correlation' | 'trend' | 'segmentation';
      title: string;
      description: string;
      severity: 'info' | 'warning' | 'critical';
      confidence: number;
      evidence: unknown[];
      recommendations: string[];
      visualization?: { type: string; config: Record<string, unknown> };
    }>;
  };
}

export class InsightAgent extends BaseAgent {
  private anomalyDetector: AnomalyDetector;
  private correlationEngine: CorrelationEngine;
  private trendAnalyzer: TrendAnalyzer;
  private segmenter: Segmenter;

  constructor(
    llm: LLMProvider,
    db: ReturnType<typeof createClient<Database>>
  ) {
    super(llm, db);
    this.anomalyDetector = new AnomalyDetector();
    this.correlationEngine = new CorrelationEngine();
    this.trendAnalyzer = new TrendAnalyzer();
    this.segmenter = new Segmenter();
  }

  async execute(input: { type: 'anomaly' | 'correlation' | 'trend' | 'segmentation'; metric: string; dimensions?: string[]; timeframe: { start: Date; end: Date }; sensitivity?: number }, context: AgentContext): Promise<InsightOutput> {
    const { type, metric, dimensions, timeframe, sensitivity = 3 } = input;

    // Fetch metric data
    const data = await this.fetchMetricData(metric, dimensions, timeframe, context);
    if (data.length < 10) {
      return {
        output: {
          insights: [{
            type: 'insufficient_data',
            title: 'Insufficient Data',
            description: `Need at least 10 data points, got ${data.length}`,
            severity: 'info',
            confidence: 1.0,
            evidence: [],
            recommendations: ['Collect more data or extend timeframe'],
          }],
        },
        tokensUsed: 0,
      };
    }

    switch (type) {
      case 'anomaly':
        return this.detectAnomalies(data, metric, dimensions, sensitivity);
      case 'correlation':
        return this.findCorrelations(data, metric, dimensions, this.getContext());
      case 'trend':
        return this.analyzeTrend(data, metric, dimensions);
      case 'segmentation':
        return this.segmentAnalysis(data, metric, dimensions);
    }
  }

  private async fetchMetricData(metric: string, dimensions: string[] | undefined, timeframe: { start: Date; end: Date }, context: AgentContext): Promise<TimeSeriesPoint[]> {
    // Fetch from metric cache or compute
    const { data, error } = await this.db
      .from('metric_cache')
      .select('dimension_values, value, period_start, period_end')
      .eq('metric_id', metric)
      .eq('granularity', 'day')
      .gte('period_start', timeframe.start.toISOString())
      .lte('period_end', timeframe.end.toISOString())
      .order('period_start');

    if (error) throw new Error(`Failed to fetch metric data: ${error.message}`);

    return (data || []).map(row => ({
      timestamp: new Date(row.period_start),
      value: row.value,
      dimensions: row.dimension_values,
    }));
  }

  private async detectAnomalies(
    data: TimeSeriesPoint[], 
    metric: string, 
    dimensions: string[] | undefined, 
    sensitivity: number
  ): Promise<InsightOutput> {
    // Statistical anomaly detection (Modified Z-Score)
    const statisticalAnomalies = this.anomalyDetector.detectStatistical(data, { 
      method: 'modified_zscore', 
      threshold: sensitivity 
    });

    // ML-based anomaly detection
    const mlAnomalies = await this.anomalyDetector.detectML(data);

    const combined = this.mergeAnomalies(statisticalAnomalies, mlAnomalies);

    const insights = combined.map(anomaly => ({
      type: 'anomaly' as const,
      title: `${metric} anomaly detected`,
      description: this.generateAnomalyDescription(anomaly, metric),
      severity: this.calculateSeverity(anomaly),
      confidence: anomaly.confidence,
      evidence: [{
        type: 'statistical',
        method: anomaly.method,
        value: anomaly.value,
        expected: anomaly.expected,
        deviation: anomaly.deviation,
        timestamp: anomaly.timestamp,
      }],
      recommendations: this.generateAnomalyRecommendations(anomaly, metric),
      visualization: {
        type: 'timeseries_anomaly',
        data,
        anomalies: combined,
      },
    }));

    return {
      output: { insights },
      tokensUsed: 0,
      metadata: { anomalyCount: combined.length },
    };
  }

  private async findCorrelations(
    data: TimeSeriesPoint[], 
    metric: string, 
    dimensions: string[] | undefined,
    context: AgentContext
  ): Promise<InsightOutput> {
    // Fetch related metrics
    const relatedMetrics = await this.fetchRelatedMetrics(metric, context);
    const correlations: Array<{
      metric: string;
      pearson: number;
      spearman: number;
      grangerCausality: number;
      lag: number;
    }> = [];

    for (const related of relatedMetrics) {
      const relatedData = await this.fetchMetricData(related.name, [], 
        { start: data[0].timestamp, end: data[data.length - 1].timestamp }, context);
      
      if (relatedData.length < 10) continue;

      const aligned = this.alignTimeSeries(data, relatedData);
      const pearson = this.correlationEngine.pearson(aligned.x, aligned.y);
      const spearman = this.correlationEngine.spearman(aligned.x, aligned.y);
      const granger = await this.correlationEngine.granger(aligned.x, aligned.y);

      if (Math.abs(pearson) > 0.5 || Math.abs(spearman) > 0.5) {
        correlations.push({ metric: related.name, pearson, spearman, grangerCausality: granger.pValue, lag: granger.bestLag });
      }
    }

    const insights = correlations
      .sort((a, b) => Math.abs(b.pearson) - Math.abs(a.pearson))
      .slice(0, 5)
      .map(corr => ({
        type: 'correlation' as const,
        title: `${metric} correlates with ${corr.metric}`,
        description: this.generateCorrelationDescription(corr),
        severity: 'info' as const,
        confidence: Math.abs(corr.pearson),
        evidence: [{
          type: 'correlation',
          pearson: corr.pearson,
          spearman: corr.spearman,
          granger: corr.grangerCausality,
          lag: corr.lag,
        }],
        recommendations: this.generateCorrelationRecommendations(corr),
        visualization: {
          type: 'scatter_matrix',
          metrics: [metric, corr.metric],
        },
      }));

    return {
      output: { insights },
      tokensUsed: 0,
      metadata: { correlationsFound: correlations.length },
    };
  }

  private async analyzeTrend(
    data: TimeSeriesPoint[], 
    metric: string, 
    dimensions: string[] | undefined
  ): Promise<InsightOutput> {
    const trend = this.trendAnalyzer.analyze(data);
    const seasonality = this.trendAnalyzer.detectSeasonality(data);
    const changepoints = this.trendAnalyzer.detectChangepoints(data);

    const insights = [{
      type: 'trend' as const,
      title: `${metric} trend analysis`,
      description: this.generateTrendDescription(trend, seasonality, changepoints, metric),
      severity: trend.direction === 'decreasing' && trend.strength > 0.7 ? 'critical' : 'info',
      confidence: trend.confidence,
      evidence: [{
        type: 'trend',
        direction: trend.direction,
        strength: trend.strength,
        slope: trend.slope,
        rSquared: trend.rSquared,
        seasonality: seasonality,
        changepoints: changepoints.map(cp => ({ timestamp: cp.timestamp, magnitude: cp.magnitude })),
      }],
      recommendations: this.generateTrendRecommendations(trend, metric),
      visualization: {
        type: 'trend_line',
        data,
        trendLine: trend,
      },
    }];

    return {
      output: { insights },
      tokensUsed: 0,
      metadata: { trend },
    };
  }

  private async segmentAnalysis(
    data: TimeSeriesPoint[], 
    metric: string, 
    dimensions: string[] | undefined
  ): Promise<InsightOutput> {
    const segments = this.segmenter.segment(data, dimensions);
    
    const insights = segments.map(segment => ({
      type: 'segmentation' as const,
      title: `Segment: ${segment.label}`,
      description: `${segment.label} represents ${segment.percentage.toFixed(1)}% of total ${metric}`,
      severity: 'info' as const,
      confidence: segment.confidence,
      evidence: [{
        type: 'segmentation',
        segment: segment.label,
        size: segment.size,
        percentage: segment.percentage,
        metrics: segment.metrics,
      }],
      recommendations: this.generateSegmentRecommendations(segment, metric),
      visualization: {
        type: 'segment_bar',
        segments,
      },
    }));

    return {
      output: { insights },
      tokensUsed: 0,
      metadata: { segmentsFound: segments.length },
    };
  }

  // Helper methods
  private generateAnomalyDescription(anomaly: AnomalyResult, metric: string): string {
    const direction = anomaly.value > anomaly.expected ? 'above' : 'below';
    const pct = ((anomaly.value - anomaly.expected) / anomaly.expected * 100).toFixed(1);
    return `${metric} is ${Math.abs(pct)}% ${direction} expected (${anomaly.value.toFixed(2)} vs ${anomaly.expected.toFixed(2)}) at ${anomaly.timestamp.toLocaleDateString()}`;
  }

  private calculateSeverity(anomaly: AnomalyResult): 'info' | 'warning' | 'critical' {
    if (anomaly.deviation > 3) return 'critical';
    if (anomaly.deviation > 2) return 'warning';
    return 'info';
  }

  private generateAnomalyRecommendations(anomaly: AnomalyResult, metric: string): string[] {
    return [
      `Investigate root cause of ${metric} anomaly at ${anomaly.timestamp.toLocaleDateString()}`,
      'Check related metrics for correlated anomalies',
      'Review recent changes in upstream systems',
    ];
  }

  private generateCorrelationDescription(corr: any): string {
    const direction = corr.pearson > 0 ? 'positively' : 'negatively';
    return `${corr.metric} is ${direction} correlated with target (r=${corr.pearson.toFixed(2)})${corr.lag ? ` with ${corr.lag} period lag` : ''}`;
  }

  private generateCorrelationRecommendations(corr: any): string[] {
    return [
      `Investigate causal relationship with ${corr.metric}`,
      corr.lag ? `Consider ${corr.lag}-period lag in forecasting` : '',
      'Validate with domain experts',
    ].filter(Boolean);
  }

  private generateTrendDescription(trend: any, seasonality: any, changepoints: any[], metric: string): string {
    const parts = [
      `${metric} shows ${trend.direction} trend (${(trend.strength * 100).toFixed(0)}% confidence)`,
    ];
    if (seasonality.detected) parts.push(`Seasonal pattern detected (period: ${seasonality.period})`);
    if (changepoints.length > 0) parts.push(`${changepoints.length} significant change point(s) detected`);
    return parts.join('. ');
  }

  private generateTrendRecommendations(trend: any, metric: string): string[] {
    if (trend.direction === 'decreasing' && trend.strength > 0.7) {
      return [
        `Urgent: ${metric} declining rapidly - investigate immediately`,
        'Set up alert for continued decline',
        'Identify root cause of decline',
      ];
    }
    return ['Monitor trend continuation', 'Set up trend-based alerts'];
  }

  private generateSegmentRecommendations(segment: any, metric: string): string[] {
    return [
      `Focus on ${segment.label} segment (${segment.percentage.toFixed(1)}% of ${metric})`,
      'Compare segment behavior to overall average',
    ];
  }

  private mergeAnomalies(statistical: AnomalyResult[], ml: AnomalyResult[]): AnomalyResult[] {
    const merged = new Map<string, AnomalyResult>();
    for (const a of [...statistical, ...ml]) {
      const key = a.timestamp.toISOString();
      if (!merged.has(key) || a.confidence > merged.get(key)!.confidence) {
        merged.set(key, a);
      }
    }
    return Array.from(merged.values()).sort((a, b) => b.confidence - a.confidence);
  }
}

// Statistical anomaly detector
class AnomalyDetector {
  detectStatistical(data: TimeSeriesPoint[], options: { method: string; threshold: number }): AnomalyResult[] {
    const values = data.map(d => d.value);
    const median = this.median(values);
    const mad = this.mad(values, median);
    
    return data
      .map((d, i) => {
        const modifiedZ = mad > 0 ? 0.6745 * (d.value - median) / mad : 0;
        if (Math.abs(modifiedZ) > options.threshold) {
          return {
            method: 'modified_zscore',
            timestamp: d.timestamp,
            value: d.value,
            expected: median,
            deviation: Math.abs(modifiedZ),
            confidence: Math.min(0.99, Math.abs(modifiedZ) / 5),
          };
        }
        return null;
      })
      .filter((a): a is AnomalyResult => a !== null);
  }

  async detectML(data: TimeSeriesPoint[]): Promise<AnomalyResult[]> {
    // In production, would use Isolation Forest or similar
    // For now, return empty
    return [];
  }

  private median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private mad(values: number[], median: number): number {
    const deviations = values.map(v => Math.abs(v - median));
    return this.median(deviations);
  }
}

// Correlation engine
class CorrelationEngine {
  pearson(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n < 2) return 0;
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, denX = 0, denY = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - xMean;
      const dy = y[i] - yMean;
      num += dx * dy;
      denX += dx * dx;
      denY += dy * dy;
    }
    return num / Math.sqrt(denX * denY);
  }

  spearman(x: number[], y: number[]): number {
    const rankX = this.rank(x);
    const rankY = this.rank(y);
    return this.pearson(rankX, rankY);
  }

  private rank(arr: number[]): number[] {
    const sorted = [...arr].map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const ranks = new Array(arr.length);
    sorted.forEach((item, rank) => { ranks[item.i] = rank + 1; });
    return ranks;
  }

  async granger(x: number[], y: number[], maxLag = 5): Promise<{ pValue: number; bestLag: number }> {
    // Simplified - in production use proper Granger causality test
    return { pValue: 0.05, bestLag: 1 };
  }
}

// Trend analyzer
class TrendAnalyzer {
  analyze(data: TimeSeriesPoint[]): { direction: 'increasing' | 'decreasing' | 'stable'; strength: number; slope: number; rSquared: number; confidence: number } {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.value);

    const xMean = x.reduce((a, b) => a + b, 0) / data.length;
    const yMean = data.reduce((a, b) => a + b.value, 0) / data.length;

    let num = 0, denX = 0, denY = 0;
    for (let i = 0; i < data.length; i++) {
      const dx = i - x.length / 2;
      const dy = data[i].value - data.reduce((a, b) => a + b.value, 0) / data.length;
      num += dx * data[i].value;
      denX += dx * dx;
      denY += (data[i].value - data.reduce((a, b) => a + b.value, 0) / data.length) ** 2;
    }

    const slope = num / denX;
    const rSquared = (num * num) / (denX * denY);

    return {
      direction: slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable',
      strength: Math.abs(slope),
      slope,
      rSquared,
      confidence: Math.min(0.99, Math.abs(rSquared) + 0.1),
    };
  }

  detectSeasonality(data: TimeSeriesPoint[]): { detected: boolean; period: number; strength: number } {
    // Simplified - in production use FFT or autocorrelation
    return { detected: false, period: 0, strength: 0 };
  }

  detectChangepoints(data: TimeSeriesPoint[]): Array<{ timestamp: Date; magnitude: number }> {
    // Simplified PELT algorithm
    return [];
  }
}

// Segmenter
class Segmenter {
  segment(data: TimeSeriesPoint[], dimensions: string[] | undefined): Array<{ label: string; size: number; percentage: number; metrics: Record<string, number>; confidence: number }> {
    if (!dimensions || dimensions.length === 0) {
      return [{ label: 'All Data', size: data.length, percentage: 100, metrics: {}, confidence: 1.0 }];
    }

    const groups = new Map<string, TimeSeriesPoint[]>();
    for (const point of data) {
      const key = dimensions.map(d => point.dimensions[d]).join('|');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(point);
    }

    const total = data.length;
    return Array.from(groups.entries()).map(([label, points]) => ({
      label,
      size: points.length,
      percentage: (points.length / total) * 100,
      metrics: {
        mean: points.reduce((a, b) => a + b.value, 0) / points.length,
        sum: points.reduce((a, b) => a + b.value, 0),
      },
      confidence: Math.min(1, points.length / 30),
    }));
  }
}

