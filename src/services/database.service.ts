import { supabase, getCurrentOrgId, getCurrentUserId } from '../lib/supabase/client';
import type { 
  Organization, User, Team, ApiKey, AuditLog,
  Metric, MetricVersion, Dashboard, DashboardVersion,
  AlertRule, AlertIncident,
  AgentRun,
  EmbeddedDashboard,
} from '../lib/supabase/types';

function handleError(error: Error | null, context: string): never {
  if (error) {
    console.error(`[DB Error] ${context}:`, error);
    throw new Error(`${context}: ${error.message}`);
  }
  throw new Error(`${context}: Unknown error`);
}

export const db = {
  // Organizations
  async getOrganization(): Promise<Organization | null> {
    const orgId = await getCurrentOrgId();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    if (error) handleError(error, 'getOrganization');
    return data;
  },

  async updateOrganization(updates: Partial<Organization>): Promise<Organization> {
    const orgId = await getCurrentOrgId();
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orgId)
      .select()
      .single();
    if (error) handleError(error, 'updateOrganization');
    return data;
  },

  // Users & Teams
  async getUsers(filters?: { teamId?: string; role?: string }): Promise<User[]> {
    let query = supabase.from('users').select('*').eq('organization_id', await getCurrentOrgId());
    if (filters?.teamId) query = query.eq('team_id', filters.teamId);
    if (filters?.role) query = query.eq('role', filters.role);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) handleError(error, 'getUsers');
    return data ?? [];
  },

  async inviteUser(email: string, role: 'admin' | 'analyst' | 'viewer', teamIds?: string[]): Promise<{ user: User; inviteSent: boolean }> {
    const orgId = await getCurrentOrgId();
    const { data: invite, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { organization_id: orgId, role },
      redirectTo: `${window.location.origin}/accept-invite`,
    });
    if (inviteError) handleError(inviteError, 'inviteUser');

    if (teamIds?.length) {
      const memberships = teamIds.map(teamId => ({
        team_id: teamId,
        user_id: invite.user!.id,
        role: 'member' as const,
      }));
      const { error: memberError } = await supabase.from('team_members').insert(memberships);
      if (memberError) handleError(memberError, 'addTeamMembers');
    }

    return { user: invite.user! as unknown as User, inviteSent: true };
  },

  async updateUserRole(userId: string, role: 'owner' | 'admin' | 'analyst' | 'viewer'): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'updateUserRole');
    return data;
  },

  async removeUser(userId: string): Promise<void> {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) handleError(error, 'removeUser');
  },

  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*, _count:team_members(count)')
      .eq('organization_id', await getCurrentOrgId())
      .order('created_at', { ascending: false });
    if (error) handleError(error, 'getTeams');
    return data ?? [];
  },

  async createTeam(input: { name: string; description?: string; parentTeamId?: string }): Promise<Team> {
    const orgId = await getCurrentOrgId();
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('teams')
      .insert({ organization_id: orgId, ...input, created_by: userId })
      .select()
      .single();
    if (error) handleError(error, 'createTeam');
    return data;
  },

  async addTeamMembers(teamId: string, userIds: string[], role: 'lead' | 'member' = 'member'): Promise<void> {
    const memberships = userIds.map(userId => ({
      team_id: teamId,
      user_id: userId,
      role,
    }));
    const { error } = await supabase.from('team_members').insert(memberships);
    if (error) handleError(error, 'addTeamMembers');
  },

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('organization_id', await getCurrentOrgId())
      .order('created_at', { ascending: false });
    if (error) handleError(error, 'getApiKeys');
    return data ?? [];
  },

  async createApiKey(input: { name: string; scopes: string[]; expiresAt?: string; rateLimit?: number }): Promise<{ key: string; apiKey: ApiKey }> {
    const _orgId = await getCurrentOrgId();
    const prefix = 'eyex_live_';
    const randomPart = crypto.randomUUID().replace(/-/g, '').slice(0, 24);
    const key = prefix + randomPart;
    const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
    const hashArray = Array.from(new Uint8Array(keyHash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        organization_id: _orgId,
        name: input.name,
        key_hash: hashHex,
        key_prefix: prefix,
        scopes: input.scopes,
        rate_limit: input.rateLimit ?? 1000,
        expires_at: input.expiresAt,
        created_by: await getCurrentUserId(),
      })
      .select()
      .single();
    if (error) handleError(error, 'createApiKey');
    return { key, apiKey: data };
  },

  async revokeApiKey(keyId: string): Promise<void> {
    const { error } = await supabase
      .from('api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', keyId)
      .eq('organization_id', await getCurrentOrgId());
    if (error) handleError(error, 'revokeApiKey');
  },

  // Audit Logs
  async getAuditLogs(filters?: { resourceType?: string; action?: string; limit?: number }): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .eq('organization_id', await getCurrentOrgId())
      .order('created_at', { ascending: false });
    if (filters?.resourceType) query = query.eq('resource_type', filters.resourceType);
    if (filters?.action) query = query.eq('action', filters.action);
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) handleError(error, 'getAuditLogs');
    return data ?? [];
  },

  // Metrics (Semantic Layer)
  async getMetrics(filters?: { status?: 'draft' | 'certified' | 'deprecated'; tags?: string[] }): Promise<Metric[]> {
    let query = supabase
      .from('metrics')
      .select('*, owner:users(full_name, email), _count:metric_versions(count)')
      .eq('organization_id', await getCurrentOrgId());
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.tags?.length) query = query.contains('tags', filters.tags);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) handleError(error, 'getMetrics');
    return data ?? [];
  },

  async getMetric(id: string): Promise<Metric | null> {
    const { data, error } = await supabase
      .from('metrics')
      .select('*, owner:users(full_name, email), versions:metric_versions(*)')
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getMetric');
    }
    return data;
  },

  async createMetric(input: {
    name: string;
    displayName?: string;
    description?: string;
    sqlDefinition: string;
    dimensions?: string[];
    defaultDimensions?: string[];
    filters?: Record<string, unknown>;
    unit?: string;
    format?: Record<string, unknown>;
    tags?: string[];
  }): Promise<Metric> {
    const { data, error } = await supabase
      .from('metrics')
      .insert({
        organization_id: await getCurrentOrgId(),
        ...input,
        owner_id: await getCurrentUserId(),
        status: 'draft',
        version: 1,
      })
      .select()
      .single();
    if (error) handleError(error, 'createMetric');
    return data;
  },

  async updateMetric(id: string, input: Partial<Metric> & { changeReason?: string }): Promise<Metric> {
    const { changeReason, ...updates } = input;
    const { data, error } = await supabase
      .from('metrics')
      .update({ ...updates, updated_by: await getCurrentUserId(), updated_at: new Date().toISOString(), change_reason: changeReason })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'updateMetric');
    return data;
  },

  async certifyMetric(id: string): Promise<Metric> {
    const { data, error } = await supabase
      .from('metrics')
      .update({ status: 'certified', version: { increment: 1 }, updated_by: await getCurrentUserId(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'certifyMetric');
    return data;
  },

  async getMetricVersions(metricId: string): Promise<MetricVersion[]> {
    const { data, error } = await supabase
      .from('metric_versions')
      .select('*')
      .eq('metric_id', metricId)
      .order('version', { ascending: false });
    if (error) handleError(error, 'getMetricVersions');
    return data ?? [];
  },

  async revertMetric(id: string, version: number, changeReason: string): Promise<Metric> {
    const { data: versionData } = await supabase
      .from('metric_versions')
      .select('*')
      .eq('metric_id', id)
      .eq('version', version)
      .single();
    if (!versionData) throw new Error('Version not found');

    const { data, error } = await supabase
      .from('metrics')
      .update({
        sql_definition: versionData.sql_definition,
        dimensions: versionData.dimensions,
        filters: versionData.filters,
        unit: versionData.unit,
        format: versionData.format,
        version: { increment: 1 },
        updated_by: await getCurrentUserId(),
        updated_at: new Date().toISOString(),
        change_reason: changeReason,
      })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'revertMetric');
    return data;
  },

  async queryMetric(input: {
    metricId: string;
    dimensions?: Record<string, string>;
    filters?: Record<string, unknown>;
    timeframe?: { start: string; end: string; granularity: 'day' | 'week' | 'month' | 'quarter' };
    limit?: number;
  }): Promise<{ rows: Record<string, unknown>[]; sql: string }> {
    const orgId = await getCurrentOrgId();
    const { data, error } = await supabase.rpc('query_metric', {
      p_metric_id: input.metricId,
      p_dimensions: input.dimensions ?? {},
      p_filters: input.filters ?? {},
      p_timeframe: input.timeframe,
      p_limit: input.limit ?? 1000,
      p_org_id: orgId,
    });
    if (error) handleError(error, 'queryMetric');
    return data;
  },

  async getMetricCache(input: {
    metricId: string;
    dimensionValues: Record<string, string>;
    granularity: 'day' | 'week' | 'month' | 'quarter';
    periodStart: string;
    periodEnd: string;
  }): Promise<{ value: number; sampleSize: number | null } | null> {
    const { data, error } = await supabase
      .from('metric_cache')
      .select('value, sample_size')
      .eq('metric_id', input.metricId)
      .eq('dimension_values', input.dimensionValues)
      .eq('granularity', input.granularity)
      .eq('period_start', input.periodStart)
      .eq('period_end', input.periodEnd)
      .gt('expires_at', new Date().toISOString())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getMetricCache');
    }
    if (!data) return null;
    return { value: data.value as number, sampleSize: data.sample_size as number | null };
  },

  // Dashboards v2
  async getDashboards(filters?: { isPublic?: boolean }): Promise<Dashboard[]> {
    let query = supabase
      .from('dashboards_v2')
      .select('*, created_by_user:users(full_name, email)')
      .eq('organization_id', await getCurrentOrgId());
    if (filters?.isPublic !== undefined) query = query.eq('is_public', filters.isPublic);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) handleError(error, 'getDashboards');
    return data ?? [];
  },

  async getDashboard(id: string): Promise<Dashboard | null> {
    const { data, error } = await supabase
      .from('dashboards_v2')
      .select('*, created_by_user:users(full_name, email)')
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getDashboard');
    }
    return data;
  },

  async getDashboardBySlug(slug: string): Promise<Dashboard | null> {
    const { data, error } = await supabase
      .from('dashboards_v2')
      .select('*, created_by_user:users(full_name, email)')
      .eq('slug', slug)
      .eq('organization_id', await getCurrentOrgId())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getDashboardBySlug');
    }
    return data;
  },

  async createDashboard(input: {
    slug: string;
    name: string;
    description?: string;
    spec: Record<string, unknown>;
    gitSyncEnabled?: boolean;
    gitRepo?: string;
    gitBranch?: string;
    gitPath?: string;
  }): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboards_v2')
      .insert({
        organization_id: await getCurrentOrgId(),
        ...input,
        created_by: await getCurrentUserId(),
        updated_by: await getCurrentUserId(),
      })
      .select()
      .single();
    if (error) handleError(error, 'createDashboard');
    return data;
  },

  async updateDashboard(id: string, input: Partial<Dashboard>): Promise<Dashboard> {
    const { data, error } = await supabase
      .from('dashboards_v2')
      .update({ ...input, updated_by: await getCurrentUserId(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'updateDashboard');
    return data;
  },

  async deleteDashboard(id: string): Promise<void> {
    const { error } = await supabase
      .from('dashboards_v2')
      .delete()
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId());
    if (error) handleError(error, 'deleteDashboard');
  },

  async getDashboardVersions(dashboardId: string): Promise<DashboardVersion[]> {
    const { data, error } = await supabase
      .from('dashboard_versions')
      .select('*')
      .eq('dashboard_id', dashboardId)
      .order('version', { ascending: false });
    if (error) handleError(error, 'getDashboardVersions');
    return data ?? [];
  },

  async setDashboardPermissions(dashboardId: string, permissions: Array<{
    principalType: 'user' | 'team' | 'public';
    principalId: string | null;
    permission: 'view' | 'edit' | 'admin';
  }>): Promise<void> {
    const { error } = await supabase.rpc('set_dashboard_permissions', {
      p_dashboard_id: dashboardId,
      p_permissions: permissions,
      p_granted_by: await getCurrentUserId(),
    });
    if (error) handleError(error, 'setDashboardPermissions');
  },

  async syncDashboardFromGit(dashboardId: string): Promise<void> {
    const { error } = await supabase.rpc('sync_dashboard_from_git', { p_dashboard_id: dashboardId });
    if (error) handleError(error, 'syncDashboardFromGit');
  },

  // Alerts
  async getAlertRules(filters?: { enabled?: boolean }): Promise<AlertRule[]> {
    let query = supabase
      .from('alert_rules')
      .select('*, metric:metrics(name, display_name), owner:users(full_name, email)')
      .eq('organization_id', await getCurrentOrgId());
    if (filters?.enabled !== undefined) query = query.eq('enabled', filters.enabled);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) handleError(error, 'getAlertRules');
    return data ?? [];
  },

  async createAlertRule(input: {
    name: string;
    description?: string;
    metricId?: string;
    condition: { operator: string; threshold: number; window: string; aggregation: string };
    evaluation?: { frequency: string; lookback: string };
    severity?: 'info' | 'warning' | 'critical';
    channels: Array<{ type: 'slack' | 'email' | 'pagerduty' | 'webhook' | 'teams'; config: Record<string, unknown> }>;
    schedule?: { type: 'continuous' | 'cron'; cron?: string; timezone?: string };
    anomalyConfig?: { enabled: boolean; sensitivity: number; minDeviationPct: number };
    runbookUrl?: string;
    runbookMarkdown?: string;
  }): Promise<AlertRule> {
    const { data, error } = await supabase
      .from('alert_rules')
      .insert({
        organization_id: await getCurrentOrgId(),
        ...input,
        created_by: await getCurrentUserId(),
        updated_by: await getCurrentUserId(),
      })
      .select()
      .single();
    if (error) handleError(error, 'createAlertRule');
    return data;
  },

  async updateAlertRule(id: string, input: Partial<AlertRule>): Promise<AlertRule> {
    const { data, error } = await supabase
      .from('alert_rules')
      .update({ ...input, updated_by: await getCurrentUserId(), updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'updateAlertRule');
    return data;
  },

  async getAlertIncidents(filters?: {
    ruleId?: string;
    status?: 'firing' | 'acknowledged' | 'resolved';
    severity?: 'info' | 'warning' | 'critical';
    limit?: number;
  }): Promise<AlertIncident[]> {
    let query = supabase
      .from('alert_incidents')
      .select('*')
      .eq('organization_id', await getCurrentOrgId())
      .order('fired_at', { ascending: false });
    if (filters?.ruleId) query = query.eq('rule_id', filters.ruleId);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.severity) query = query.eq('severity', filters.severity);
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) handleError(error, 'getAlertIncidents');
    return data ?? [];
  },

  async acknowledgeAlertIncident(id: string, note?: string): Promise<AlertIncident> {
    const { data, error } = await supabase
      .from('alert_incidents')
      .update({
        status: 'acknowledged',
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: await getCurrentUserId(),
        resolution_note: note,
      })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'acknowledgeAlertIncident');
    return data;
  },

  async resolveAlertIncident(id: string, note?: string): Promise<AlertIncident> {
    const { data, error } = await supabase
      .from('alert_incidents')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: await getCurrentUserId(),
        resolution_note: note,
      })
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .select()
      .single();
    if (error) handleError(error, 'resolveAlertIncident');
    return data;
  },

  async testAlertRule(id: string): Promise<{ success: boolean; message: string }> {
    const { data, error } = await supabase.rpc('test_alert_rule', { p_rule_id: id, p_org_id: await getCurrentOrgId() });
    if (error) handleError(error, 'testAlertRule');
    return data;
  },

  // AI Agents
  async runAgent(input: {
    agentType: 'sql' | 'insight' | 'action' | 'forecast' | 'root_cause' | 'narrative' | 'data_quality' | 'pre_mortem';
    input: Record<string, unknown>;
    sessionId?: string;
    options?: { timeoutMs?: number; maxRetries?: number };
  }): Promise<{ runId: string; output: unknown }> {
    const res = await (supabase as any).functions.invoke('agent-orchestrator', {
      body: {
        agentType: input.agentType,
        input: input.input,
        sessionId: input.sessionId,
        context: {
          orgId: await getCurrentOrgId(),
          userId: await getCurrentUserId(),
        },
        options: input.options,
      },
    });
    const data = res.data as { runId: string; output: unknown };
    const error = res.error as Error | null;
    if (error) handleError(error, `runAgent:${input.agentType}`);
    return data;
  },

  async getAgentRuns(filters?: {
    agentType?: string;
    status?: 'pending' | 'running' | 'completed' | 'failed';
    limit?: number;
    cursor?: string;
  }): Promise<AgentRun[]> {
    let query = supabase
      .from('agent_runs')
      .select('*, steps:agent_run_steps(*)')
      .eq('organization_id', await getCurrentOrgId())
      .order('created_at', { ascending: false });
    if (filters?.agentType) query = query.eq('agent_type', filters.agentType);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.cursor) query = query.lt('id', filters.cursor);
    const { data, error } = await query.limit(filters?.limit ?? 50);
    if (error) handleError(error, 'getAgentRuns');
    return data ?? [];
  },

  async getAgentRun(id: string): Promise<AgentRun | null> {
    const { data, error } = await supabase
      .from('agent_runs')
      .select('*, steps:agent_run_steps(*)')
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getAgentRun');
    }
    return data;
  },

  async cancelAgentRun(id: string): Promise<void> {
    const { error } = await supabase.functions.invoke('cancel-agent-run', {
      body: { runId: id, orgId: await getCurrentOrgId() },
    });
    if (error) handleError(error, 'cancelAgentRun');
  },

  // Data Import
  async initiateUpload(input: { fileName: string; fileSize: number; mimeType: string; storageKey: string }): Promise<{ uploadId: string }> {
    const { data, error } = await supabase
      .from('imported_datasets')
      .insert({
        organization_id: await getCurrentOrgId(),
        name: input.fileName,
        original_filename: input.fileName,
        columns: [],
        rows: [],
        row_count: 0,
        status: 'draft',
        created_by: await getCurrentUserId(),
      })
      .select('id')
      .single();
    if (error) handleError(error, 'initiateUpload');
    return { uploadId: data.id };
  },

  async parseFile(uploadId: string, sheetName?: string, chunkSize = 5000): Promise<{ columns: string[]; rows: unknown[][]; totalRows: number }> {
    const { data, error } = await supabase.functions.invoke('parse-file', {
      body: { uploadId, sheetName, chunkSize },
    });
    if (error) handleError(error, 'parseFile');
    return data;
  },

  async getPreview(uploadId: string): Promise<{ headers: string[]; rows: unknown[][]; columns: Array<{ name: string; type: string; sample: unknown[] }> } | null> {
    const { data, error } = await supabase
      .from('imported_datasets')
      .select('columns, rows')
      .eq('id', uploadId)
      .eq('organization_id', await getCurrentOrgId())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getPreview');
    }
    if (!data) return null;
    return {
      headers: (data.columns as Array<{ name: string }>).map(c => c.name),
      rows: (data.rows as unknown[][]).slice(0, 10),
      columns: data.columns as Array<{ name: string; type: string; sample: unknown[] }>,
    };
  },

  async saveDataset(uploadId: string, name: string): Promise<{ id: string }> {
    const { data, error } = await supabase
      .from('imported_datasets')
      .update({ name, status: 'draft' })
      .eq('id', uploadId)
      .eq('organization_id', await getCurrentOrgId())
      .select('id')
      .single();
    if (error) handleError(error, 'saveDataset');
    return { id: data.id };
  },

  async listDatasets(): Promise<{ id: string; name: string; row_count: number; status: string; created_at: string }[]> {
    const { data, error } = await supabase
      .from('imported_datasets')
      .select('id, name, row_count, status, created_at')
      .eq('organization_id', await getCurrentOrgId())
      .order('created_at', { ascending: false });
    if (error) handleError(error, 'listDatasets');
    return data ?? [];
  },

  async deleteDataset(id: string): Promise<void> {
    const { error } = await supabase
      .from('imported_datasets')
      .delete()
      .eq('id', id)
      .eq('organization_id', await getCurrentOrgId());
    if (error) handleError(error, 'deleteDataset');
  },

  // Embedded Analytics
  async createEmbedToken(input: {
    dashboardId: string;
    filters?: Record<string, unknown>;
    expiresInHours?: number;
    allowedDomains?: string[];
  }): Promise<{ token: string; expiresAt: string }> {
    const { data, error } = await supabase.rpc('create_embed_token', {
      p_dashboard_id: input.dashboardId,
      p_organization_id: await getCurrentOrgId(),
      p_filters: input.filters ?? {},
      p_expires_in_hours: input.expiresInHours,
      p_allowed_domains: input.allowedDomains ?? [],
      p_created_by: await getCurrentUserId(),
    });
    if (error) handleError(error, 'createEmbedToken');
    return data;
  },

  async listEmbedTokens(dashboardId?: string): Promise<EmbeddedDashboard[]> {
    let query = supabase
      .from('embedded_dashboards')
      .select('*, dashboard:dashboards_v2(name)')
      .eq('organization_id', await getCurrentOrgId());
    if (dashboardId) query = query.eq('dashboard_id', dashboardId);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) handleError(error, 'listEmbedTokens');
    return data ?? [];
  },

  async revokeEmbedToken(tokenId: string): Promise<void> {
    const { error } = await supabase
      .from('embedded_dashboards')
      .delete()
      .eq('id', tokenId)
      .eq('organization_id', await getCurrentOrgId());
    if (error) handleError(error, 'revokeEmbedToken');
  },

  async getEmbeddedDashboard(token: string): Promise<{ dashboard: Dashboard; filters: Record<string, unknown> } | null> {
    const { data, error } = await supabase.rpc('get_embedded_dashboard', { p_token: token });
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getEmbeddedDashboard');
    }
    return data;
  },

  // Billing
  async getSubscription(): Promise<{ plan: string; status: string; currentPeriodEnd: string | null } | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('plan')
      .eq('id', await getCurrentOrgId())
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      handleError(error, 'getSubscription');
    }
    if (!data) return null;
    return { plan: data.plan as string, status: 'active', currentPeriodEnd: null };
  },

  async createCheckoutSession(input: { plan: 'pro' | 'team' | 'enterprise'; successUrl: string; cancelUrl: string }): Promise<{ sessionId: string; url: string }> {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { orgId: await getCurrentOrgId(), ...input },
    });
    if (error) handleError(error, 'createCheckoutSession');
    return data;
  },

  async createPortalSession(): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { orgId: await getCurrentOrgId() },
    });
    if (error) handleError(error, 'createPortalSession');
    return data;
  },

  async getUsage(startDate?: string, endDate?: string): Promise<Record<string, number>> {
    const { data, error } = await supabase.rpc('get_organization_usage', {
      p_org_id: await getCurrentOrgId(),
      p_start_date: startDate,
      p_end_date: endDate,
    });
    if (error) handleError(error, 'getUsage');
    return data ?? {};
  },

  // Domain-specific methods for page components
  async getCustomers(): Promise<any[]> {
    const { data, error } = await supabase.from('crm_customers').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getLeads(): Promise<any[]> {
    const { data, error } = await supabase.from('crm_leads').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getDeals(): Promise<any[]> {
    const { data, error } = await supabase.from('crm_deals').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getActivities(): Promise<any[]> {
    const { data, error } = await supabase.from('crm_activities').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getInvoices(): Promise<any[]> {
    const { data, error } = await supabase.from('finance_invoices').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getBudgets(): Promise<any[]> {
    const { data, error } = await supabase.from('finance_budgets').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getTransactions(): Promise<any[]> {
    const { data, error } = await supabase.from('finance_transactions').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getEmployees(): Promise<any[]> {
    const { data, error } = await supabase.from('hr_employees').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getDepartments(): Promise<any[]> {
    const { data, error } = await supabase.from('hr_departments').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getPayroll(): Promise<any[]> {
    const { data, error } = await supabase.from('hr_payroll').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getInventoryProducts(): Promise<any[]> {
    const { data, error } = await supabase.from('inventory_products').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getWarehouses(): Promise<any[]> {
    const { data, error } = await supabase.from('warehouses').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getSuppliers(): Promise<any[]> {
    const { data, error } = await supabase.from('suppliers').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getOrders(): Promise<any[]> {
    const { data, error } = await supabase.from('sales_orders').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getSalesProducts(): Promise<any[]> {
    const { data, error } = await supabase.from('sales_products').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getProjects(): Promise<any[]> {
    const { data, error } = await supabase.from('projects_projects').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getTasks(): Promise<any[]> {
    const { data, error } = await supabase.from('projects_tasks').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getNotifications(): Promise<any[]> {
    const { data, error } = await supabase.from('notifications').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  subscribeNotifications(callback: (payload: any) => void): () => void {
    const channel = supabase.channel('notifications');
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, callback);
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  },

  async markNotificationRead(id: string): Promise<void> {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  },

  async getDataSources(): Promise<any[]> {
    const { data, error } = await supabase.from('data_sources').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getDocuments(): Promise<any[]> {
    const { data, error } = await supabase.from('documents').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getDatasets(): Promise<any[]> {
    const { data, error } = await supabase.from('imported_datasets').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async getMappings(): Promise<any[]> {
    const { data, error } = await supabase.from('import_mappings').select('*').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },

  async createDataset(input: any): Promise<any> {
    const { data, error } = await supabase.from('imported_datasets').insert({ ...input, organization_id: await getCurrentOrgId() }).select().single();
    if (error) handleError(error, 'createDataset');
    return data;
  },

  async getProfiles(): Promise<any[]> {
    const { data, error } = await supabase.from('users').select('id, email, full_name, avatar_url, role, timezone, locale, preferences, created_at').eq('organization_id', await getCurrentOrgId());
    if (error) return [];
    return data ?? [];
  },
};