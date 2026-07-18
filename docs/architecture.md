# Architecture

## System Overview

Corex AI is an enterprise AI-powered BI platform built on a modern cloud-native architecture. The system uses a monorepo structure with three workspace packages, a React frontend, and Supabase backend.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer (Vite + React)          │
│  @tanstack/react-router  ·  Recharts  ·  Tailwind v4    │
├─────────────────────────────────────────────────────────┤
│                    @eyex/agents (AI Layer)              │
│  AgentOrchestrator ─ routes requests to specialized     │
│  agents via LangGraph, manages plans, evaluates results  │
├─────────────────────────────────────────────────────────┤
│                    @eyex/services (Service Layer)        │
│  Business logic: Auth, Billing, Metrics, Alerts, ...    │
├─────────────────────────────────────────────────────────┤
│              Supabase (Data + Auth + Realtime)          │
│  PostgreSQL  ·  Row Level Security  ·  Auth             │
└─────────────────────────────────────────────────────────┘
```

## Core Principles

- **Clean Architecture**: Separation of concerns across frontend, agents, and services
- **Type Safety**: Full TypeScript with strict mode across all packages
- **Multi-tenant**: Organization-based isolation via Supabase RLS
- **AI-First**: LangGraph-powered agent orchestration for intelligence

## Frontend Architecture

```
src/
├── components/         # Reusable UI components
│   ├── layout/         # AppShell, Sidebar, SiteHeader
│   └── ui/             # Primitives: button, card, input, table, tabs, badge, select
├── lib/
│   ├── supabase/       # Supabase client, types, helpers
│   └── utils.ts        # Shared utilities (cn, etc.)
├── pages/              # Route-level page components (18 pages)
├── routes/             # Route definitions
├── services/           # Frontend service layer (database.service.ts)
├── main.tsx            # Entry point
└── index.css           # Tailwind v4 styles
```

### Data Flow

1. Page components call `db.*` methods from `src/services/database.service.ts`
2. `db` methods use the Supabase client from `src/lib/supabase/client.ts`
3. Supabase enforces RLS policies based on the authenticated user's organization
4. Real-time subscriptions use Supabase Realtime channels

## Agent Architecture

```
AgentOrchestrator
├── SQL Agent          NL→SQL using schema context
├── Forecast Agent     Time-series forecasting
├── Root Cause Agent   Metric anomaly analysis
├── Narrative Agent    Report generation
├── Insight Agent      KPI insight extraction
├── Data Quality Agent Data validation
├── Pre-Mortem Agent   Risk assessment
└── Action Agent       Action recommendations
```

All agents extend `BaseAgent` from `packages/agents/src/base.ts` and implement:
- `run(context: AgentContext): Promise<AgentOutput>`
- `getName(): string`

The orchestrator manages:
- Execution plans via the Planner
- Result evaluation via the Evaluator
- Session state via Memory

## Service Architecture

```
packages/services/src/
├── auth.ts           Auth & user management
├── billing.ts        Stripe billing integration
├── alert-engine.ts   Alert rule evaluation
├── metrics-engine.ts Metrics & analytics
├── data-import.ts    CSV/Excel import pipeline
├── data-quality.ts   Data quality checks
├── embed.ts          Embedded analytics tokens
├── git-ops.ts        Git-based sync operations
├── permissions.ts    RBAC enforcement
├── schema-cache.ts   Schema introspection cache
├── metric-cache.ts   Redis metric cache
└── sql-validator.ts  SQL query validation
```

## Deployment Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  Cloudflare  │────▶│   Nginx      │────▶│  Vite    │
│  Pages/Docker │    │  Reverse Proxy│    │  Static  │
└─────────────┘     └──────────────┘     └──────────┘
                           │
                    ┌──────┴──────┐
                    │  API Service │
                    │  (Docker)   │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │   Redis     │
                    │   Cache     │
                    └─────────────┘
```
