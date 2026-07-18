import { createClient, type Database } from '../../src/lib/supabase/client';

const db = createClient<Database>();

export class DataQualityService {
  private db = createClient<Database>();

  async assess(input: {
    sourceId?: string;
    contractId?: string;
    metrics?: string[];
  }, orgId: string): Promise<{
    overallScore: number;
    issues: Array<{
      checkId: string;
      checkName: string;
      severity: 'info' | 'warning' | 'critical';
      message: string;
      affectedRows: number;
    }>;
    recommendations: string[];
  }> {
    const issues: any[] = [];

    // Run freshness checks
    if (input.sourceId) {
      const freshness = await this.checkFreshness(input.sourceId, orgId);
      issues.push(...freshness);
    }

    // Run completeness checks
    if (input.sourceId) {
      const completeness = await this.checkCompleteness(input.sourceId, orgId);
      issues.push(...completeness);
    }

    // Run schema checks
    if (input.contractId) {
      const schema = await this.checkSchemaMatch(input.contractId, orgId);
      issues.push(...schema);
    }

    // Run custom checks
    if (input.metrics?.length) {
      for (const metricId of input.metrics) {
        const checks = await this.runCustomChecks(metricId, orgId);
        issues.push(...checks);
      }
    }

    // Calculate overall score
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    const overallScore = Math.max(0, 100 - criticalCount * 20 - warningCount * 10 - infoCount * 2);

    const recommendations = this.generateRecommendations(issues);

    return { overallScore, issues, recommendations };
  }

  private async checkFreshness(sourceId: string, orgId: string) {
    const { data: source } = await db
      .from('data_sources_v2')
      .select('freshness_sla_hours, last_refreshed_at, freshness_status')
      .eq('id', sourceId)
      .eq('organization_id', orgId)
      .single();

    if (!source || !source.freshness_sla_hours) return [];

    const hoursSinceRefresh = (Date.now() - new Date(source.last_refreshed_at).getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceRefresh > source.freshness_sla_hours * 2) {
      return [{
        checkId: 'freshness_critical',
        checkName: 'Data Freshness',
        severity: 'critical' as const,
        message: `Data is ${Math.round(hoursSinceRefresh)} hours stale (SLA: ${source.freshness_sla_hours}h)`,
        affectedRows: 0,
      }];
    }
    if (hoursSinceRefresh > source.freshness_sla_hours) {
      return [{
        checkId: 'freshness_warning',
        checkName: 'Data Freshness',
        severity: 'warning' as const,
        message: `Data is ${Math.round(hoursSinceRefresh)} hours stale (SLA: ${source.freshness_sla_hours}h)`,
        affectedRows: 0,
      }];
    }
    return [];
  }

  private async checkCompleteness(sourceId: string, orgId: string) {
    const { data: checks } = await db
      .from('data_quality_checks')
      .select('*')
      .eq('source_id', sourceId)
      .eq('type', 'null_check')
      .eq('enabled', true);

    if (!checks?.length) return [];

    const issues = [];
    for (const check of checks) {
      const { config } = check;
      const column = config.column;
      const table = config.table || 'events';

      const { data, error } = await db.rpc('run_null_check', {
        p_table: table,
        p_column: column,
        p_org_id: orgId,
      });

      if (error) continue;

      const nullRate = data.null_count / data.total_count;
      if (nullRate > (config.threshold || 0.01)) {
        return [{
          checkId: check.id,
          checkName: `Completeness: ${column}`,
          severity: nullRate > 0.1 ? 'critical' : 'warning',
          message: `${(nullRate * 100).toFixed(1)}% null values in ${column} (threshold: ${(config.threshold || 0.01) * 100}%)`,
          affectedRows: data.null_count,
        }];
      }
    }
    return [];
  }

  private async checkSchemaMatch(contractId: string, orgId: string) {
    const { data: contract } = await db
      .from('data_contracts')
      .select('schema, schema_format')
      .eq('id', contractId)
      .eq('organization_id', orgId)
      .single();

    if (!contract) return [];

    // Would compare actual schema with contract schema
    // This is a placeholder
    return [];
  }

  private async runCustomChecks(metricId: string, orgId: string) {
    const { data: checks } = await db
      .from('data_quality_checks')
      .select('*')
      .eq('metric_id', metricId)
      .eq('enabled', true);

    if (!checks?.length) return [];

    const issues = [];
    for (const check of checks) {
      const { data, error } = await db.rpc('run_custom_quality_check', {
        p_check_id: check.id,
        p_org_id: orgId,
      });

      if (error || !data?.passed) {
        issues.push({
          checkId: check.id,
          checkName: check.name,
          severity: check.severity,
          message: data?.message || 'Custom check failed',
          affectedRows: data?.affected_rows || 0,
        });
      }
    }
    return issues;
  }

  private generateRecommendations(issues: any[]): string[] {
    const recs = new Set<string>();
    
    for (const issue of issues) {
      if (issue.severity === 'critical') {
        recs.add(`URGENT: ${issue.checkName} - ${issue.message}`);
      } else if (issue.severity === 'warning') {
        recs.add(`Investigate: ${issue.checkName} - ${issue.message}`);
      } else {
        recs.add(`Monitor: ${issue.checkName}`);
      }
    }

    if (issues.some(i => i.checkId?.includes('freshness'))) {
      recs.add('Configure automated data refresh schedules');
      recs.add('Set up freshness alerts for critical data sources');
    }
    
    if (issues.some(i => i.checkId?.includes('null_check'))) {
      recs.add('Add NOT NULL constraints to critical columns');
      recs.add('Implement data validation at ingestion');
    }

    return Array.from(recs).slice(0, 10);
  }

  async runChecks(input: {
    checkIds?: string[];
    sourceId?: string;
    contractId?: string;
  }, orgId: string): Promise<Array<{
    checkId: string;
    status: 'passed' | 'failed' | 'error';
    result?: any;
    durationMs: number;
  }>> {
    let query = db
      .from('data_quality_checks')
      .select('*')
      .eq('organization_id', orgId)
      .eq('enabled', true);

    if (input.checkIds) query = query.in('id', input.checkIds);
    if (input.sourceId) query = query.eq('source_id', input.sourceId);
    if (input.contractId) query = query.eq('contract_id', input.contractId);

    const { data: checks } = await query;
    if (!checks?.length) return [];

    const results = [];
    for (const check of checks) {
      const start = Date.now();
      try {
        const { data, error } = await db.rpc('run_quality_check', {
          p_check_id: check.id,
          p_org_id: orgId,
        });
        
        results.push({
          checkId: check.id,
          status: error ? 'error' : (data?.passed ? 'passed' : 'failed'),
          result: data,
          durationMs: Date.now() - start,
        });
      } catch (error) {
        results.push({
          checkId: check.id,
          status: 'error',
          durationMs: Date.now() - start,
        });
      }
    }
    return results;
  }

  async createIncident(input: {
    sourceId?: string;
    contractId?: string;
    checkId?: string;
    title: string;
    description: string;
    severity: 'info' | 'warning' | 'critical';
    organizationId: string;
  }): Promise<{ id: string }> {
    const { data, error } = await db
      .from('data_incidents')
      .insert({
        ...input,
        status: 'open',
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create incident: ${error.message}`);
    return { id: data.id };
  }
}

export function getDataQualityService(): DataQualityService {
  return new DataQualityService();
}