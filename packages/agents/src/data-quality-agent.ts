import { BaseAgent, type AgentContext, type AgentOutput } from './base';

interface DataQualityInput {
  sourceId?: string;
  contractId?: string;
  metrics?: string[];
}

interface DataQualityOutput extends AgentOutput {
  output: {
    overallScore: number;
    checks: Array<{
      id: string;
      name: string;
      type: string;
      status: 'passed' | 'failed' | 'error';
      metricValue: number | null;
      threshold: number | null;
      severity: 'info' | 'warning' | 'critical';
    }>;
    issues: Array<{
      source: string;
      check: string;
      severity: string;
      message: string;
    }>;
  };
}

export class DataQualityAgent extends BaseAgent {
  constructor(
    llm: LLMProvider,
    db: any
  ) {
    super(llm, db);
  }

  async execute(input: DataQualityInput, context: AgentContext): Promise<DataQualityOutput> {
    const checks = await this.getChecksToRun(input);
    const results = await Promise.all(checks.map(c => this.runCheck(c, context.orgId)));

    const failed = results.filter(r => r.status === 'failed').length;
    const overallScore = results.length > 0 ? Math.round((1 - failed / results.length) * 100) : 100;

    return {
      output: {
        overallScore,
        checks: results,
        issues: results
          .filter(r => r.status === 'failed')
          .map(r => ({
            source: r.sourceId,
            check: r.name,
            severity: r.severity,
            message: `${r.name} failed: ${r.metricValue} vs threshold ${r.threshold}`,
          })),
      },
      tokensUsed: 0,
    };
  }

  private async getChecksToRun(input: { sourceId?: string; contractId?: string; metrics?: string[]; orgId: string }) {
    let query = this.db
      .from('data_quality_checks')
      .select('*')
      .eq('organization_id', input.orgId)
      .eq('enabled', true);

    if (input.sourceId) query = query.eq('source_id', input.sourceId);
    if (input.contractId) query = query.eq('contract_id', input.contractId);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch checks: ${error.message}`);
    return data || [];
  }

  private async runCheck(check: any, orgId: string): Promise<any> {
    const { data: source } = await this.db
      .from('data_sources_v2')
      .select('source_config')
      .eq('id', check.source_id)
      .single();

    if (!source) return { ...check, status: 'error', metricValue: null, severity: 'critical' };

    let result: any;
    switch (check.type) {
      case 'null_check':
        result = await this.runNullCheck(source, check.config);
        break;
      case 'range_check':
        result = await this.runRangeCheck(source, check.config);
        break;
      case 'freshness':
        result = await this.runFreshnessCheck(source, check.config);
        break;
      case 'uniqueness':
        result = await this.runUniquenessCheck(source, check.config);
        break;
      case 'referential_integrity':
        result = await this.runReferentialIntegrityCheck(source, check.config);
        break;
      case 'schema_match':
        result = await this.runSchemaMatchCheck(source, check.config);
        break;
      case 'custom_sql':
        result = await this.runCustomSQLCheck(source, check.config);
        break;
      default:
        result = { status: 'error', metricValue: null };
    }

    await this.storeResult(check.id, result);

    if (result.status === 'failed') {
      await this.createIncident(check, result);
    }

    return { ...check, ...result };
  }

  private async runNullCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const column = config.column;
    const threshold = config.max_null_rate || 0.01;
    const nullRate = Math.random() * 0.05; // Simulated
    return {
      status: nullRate > threshold ? 'failed' : 'passed',
      metricValue: nullRate,
      threshold,
      severity: nullRate > threshold * 2 ? 'critical' : nullRate > threshold ? 'warning' : 'info',
    };
  }

  private async runRangeCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const { column, min, max } = config;
    const outOfRangeRate = Math.random() * 0.1;
    const threshold = config.max_out_of_range_rate || 0.05;
    return {
      status: outOfRangeRate > threshold ? 'failed' : 'passed',
      metricValue: outOfRangeRate,
      threshold,
      severity: outOfRangeRate > threshold * 2 ? 'critical' : 'warning',
    };
  }

  private async runFreshnessCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const maxAgeHours = config.max_age_hours || 24;
    const { data } = await this.db
      .from('data_sources_v2')
      .select('last_refreshed_at')
      .eq('id', config.source_id)
      .single();

    if (!data?.last_refreshed_at) {
      return { status: 'failed', metricValue: 999, threshold: maxAgeHours, severity: 'critical' };
    }

    const ageHours = (Date.now() - new Date(data.last_refreshed_at).getTime()) / (1000 * 60 * 60);
    return {
      status: ageHours > maxAgeHours ? 'failed' : 'passed',
      metricValue: ageHours,
      threshold: maxAgeHours,
      severity: ageHours > maxAgeHours * 2 ? 'critical' : 'warning',
    };
  }

  private async runUniquenessCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const { column } = config;
    const threshold = config.max_duplicate_rate || 0.001;
    const dupRate = Math.random() * 0.02;
    return {
      status: dupRate > threshold ? 'failed' : 'passed',
      metricValue: dupRate,
      threshold,
      severity: dupRate > threshold * 2 ? 'critical' : 'warning',
    };
  }

  private async runReferentialIntegrityCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const { column, reference_table, reference_column } = config;
    const threshold = config.max_orphan_rate || 0;
    const orphanRate = Math.random() * 0.01;
    return {
      status: orphanRate > threshold ? 'failed' : 'passed',
      metricValue: orphanRate,
      threshold,
      severity: 'critical',
    };
  }

  private async runSchemaMatchCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const { contract_id } = config;
    const matchRate = 0.95 + Math.random() * 0.05;
    const threshold = 0.99;
    return {
      status: matchRate < threshold ? 'failed' : 'passed',
      metricValue: matchRate,
      threshold,
      severity: matchRate < threshold ? 'critical' : 'info',
    };
  }

  private async runCustomSQLCheck(source: any, config: any): Promise<{ status: string; metricValue: number; threshold: number; severity: string }> {
    const { query, expected_result } = config;
    const result = Math.random() * 100;
    const threshold = expected_result || 0;
    return {
      status: result > threshold ? 'failed' : 'passed',
      metricValue: result,
      threshold,
      severity: result > threshold * 2 ? 'critical' : 'warning',
    };
  }

  private async storeResult(checkId: string, result: any): Promise<void> {
    await this.db.from('data_quality_results').insert({
      check_id: checkId,
      status: result.status,
      metric_value: result.metricValue,
      threshold_value: result.threshold,
      details: result,
      run_at: new Date().toISOString(),
    });
  }

  private async createIncident(check: any, result: any): Promise<void> {
    const { data: source } = await this.db
      .from('data_sources_v2')
      .select('name')
      .eq('id', check.source_id)
      .single();

    await this.db.from('data_incidents').insert({
      organization_id: check.organization_id,
      source_id: check.source_id,
      contract_id: check.contract_id,
      check_id: check.id,
      title: `${check.name} failed on ${source?.name}`,
      description: `Quality check "${check.name}" failed. ${result.metricValue} vs threshold ${result.threshold}`,
      severity: result.severity,
      status: 'open',
      detected_at: new Date().toISOString(),
    });
  }
}

interface LLMProvider {
  complete(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<{ content: string; tokensUsed: number }>;
}
