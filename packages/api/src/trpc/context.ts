import { createSupabaseServerClient } from '../lib/supabase/server';
import { getBillingClient } from '../services/billing';
import { getMetricsEngine } from '../services/metrics-engine';
import { getAgentOrchestrator } from '../agents/orchestrator';
import { getSqlAgent } from '../agents/sql-agent';
import { getInsightAgent } from '../agents/insight-agent';
import { getForecastAgent } from '../agents/forecast-agent';
import { getRootCauseAgent } from '../agents/root-cause-agent';
import { getNarrativeAgent } from '../agents/narrative-agent';
import { getDataQualityAgent } from '../agents/data-quality-agent';
import { getPreMortemAgent } from '../agents/pre-mortem-agent';
import { getAlertEngine } from '../services/alert-engine';
import { getDataImportService } from '../services/data-import';
import { getEmbedService } from '../services/embed';
import { getGitOps } from '../services/git-ops';
import { getSqlValidator } from '../services/sql-validator';
import { getMetricCache } from '../services/metric-cache';
import { getDataQualityService } from '../services/data-quality';
import { getPermissions } from '../services/permissions';
import { getAuth } from '../services/auth';
import { getGitOps } from '../services/git-ops';

export interface AppContext {
  supabase: ReturnType<typeof createSupabaseServerClient>;
  user: { id: string; email: string; role: string } | null;
  orgId: string | null;
  billing: ReturnType<typeof getBillingClient>;
  metricsEngine: ReturnType<typeof getMetricsEngine>;
  agentOrchestrator: ReturnType<typeof getAgentOrchestrator>;
  agents: {
    sql: ReturnType<typeof getSqlAgent>;
    insight: ReturnType<typeof getInsightAgent>;
    forecast: ReturnType<typeof getForecastAgent>;
    rootCause: ReturnType<typeof getRootCauseAgent>;
    narrative: ReturnType<typeof getNarrativeAgent>;
    dataQuality: ReturnType<typeof getDataQualityAgent>;
    preMortem: ReturnType<typeof getPreMortemAgent>;
  };
  alertEngine: ReturnType<typeof getAlertEngine>;
  dataImport: ReturnType<typeof getDataImportService>;
  embed: ReturnType<typeof getEmbedService>;
  gitOps: ReturnType<typeof getGitOps>;
  sqlValidator: ReturnType<typeof getSqlValidator>;
  metricCache: ReturnType<typeof getMetricCache>;
  dataQuality: ReturnType<typeof getDataQualityService>;
  permissions: ReturnType<typeof getPermissions>;
  auth: ReturnType<typeof getAuth>;
  gitOps: ReturnType<typeof getGitOps>;
}

export async function createContext(opts: { req: Request }): Promise<AppContext> {
  const supabase = createSupabaseServerClient();
  
  // Get user from session
  const { data: { user } } = await supabase.auth.getUser();
  
  let orgId: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('organization_id')
      .eq('id', user.id)
      .single();
    orgId = profile?.organization_id ?? null;
  }

  return {
    supabase,
    user: user ? { id: user.id, email: user.email!, role: 'admin' } : null,
    orgId,
    billing: getBillingClient(),
    metricsEngine: getMetricsEngine(),
    agentOrchestrator: getAgentOrchestrator(),
    agents: {
      sql: getSqlAgent(),
      insight: getInsightAgent(),
      forecast: getForecastAgent(),
      rootCause: getRootCauseAgent(),
      narrative: getNarrativeAgent(),
      dataQuality: getDataQualityAgent(),
      preMortem: getPreMortemAgent(),
    },
    alertEngine: getAlertEngine(),
    dataImport: getDataImportService(),
    embed: getEmbedService(),
    gitOps: getGitOps(),
    sqlValidator: getSqlValidator(),
    metricCache: getMetricCache(),
    dataQuality: getDataQualityService(),
    permissions: getPermissions(),
    auth: getAuth(),
    gitOps: getGitOps(),
  };
}