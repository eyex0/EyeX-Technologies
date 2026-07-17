import { createClient, type Database } from '../lib/supabase/client';
import { SignJWT, jwtVerify } from 'jose';

const db = createClient<Database>();

interface EmbedTokenPayload {
  dashboardId: string;
  organizationId: string;
  filters: Record<string, unknown>;
  allowedDomains: string[];
  iat: number;
  exp: number;
}

export class EmbedService {
  private db = createClient<Database>();
  private secret = new TextEncoder().encode(process.env.EMBED_JWT_SECRET || 'dev-secret-change-in-production');

  async createToken(input: {
    dashboardId: string;
    organizationId: string;
    filters?: Record<string, unknown>;
    expiresInHours?: number;
    allowedDomains?: string[];
    createdById: string;
  }): Promise<{ token: string; expiresAt: string }> {
    const expiresInHours = input.expiresInHours ?? 8760; // 1 year default
    const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
    const iat = Math.floor(Date.now() / 1000);

    const payload: EmbedTokenPayload = {
      dashboardId: input.dashboardId,
      organizationId: input.organizationId,
      filters: input.filters ?? {},
      allowedDomains: input.allowedDomains ?? [],
      iat,
      exp,
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(this.secret);

    // Store token metadata
    await db.from('embedded_dashboards').insert({
      organization_id: input.organizationId,
      dashboard_id: input.dashboardId,
      public_token: token,
      allowed_domains: input.allowedDomains ?? [],
      rls_policy: input.filters ? { organization_id: { claim: 'organization_id' } } : null,
      expires_at: new Date(exp * 1000).toISOString(),
      created_by: input.createdById,
    });

    return {
      token,
      expiresAt: new Date(exp * 1000).toISOString(),
    };
  }

  async listTokens(orgId: string, dashboardId?: string): Promise<Array<{
    id: string;
    dashboardId: string;
    dashboardName: string;
    publicToken: string;
    allowedDomains: string[];
    expiresAt: string | null;
    createdAt: string;
  }>> {
    let query = db
      .from('embedded_dashboards')
      .select('*, dashboard:dashboards_v2(name)')
      .eq('organization_id', orgId);

    if (dashboardId) query = query.eq('dashboard_id', dashboardId);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Failed to list tokens: ${error.message}`);

    return (data || []).map(d => ({
      id: d.id,
      dashboardId: d.dashboard_id,
      dashboardName: d.dashboard?.name || 'Unknown',
      publicToken: d.public_token,
      allowedDomains: d.allowed_domains || [],
      expiresAt: d.expires_at,
      createdAt: d.created_at,
    }));
  }

  async revokeToken(tokenId: string): Promise<void> {
    const { error } = await db
      .from('embedded_dashboards')
      .delete()
      .eq('id', tokenId);
    if (error) throw new Error(`Failed to revoke token: ${error.message}`);
  }

  async getDashboardForToken(token: string): Promise<{
    dashboard: { id: string; name: string; spec: Record<string, unknown> };
    filters: Record<string, unknown>;
  } | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      const { dashboardId, organizationId, filters } = payload as EmbedTokenPayload;

      // Verify token hasn't been revoked
      const { data: embed } = await db
        .from('embedded_dashboards')
        .select('dashboard_id, rls_policy')
        .eq('public_token', token)
        .eq('organization_id', organizationId)
        .single();

      if (!embed) return null;

      // Fetch dashboard spec
      const { data: dashboard } = await db
        .from('dashboards_v2')
        .select('id, name, spec')
        .eq('id', dashboardId)
        .eq('organization_id', organizationId)
        .single();

      if (!dashboard) return null;

      // Apply RLS policy from token
      const rlsPolicy = embed.rls_policy;
      const effectiveFilters = { ...filters, ...(rlsPolicy || {}) };

      return {
        dashboard: {
          id: dashboard.id,
          name: dashboard.name,
          spec: dashboard.spec,
        },
        filters: effectiveFilters,
      };
    } catch {
      return null;
    }
  }

  async trackUsage(input: {
    embedId: string;
    viewerId: string;
    eventType: 'view' | 'drill' | 'export' | 'filter';
    eventData?: Record<string, unknown>;
    referrer?: string;
    userAgent?: string;
    ipHash?: string;
  }): Promise<void> {
    await db.from('embed_usage').insert({
      embed_id: input.embedId,
      viewer_id: input.viewerId,
      event_type: input.eventType,
      event_data: input.eventData,
      referrer: input.referrer,
      user_agent: input.userAgent,
      ip_hash: input.ipHash,
    });
  }

  async getEmbedAnalytics(embedId: string, startDate?: Date, endDate?: Date): Promise<{
    views: number;
    uniqueViewers: number;
    eventsByType: Record<string, number>;
    topReferrers: Array<{ referrer: string; count: number }>;
  }> {
    let query = db
      .from('embed_usage')
      .select('event_type, referrer, viewer_id')
      .eq('embed_id', embedId);

    if (startDate) query = query.gte('created_at', startDate.toISOString());
    if (endDate) query = query.lte('created_at', endDate.toISOString());

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch analytics: ${error.message}`);

    const events = data || [];
    const views = events.filter(e => e.event_type === 'view').length;
    const uniqueViewers = new Set(events.map(e => e.viewer_id)).size;
    
    const eventsByType = events.reduce((acc, e) => {
      acc[e.event_type] = (acc[e.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const referrerCounts = events
      .filter(e => e.referrer)
      .reduce((acc, e) => {
        acc[e.referrer!] = (acc[e.referrer!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      views,
      uniqueViewers,
      eventsByType,
      topReferrers,
    };
  }

  // Generate embed code snippet for customer
  generateEmbedCode(token: string, options: {
    width?: string;
    height?: string;
    theme?: 'light' | 'dark' | 'auto';
    hideToolbar?: boolean;
  } = {}): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.eyex.tech';
    const embedUrl = `${baseUrl}/embed/${token}`;

    return `
<!-- EyeX Embedded Dashboard -->
<div id="eyex-embed-${Date.now()}" style="width: ${options.width || '100%'}; height: ${options.height || '600px'};">
  <iframe 
    src="${embedUrl}${options.theme ? `?theme=${options.theme}` : ''}${options.hideToolbar ? '&toolbar=false' : ''}"
    style="width: 100%; height: 100%; border: none; border-radius: 8px;"
    allowfullscreen>
  </iframe>
</div>
<script>
  // Optional: Resize listener for responsive embeds
  window.addEventListener('message', (event) => {
    if (event.data.type === 'eyex:resize') {
      const iframe = document.querySelector('iframe[src*="eyex"]');
      if (iframe) iframe.style.height = event.data.height + 'px';
    }
  });
</script>
`;
  }
}

export function getEmbedService(): EmbedService {
  return new EmbedService();
}