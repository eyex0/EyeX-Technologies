import { createClient, type Database } from '../lib/supabase/client';

const db = createClient<Database>();

export class MetricCache {
  private redis: any = null;
  private localCache = new Map<string, { value: number; expires: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    if (process.env.REDIS_URL) {
      // In production, use ioredis
      // this.redis = new Redis(process.env.REDIS_URL);
    }
  }

  async get(input: {
    metricId: string;
    dimensionValues: Record<string, string>;
    granularity: 'day' | 'week' | 'month' | 'quarter';
    periodStart: string;
    periodEnd: string;
  }): Promise<{ value: number; sampleSize?: number } | null> {
    const key = this.buildKey(input);
    
    // Try local cache first
    const local = this.localCache.get(key);
    if (local && local.expires > Date.now()) {
      return { value: local.value, sampleSize: 1 };
    }

    // Try Redis
    if (this.redis) {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        this.localCache.set(key, { value: parsed.value, expires: Date.now() + this.TTL });
        return { value: parsed.value, sampleSize: parsed.sampleSize };
      }
    }

    // Try database
    const { data } = await db
      .from('metric_cache')
      .select('value, sample_size')
      .eq('metric_id', input.metricId)
      .eq('dimension_values', input.dimensionValues)
      .eq('granularity', input.granularity)
      .eq('period_start', input.periodStart)
      .eq('period_end', input.periodEnd)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (data) {
      this.localCache.set(key, { value: data.value, expires: Date.now() + this.TTL });
      if (this.redis) {
        await this.redis.setex(key, 300, JSON.stringify({ value: data.value, sampleSize: data.sample_size }));
      }
      return { value: data.value, sampleSize: data.sample_size };
    }

    return null;
  }

  async set(input: {
    metricId: string;
    dimensionValues: Record<string, string>;
    granularity: 'day' | 'week' | 'month' | 'quarter';
    periodStart: string;
    periodEnd: string;
    value: number;
    sampleSize?: number;
    ttlSeconds?: number;
  }): Promise<void> {
    const key = this.buildKey({
      metricId: input.metricId,
      dimensionValues: input.dimensionValues,
      granularity: input.granularity,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    });

    const expiresAt = new Date(Date.now() + (input.ttlSeconds || 300) * 1000).toISOString();

    // Write to database
    await db.from('metric_cache').upsert({
      metric_id: input.metricId,
      dimension_values: input.dimensionValues,
      granularity: input.granularity,
      period_start: input.periodStart,
      period_end: input.periodEnd,
      value: input.value,
      sample_size: input.sampleSize,
      computed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + (input.ttlSeconds || 300) * 1000).toISOString(),
    }, { onConflict: 'metric_id,dimension_values,granularity,period_start,period_end' });

    // Update caches
    this.localCache.set(key, { value: input.value, expires: Date.now() + (input.ttlSeconds || 300) * 1000 });
    
    if (this.redis) {
      await this.redis.setex(key, 300, JSON.stringify({ value: input.value, sampleSize: input.sampleSize }));
    }
  }

  async invalidate(metricId: string, dimensionValues?: Record<string, string>): Promise<void> {
    if (dimensionValues) {
      const key = this.buildKey({ metricId, dimensionValues, granularity: 'day', periodStart: '', periodEnd: '' });
      this.localCache.delete(metricId);
      if (this.redis) await this.redis.del(metricId);
    } else {
      // Invalidate all for this metric
      await db.from('metric_cache').delete().eq('metric_id', metricId);
      this.localCache.clear();
      if (this.redis) {
        const keys = await this.redis.keys(`${metricId}:*`);
        if (keys.length) await this.redis.del(...keys);
      }
    }
  }

  private buildKey(input: { metricId: string; dimensionValues: Record<string, string>; granularity: string; periodStart: string; periodEnd: string }): string {
    const dims = Object.entries(input.dimensionValues).sort().map(([k, v]) => `${k}=${v}`).join(',');
    return `metric:${input.metricId}:${input.granularity}:${dims}:${input.periodStart}:${input.periodEnd}`;
  }

  async warmCache(metricIds: string[], orgId: string): Promise<void> {
    // Pre-compute cache for common dimension combinations
    for (const metricId of metricIds) {
      // Would fetch common dimension combinations and pre-compute
      // This is a placeholder for the actual warming logic
    }
  }

  async getCacheStats(): Promise<{ localSize: number; redisConnected: boolean }> {
    return {
      localSize: this.localCache.size,
      redisConnected: !!this.redis,
    };
  }
}

export function getMetricCache(): MetricCache {
  return new MetricCache();
}