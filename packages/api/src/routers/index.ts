import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { supabase } from '../lib/supabase/client';
import type { AppContext } from './context';

const t = initTRPC.context<AppContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  }
  return next({ ctx: { ...ctx, user: ctx.user, orgId: ctx.orgId } });
});

export const orgProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.orgId) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No organization context' });
  }
  return next({ ctx: { ...ctx, orgId: ctx.orgId } });
});

export const appRouter = router({
  organization: router({
    getCurrent: orgProcedure
      .output(z.object({
        id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        plan: z.enum(['free', 'pro', 'team', 'enterprise']),
        settings: z.record(z.unknown()),
        stripeCustomerId: z.string().nullable(),
        trialEndsAt: z.date().nullable(),
      }))
      .query(async ({ ctx }) => {
        const { data } = await ctx.supabase
          .from('organizations')
          .select('*')
          .eq('id', ctx.orgId)
          .single();
        return data;
      }),

    updateSettings: orgProcedure
      .input(z.object({ settings: z.record(z.unknown()).partial() }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('organizations')
          .update({ settings: input.settings, updated_at: new Date().toISOString() })
          .eq('id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    upgradePlan: orgProcedure
      .input(z.object({ plan: z.enum(['pro', 'team', 'enterprise']), paymentMethodId: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.billing.upgrade(ctx.orgId, input.plan, input.paymentMethodId);
      }),
  }),

  users: router({
    list: orgProcedure
      .input(z.object({ teamId: z.string().uuid().optional(), role: z.enum(['owner', 'admin', 'analyst', 'viewer']).optional() }))
      .query(async ({ ctx, input }) => {
        let query = ctx.supabase.from('users').select('*').eq('organization_id', ctx.orgId);
        if (input.teamId) query = query.eq('team_id', input.teamId);
        if (input.role) query = query.eq('role', input.role);
        const { data } = await query.order('created_at', { ascending: false });
        return data ?? [];
      }),

    invite: orgProcedure
      .input(z.object({ email: z.string().email(), role: z.enum(['admin', 'analyst', 'viewer']), teamIds: z.array(z.string().uuid()).optional() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.auth.inviteUser(ctx.orgId, input.email, input.role, input.teamIds);
      }),

    updateRole: orgProcedure
      .input(z.object({ userId: z.string().uuid(), role: z.enum(['owner', 'admin', 'analyst', 'viewer']) }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('users')
          .update({ role: input.role, updated_at: new Date().toISOString() })
          .eq('id', input.userId)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    remove: orgProcedure
      .input(z.object({ userId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.auth.removeUser(ctx.orgId, input.userId);
      }),
  }),

  teams: router({
    create: orgProcedure
      .input(z.object({ name: z.string().min(1).max(100), description: z.string().optional(), parentTeamId: z.string().uuid().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('teams')
          .insert({ organization_id: ctx.orgId, ...input, created_by: ctx.user.id })
          .select()
          .single();
        return data;
      }),

    addMembers: orgProcedure
      .input(z.object({ teamId: z.string().uuid(), userIds: z.array(z.string().uuid()), role: z.enum(['lead', 'member']).default('member') }))
      .mutation(async ({ ctx, input }) => {
        const memberships = input.userIds.map(userId => ({
          team_id: input.teamId,
          user_id: userId,
          role: input.role,
        }));
        return ctx.supabase.from('team_members').insert(memberships);
      }),

    list: orgProcedure
      .query(async ({ ctx }) => {
        const { data } = await ctx.supabase
          .from('teams')
          .select('*, _count:team_members(count)')
          .eq('organization_id', ctx.orgId)
          .order('created_at', { ascending: false });
        return data ?? [];
      }),
  }),

  metrics: router({
    list: orgProcedure
      .input(z.object({ status: z.enum(['draft', 'certified', 'deprecated']).optional(), tags: z.array(z.string()).optional() }))
      .query(async ({ ctx, input }) => {
        let query = ctx.supabase
          .from('metrics')
          .select('*, owner:users(full_name, email), _count:metric_versions(count)')
          .eq('organization_id', ctx.orgId);
        if (input.status) query = query.eq('status', input.status);
        if (input.tags?.length) query = query.contains('tags', input.tags);
        const { data } = await query.order('created_at', { ascending: false });
        return data ?? [];
      }),

    get: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('metrics')
          .select('*, owner:users(full_name, email), versions:metric_versions(*)')
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .single();
        return data;
      }),

    create: orgProcedure
      .input(z.object({
        name: z.string().min(1).max(100).regex(/^[a-z_][a-z0-9_]*$/),
        displayName: z.string().optional(),
        description: z.string().optional(),
        sqlDefinition: z.string().min(1),
        dimensions: z.array(z.string()).default([]),
        defaultDimensions: z.array(z.string()).default([]),
        filters: z.record(z.unknown()).default({}),
        unit: z.string().optional(),
        format: z.record(z.unknown()).default({}),
        tags: z.array(z.string()).default([]),
      }))
      .mutation(async ({ ctx, input }) => {
        await ctx.sqlValidator.validate(input.sqlDefinition, ctx.orgId);
        const { data } = await ctx.supabase
          .from('metrics')
          .insert({
            organization_id: ctx.orgId,
            ...input,
            owner_id: ctx.user.id,
            status: 'draft',
            version: 1,
          })
          .select()
          .single();
        return data;
      }),

    update: orgProcedure
      .input(z.object({
        id: z.string().uuid(),
        sqlDefinition: z.string().optional(),
        dimensions: z.array(z.string()).optional(),
        filters: z.record(z.unknown()).optional(),
        status: z.enum(['draft', 'certified', 'deprecated']).optional(),
        changeReason: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, changeReason, ...updates } = input;
        if (updates.sqlDefinition) {
          await ctx.sqlValidator.validate(updates.sqlDefinition, ctx.orgId);
        }
        const { data } = await ctx.supabase
          .from('metrics')
          .update({ ...updates, updated_by: ctx.user.id, updated_at: new Date().toISOString(), change_reason: changeReason })
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    query: orgProcedure
      .input(z.object({
        metricId: z.string().uuid(),
        dimensions: z.record(z.string()).default({}),
        filters: z.record(z.unknown()).default({}),
        timeframe: z.object({
          start: z.date(),
          end: z.date(),
          granularity: z.enum(['day', 'week', 'month', 'quarter']),
        }).optional(),
        limit: z.number().max(10000).default(1000),
      }))
      .query(async ({ ctx, input }) => {
        return ctx.metricsEngine.query(input.metricId, input);
      }),

    getCache: orgProcedure
      .input(z.object({
        metricId: z.string().uuid(),
        dimensionValues: z.record(z.string()),
        granularity: z.enum(['day', 'week', 'month', 'quarter']),
        periodStart: z.date(),
        periodEnd: z.date(),
      }))
      .query(async ({ ctx, input }) => {
        return ctx.metricCache.get(input);
      }),

    certify: orgProcedure
      .input(z.object({ id: z.string().uuid(), version: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('metrics')
          .update({ status: 'certified', version: input.version ? { increment: 1 } : undefined, updated_by: ctx.user.id, updated_at: new Date().toISOString() })
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    getVersions: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('metric_versions')
          .select('*')
          .eq('metric_id', input.id)
          .order('version', { ascending: false });
        return data ?? [];
      }),

    revert: orgProcedure
      .input(z.object({ id: z.string().uuid(), version: z.number(), changeReason: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { data: version } = await ctx.supabase
          .from('metric_versions')
          .select('*')
          .eq('metric_id', input.id)
          .eq('version', input.version)
          .single();

        if (!version) throw new TRPCError({ code: 'NOT_FOUND', message: 'Version not found' });

        const { data } = await ctx.supabase
          .from('metrics')
          .update({
            sql_definition: version.sql_definition,
            dimensions: version.dimensions,
            filters: version.filters,
            unit: version.unit,
            format: version.format,
            version: { increment: 1 },
            updated_by: ctx.user.id,
            updated_at: new Date().toISOString(),
            change_reason: input.changeReason,
          })
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),
  }),

  dashboards: router({
    list: orgProcedure
      .input(z.object({ isPublic: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        let query = ctx.supabase
          .from('dashboards_v2')
          .select('*, created_by_user:users(full_name, email)')
          .eq('organization_id', ctx.orgId);
        if (input.isPublic !== undefined) query = query.eq('is_public', input.isPublic);
        const { data } = await query.order('created_at', { ascending: false });
        return data ?? [];
      }),

    get: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('dashboards_v2')
          .select('*, created_by_user:users(full_name, email)')
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .single();
        if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'Dashboard not found' });
        const canView = await ctx.permissions.canAccessDashboard(input.id, ctx.user.id, 'view');
        if (!canView) throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        return data;
      }),

    getBySlug: orgProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('dashboards_v2')
          .select('*, created_by_user:users(full_name, email)')
          .eq('slug', input.slug)
          .eq('organization_id', ctx.orgId)
          .single();
        return data;
      }),

    create: orgProcedure
      .input(z.object({
        slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        spec: z.record(z.unknown()),
        gitSyncEnabled: z.boolean().default(false),
        gitRepo: z.string().url().optional(),
        gitBranch: z.string().optional(),
        gitPath: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('dashboards_v2')
          .insert({
            organization_id: ctx.orgId,
            ...input,
            created_by: ctx.user.id,
            updated_by: ctx.user.id,
          })
          .select()
          .single();
        return data;
      }),

    update: orgProcedure
      .input(z.object({
        id: z.string().uuid(),
        spec: z.record(z.unknown()).optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        gitSyncEnabled: z.boolean().optional(),
        gitRepo: z.string().url().optional(),
        gitBranch: z.string().optional(),
        gitPath: z.string().optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        const canEdit = await ctx.permissions.canAccessDashboard(id, ctx.user.id, 'edit');
        if (!canEdit) throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });

        const { data } = await ctx.supabase
          .from('dashboards_v2')
          .update({ ...updates, updated_by: ctx.user.id, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    delete: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        const canAdmin = await ctx.permissions.canAccessDashboard(input.id, ctx.user.id, 'admin');
        if (!canAdmin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });

        await ctx.supabase
          .from('dashboards_v2')
          .delete()
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId);
      }),

    syncFromGit: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.gitOps.syncDashboard(input.id);
      }),

    getVersions: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('dashboard_versions')
          .select('*')
          .eq('dashboard_id', input.id)
          .order('version', { ascending: false })
          .limit(50);
        return data ?? [];
      }),

    revert: orgProcedure
      .input(z.object({ id: z.string().uuid(), version: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.gitOps.revertDashboard(input.id, input.version);
      }),

    setPermissions: orgProcedure
      .input(z.object({
        dashboardId: z.string().uuid(),
        permissions: z.array(z.object({
          principalType: z.enum(['user', 'team', 'public']),
          principalId: z.string().uuid().nullable(),
          permission: z.enum(['view', 'edit', 'admin']),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const canAdmin = await ctx.permissions.canAccessDashboard(input.dashboardId, ctx.user.id, 'admin');
        if (!canAdmin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });

        return ctx.supabase.$transaction([
          ctx.supabase.from('dashboard_permissions').delete().eq('dashboard_id', input.dashboardId),
          ctx.supabase.from('dashboard_permissions').insert(
            input.permissions.map(p => ({
              dashboard_id: input.dashboardId,
              principal_type: p.principalType,
              principal_id: p.principalId,
              permission: p.permission,
              granted_by: ctx.user.id,
            }))
          )
        ]);
      }),
  }),

  agents: router({
    run: orgProcedure
      .input(z.object({
        agentType: z.enum(['sql', 'insight', 'action', 'forecast', 'root_cause', 'narrative', 'data_quality', 'pre_mortem']),
        input: z.record(z.unknown()),
        sessionId: z.string().uuid().optional(),
        options: z.object({ timeoutMs: z.number().default(120000), maxRetries: z.number().default(2) }).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const run = await ctx.agentOrchestrator.execute({
          agentType: input.agentType,
          input: input.input,
          sessionId: input.sessionId,
          context: {
            orgId: ctx.orgId,
            userId: ctx.user.id,
            permissions: await ctx.permissions.getUserPermissions(ctx.user.id),
          },
          options: input.options,
        });
        return run;
      }),

    sql: router({
      generate: orgProcedure
        .input(z.object({ question: z.string(), targetTables: z.array(z.string()).optional(), context: z.record(z.unknown()).optional() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.sql.generate(input.question, {
            orgId: ctx.orgId,
            targetTables: input.targetTables,
            semanticLayer: await ctx.semanticLayer.get(ctx.orgId),
            context: input.context,
          });
        }),

      validate: orgProcedure
        .input(z.object({ sql: z.string(), targetTables: z.array(z.string()).optional() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.sql.validate(input.sql, ctx.orgId, input.targetTables);
        }),

      explain: orgProcedure
        .input(z.object({ sql: z.string(), question: z.string().optional() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.sql.explain(input.sql, input.question);
        }),
    }),

    insight: router({
      detectAnomalies: orgProcedure
        .input(z.object({
          metric: z.string(),
          dimensions: z.array(z.string()).optional(),
          timeframe: z.object({ start: z.date(), end: z.date() }),
          sensitivity: z.number().min(1).max(5).default(3),
        }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.insight.detectAnomalies({
            type: 'anomaly',
            metric: input.metric,
            dimensions: input.dimensions,
            timeframe: input.timeframe,
            sensitivity: input.sensitivity,
          }, { orgId: ctx.orgId, userId: ctx.user.id });
        }),

      findCorrelations: orgProcedure
        .input(z.object({
          metric: z.string(),
          dimensions: z.array(z.string()).optional(),
          timeframe: z.object({ start: z.date(), end: z.date() }).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.insight.findCorrelations({
            type: 'correlation',
            metric: input.metric,
            dimensions: input.dimensions,
            timeframe: input.timeframe || { start: subDays(new Date(), 90), end: new Date() },
          }, { orgId: ctx.orgId, userId: ctx.user.id });
        }),

      analyzeTrend: orgProcedure
        .input(z.object({
          metric: z.string(),
          dimensions: z.array(z.string()).optional(),
          timeframe: z.object({ start: z.date(), end: z.date() }).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.insight.analyzeTrend({
            type: 'trend',
            metric: input.metric,
            dimensions: input.dimensions,
            timeframe: input.timeframe || { start: subDays(new Date(), 90), end: new Date() },
          }, { orgId: ctx.orgId, userId: ctx.user.id });
        }),
    }),

    forecast: router({
      generate: orgProcedure
        .input(z.object({
          metric: z.string(),
          dimensions: z.record(z.string()).optional(),
          horizon: z.number().min(1).max(365).default(30),
          frequency: z.enum(['day', 'week', 'month', 'quarter']).default('day'),
          scenarios: z.array(z.object({
            name: z.string(),
            assumptions: z.record(z.number()),
            probability: z.number().min(0).max(1),
          })).optional(),
          includeComponents: z.boolean().default(false),
        }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.forecast.generate({
            metric: input.metric,
            dimensions: input.dimensions,
            horizon: input.horizon,
            frequency: input.frequency,
            scenarios: input.scenarios,
            includeComponents: input.includeComponents,
          }, { orgId: ctx.orgId, userId: ctx.user.id });
        }),

      backtest: orgProcedure
        .input(z.object({ metric: z.string(), horizon: z.number().min(1).max(90).default(30) }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.forecast.backtest(input.metric, input.horizon, ctx.orgId);
        }),
    }),

    rootCause: router({
      analyze: orgProcedure
        .input(z.object({
          metric: z.string(),
          anomalyTimestamp: z.date(),
          dimensions: z.record(z.string()).optional(),
          lookbackDays: z.number().min(1).max(90).default(30),
        }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.rootCause.analyze({
            metric: input.metric,
            anomalyTimestamp: input.anomalyTimestamp,
            dimensions: input.dimensions,
            lookbackDays: input.lookbackDays,
          }, { orgId: ctx.orgId, userId: ctx.user.id });
        }),
    }),

    narrative: router({
      generate: orgProcedure
        .input(z.object({
          type: z.enum(['board_deck', 'executive_summary', 'metric_deep_dive', 'anomaly_report']),
          metric: z.string().optional(),
          timeframe: z.object({ start: z.date(), end: z.date() }).optional(),
          metrics: z.array(z.string()).optional(),
          dimensions: z.record(z.string()).optional(),
          audience: z.enum(['board', 'executive', 'team', 'investor']).default('executive'),
          format: z.enum(['markdown', 'pptx', 'pdf', 'notion']).default('markdown'),
        }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.narrative.generate(input, { orgId: ctx.orgId, userId: ctx.user.id });
        }),
    }),

    dataQuality: router({
      assess: orgProcedure
        .input(z.object({ sourceId: z.string().uuid().optional(), contractId: z.string().uuid().optional(), metrics: z.array(z.string()).optional() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.dataQuality.assess(input, { orgId: ctx.orgId, userId: ctx.user.id });
        }),

      runChecks: orgProcedure
        .input(z.object({ checkIds: z.array(z.string().uuid()).optional(), sourceId: z.string().uuid().optional() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.dataQuality.runChecks(input, ctx.orgId);
        }),

      getIncidents: orgProcedure
        .input(z.object({
          status: z.enum(['open', 'investigating', 'resolved', 'ignored']).optional(),
          severity: z.enum(['info', 'warning', 'critical']).optional(),
          limit: z.number().default(50),
        }))
        .query(async ({ ctx, input }) => {
          const { data } = await ctx.supabase
            .from('data_incidents')
            .select('*')
            .eq('organization_id', ctx.orgId)
            .eq('status', input.status)
            .eq('severity', input.severity)
            .order('detected_at', { ascending: false })
            .limit(input.limit);
          return data ?? [];
        }),
    }),

    preMortem: router({
      simulate: orgProcedure
        .input(z.object({ scenario: z.string(), metrics: z.array(z.string()).optional(), timeframe: z.object({ start: z.date(), end: z.date() }).optional() }))
        .mutation(async ({ ctx, input }) => {
          return ctx.agents.preMortem.simulate(input, { orgId: ctx.orgId, userId: ctx.user.id });
        }),
    }),

    history: orgProcedure
      .input(z.object({
        agentType: z.string().optional(),
        status: z.enum(['pending', 'running', 'completed', 'failed']).optional(),
        limit: z.number().default(50),
        cursor: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        let query = ctx.supabase
          .from('agent_runs')
          .select('*')
          .eq('organization_id', ctx.orgId)
          .eq('agent_type', input.agentType)
          .eq('status', input.status)
          .order('created_at', { ascending: false });
        if (input.limit) query = query.limit(input.limit);
        if (input.cursor) query = query.lt('id', input.cursor);
        const { data } = await query.limit(input.limit + 1);
        return data ?? [];
      }),

    getRun: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('agent_runs')
          .select('*, steps:agent_run_steps(*)')
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .single();
        return data;
      }),

    cancel: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.agentOrchestrator.cancel(input.id);
      }),
  }),

  alerts: router({
    list: orgProcedure
      .input(z.object({ enabled: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('alert_rules')
          .select('*, metric:metrics(name, display_name), owner:users(full_name, email)')
          .eq('organization_id', ctx.orgId)
          .eq('enabled', input.enabled)
          .order('created_at', { ascending: false });
        return data ?? [];
      }),

    create: orgProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        metricId: z.string().uuid().optional(),
        condition: z.object({
          operator: z.enum(['>', '<', '>=', '<=', '==', '!=', 'change_pct']),
          threshold: z.number(),
          window: z.string(),
          aggregation: z.enum(['avg', 'sum', 'min', 'max', 'count', 'last']),
        }),
        evaluation: z.object({ frequency: z.string().default('1m'), lookback: z.string().default('5m') }).optional(),
        severity: z.enum(['info', 'warning', 'critical']).default('warning'),
        channels: z.array(z.object({ type: z.enum(['slack', 'email', 'pagerduty', 'webhook', 'teams']), config: z.record(z.unknown()) })).min(1),
        schedule: z.object({ type: z.enum(['continuous', 'cron']), cron: z.string().optional(), timezone: z.string().default('UTC') }).optional(),
        anomalyConfig: z.object({ enabled: z.boolean().default(false), sensitivity: z.number().min(1).max(5).default(3), minDeviationPct: z.number().default(10) }).optional(),
        runbookUrl: z.string().url().optional(),
        runbookMarkdown: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('alert_rules')
          .insert({ organization_id: ctx.orgId, ...input, created_by: ctx.user.id, updated_by: ctx.user.id })
          .select()
          .single();
        return data;
      }),

    update: orgProcedure
      .input(z.object({ id: z.string().uuid(), name: z.string().optional(), enabled: z.boolean().optional(), severity: z.enum(['info', 'warning', 'critical']).optional(), channels: z.array(z.object({ type: z.enum(['slack', 'email', 'pagerduty', 'webhook', 'teams']), config: z.record(z.unknown()) })).optional() }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        const { data } = await ctx.supabase
          .from('alert_rules')
          .update({ ...updates, updated_by: ctx.user.id, updated_at: new Date().toISOString() })
          .eq('id', id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    getIncidents: orgProcedure
      .input(z.object({ ruleId: z.string().uuid().optional(), status: z.enum(['firing', 'acknowledged', 'resolved']).optional(), severity: z.enum(['info', 'warning', 'critical']).optional(), limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('alert_incidents')
          .select('*')
          .eq('rule_id', input.ruleId)
          .eq('organization_id', ctx.orgId)
          .eq('status', input.status)
          .eq('severity', input.severity)
          .order('fired_at', { ascending: false })
          .limit(input.limit);
        return data ?? [];
      }),

    acknowledge: orgProcedure
      .input(z.object({ id: z.string().uuid(), note: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('alert_incidents')
          .update({ status: 'acknowledged', acknowledged_at: new Date().toISOString(), acknowledged_by: ctx.user.id, resolution_note: input.note })
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    resolve: orgProcedure
      .input(z.object({ id: z.string().uuid(), note: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('alert_incidents')
          .update({ status: 'resolved', resolved_at: new Date().toISOString(), resolved_by: ctx.user.id, resolution_note: input.note })
          .eq('id', input.id)
          .eq('organization_id', ctx.orgId)
          .select()
          .single();
        return data;
      }),

    test: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.alertEngine.testRule(input.id, ctx.orgId);
      }),
  }),

  dataImport: router({
    upload: orgProcedure
      .input(z.object({ fileName: z.string(), fileSize: z.number(), mimeType: z.string(), storageKey: z.string() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.dataImport.initiateUpload({ orgId: ctx.orgId, userId: ctx.user.id, ...input });
      }),

    parse: orgProcedure
      .input(z.object({ uploadId: z.string().uuid(), sheetName: z.string().optional(), chunkSize: z.number().default(5000) }))
      .mutation(async ({ ctx, input }) => {
        return ctx.dataImport.parseFile(input.uploadId, input.sheetName, input.chunkSize);
      }),

    getPreview: orgProcedure
      .input(z.object({ uploadId: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.dataImport.getPreview(input.uploadId);
      }),

    saveDataset: orgProcedure
      .input(z.object({ uploadId: z.string().uuid(), name: z.string().min(1).max(200) }))
      .mutation(async ({ ctx, input }) => {
        return ctx.dataImport.saveDataset(input.uploadId, input.name, ctx.orgId, ctx.user.id);
      }),

    listDatasets: orgProcedure
      .query(async ({ ctx }) => {
        const { data } = await ctx.supabase
          .from('imported_datasets')
          .select('*')
          .eq('organization_id', ctx.orgId)
          .order('created_at', { ascending: false });
        return data ?? [];
      }),

    deleteDataset: orgProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.supabase.from('imported_datasets').delete().eq('id', input.id).eq('organization_id', ctx.orgId);
      }),

    createMapping: orgProcedure
      .input(z.object({
        datasetId: z.string().uuid(),
        name: z.string(),
        targetTable: z.string(),
        columnMapping: z.record(z.string()),
        transformRules: z.record(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { data } = await ctx.supabase
          .from('import_mappings')
          .insert({ organization_id: ctx.orgId, dataset_id: input.datasetId, name: input.name, target_table: input.targetTable, column_mapping: input.columnMapping, transform_rules: input.transformRules || {}, created_by: ctx.user.id })
          .select()
          .single();
        return data;
      }),

    executeMapping: orgProcedure
      .input(z.object({ mappingId: z.string().uuid(), batchSize: z.number().default(1000) }))
      .mutation(async ({ ctx, input }) => {
        return ctx.dataImport.executeMapping(input.mappingId, input.batchSize);
      }),
  }),

  embed: router({
    createToken: orgProcedure
      .input(z.object({ dashboardId: z.string().uuid(), filters: z.record(z.unknown()).optional(), expiresInHours: z.number().min(1).max(8760).optional(), allowedDomains: z.array(z.string()).optional() }))
      .mutation(async ({ ctx, input }) => {
        const canView = await ctx.permissions.canAccessDashboard(input.dashboardId, ctx.user.id, 'view');
        if (!canView) throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });

        return ctx.embed.createToken({
          dashboardId: input.dashboardId,
          organizationId: ctx.orgId,
          filters: input.filters,
          expiresInHours: input.expiresInHours,
          allowedDomains: input.allowedDomains,
          createdById: ctx.user.id,
        });
      }),

    listTokens: orgProcedure
      .input(z.object({ dashboardId: z.string().uuid().optional() }))
      .query(async ({ ctx, input }) => {
        return ctx.embed.listTokens(ctx.orgId, input.dashboardId);
      }),

    revokeToken: orgProcedure
      .input(z.object({ tokenId: z.string().uuid() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.embed.revokeToken(input.tokenId);
      }),

    getDashboard: publicProcedure
      .input(z.object({ token: z.string().uuid() }))
      .query(async ({ ctx, input }) => {
        return ctx.embed.getDashboardForToken(input.token);
      }),
  }),

  billing: router({
    getSubscription: orgProcedure
      .query(async ({ ctx }) => {
        return ctx.billing.getSubscription(ctx.orgId);
      }),

    createCheckoutSession: orgProcedure
      .input(z.object({ plan: z.enum(['pro', 'team', 'enterprise']), successUrl: z.string().url(), cancelUrl: z.string().url() }))
      .mutation(async ({ ctx, input }) => {
        return ctx.billing.createCheckoutSession(ctx.orgId, input.plan, { successUrl: input.successUrl, cancelUrl: input.cancelUrl });
      }),

    createPortalSession: orgProcedure
      .mutation(async ({ ctx }) => {
        return ctx.billing.createPortalSession(ctx.orgId);
      }),

    getUsage: orgProcedure
      .input(z.object({ startDate: z.date().optional(), endDate: z.date().optional() }))
      .query(async ({ ctx, input }) => {
        return ctx.billing.getUsage(ctx.orgId, input.startDate, input.endDate);
      }),
  }),
});

export type AppRouter = typeof appRouter;