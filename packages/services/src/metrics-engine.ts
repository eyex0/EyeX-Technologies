import { BaseAgent, type AgentContext, type AgentOutput } from './orchestrator';
import { createClient, type Database } from '../../src/lib/supabase/client';
import { InsightAgent, type InsightRequest } from '../../packages/agents/src/insight-agent';
import { ForecastAgent } from '../../packages/agents/src/forecast-agent';
import { RootCauseAgent } from '../../packages/agents/src/root-cause-agent';
import { NarrativeAgent } from '../../packages/agents/src/narrative-agent';
import { DataQualityAgent } from '../../packages/agents/src/data-quality-agent';
import { PreMortemAgent } from '../../packages/agents/src/pre-mortem-agent';

interface MetricDefinition {
  name: string;
  sqlDefinition: string;
  dimensions: string[];
  unit: string | null;
}

export class MetricsEngine {
  private db = createClient<Database>();
  private cache = new Map<string, { value: number; expires: number }>();

  async query(metricId: string, options: {
    dimensions?: Record<string, string>;
    filters?: Record<string, unknown>;
    timeframe?: { start: Date; end: Date; granularity: 'day' | 'week' | 'month' | 'quarter' };
    limit?: number;
  }): Promise<{ rows: Record<string, unknown>[]; sql: string }> {
    const metric = await this.getMetric(metricId);
    if (!metric) throw new Error(`Metric ${metricId} not found`);

    // Check cache first
    const cacheKey = this.buildCacheKey(metricId, options);
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return { rows: [{ value: cached.value }], sql: 'CACHED' };
    }

    // Build and execute query
    const sql = this.buildQuery(metric, options);
    const { data, error } = await this.db.rpc('execute_metric_query', {
      p_sql: sql,
      p_limit: options.limit ?? 1000,
    });

    if (error) throw new Error(`Query failed: ${error.message}`);

    // Cache result
    if (data?.[0]?.value !== undefined) {
      this.cache.set(cacheKey, {
        value: data[0].value,
        expires: Date.now() + 5 * 60 * 1000, // 5 min TTL
      });
    }

    return { rows: data ?? [], sql };
  }

  private async getMetric(id: string): Promise<{ sqlDefinition: string; dimensions: string[] } | null> {
    // In production, fetch from database
    return { sqlDefinition: 'SELECT 1', dimensions: [] };
  }

  private buildQuery(metric: { sqlDefinition: string; dimensions: string[] }, options: any): string {
    let sql = metric.sqlDefinition;

    // Replace metric references
    sql = sql.replace(/\{\{(\w+)\}\}/g, (_, name) => `metric_${name}()`);

    // Apply dimension filters
    if (options.dimensions) {
      const where = Object.entries(options.dimensions)
        .map(([k, v]) => `${k} = '${v}'`)
        .join(' AND ');
      sql = sql.replace(/WHERE/, `WHERE ${where} AND`);
    }

    // Apply timeframe
    if (options.timeframe) {
      const { start, end, granularity } = options.timeframe;
      const dateCol = 'created_at'; // would be detected from metric
      sql = sql.replace(/WHERE/, `WHERE ${dateCol} >= '${start.toISOString()}' AND ${dateCol} <= '${end.toISOString()}' AND`);
    }

    // Group by dimensions
    if (options.dimensions) {
      const dims = Object.keys(options.dimensions);
      if (dims.length > 0) {
        sql = sql.replace(/SELECT/, `SELECT ${dims.join(', ')}, `);
        sql += ` GROUP BY ${dims.join(', ')}`;
      }
    }

    return sql;
  }

  private buildCacheKey(metricId: string, options: any): string {
    return `${metricId}:${JSON.stringify(options)}`;
  }

  // Pre-compute metrics for dashboard acceleration
  async precomputeMetrics(orgId: string, metrics: string[]): Promise<void> {
    // This would be called by a cron job
    for (const metricId of metrics) {
      await this.precomputeSingle(metricId, orgId);
    }
  }

  private async precomputeSingle(metricId: string, orgId: string): Promise<void> {
    // Compute for common dimension combinations
    const granularities = ['day', 'week', 'month'];
    const periods = this.getPeriods();

    for (const granularity of granularities) {
      for (const period of periods) {
        // Would execute pre-computation query
        // INSERT INTO metric_cache ...
      }
    }
  }

  private getPeriods(): Array<{ start: Date; end: Date }> {
    const periods: Array<{ start: Date; end: Date }> = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const end = new Date(now);
      end.setMonth(end.getMonth() - i);
      const start = new Date(end);
      start.setMonth(start.getMonth() - 1);
      periods.push({ start, end });
    }
    return periods;
  }
}

export function getMetricsEngine(): MetricsEngine {
  return new MetricsEngine();
}