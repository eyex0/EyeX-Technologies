# Corex AI — Enterprise AI-Powered BI Platform

Corex AI is an enterprise business intelligence platform with a multi-agent AI orchestration layer, semantic analytics, and real-time data pipelines. It provides conversational SQL queries, automated forecasting, root-cause analysis, narrative generation, and data quality monitoring — all powered by LangChain/LangGraph agents.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Vite + React)        │
│  @tanstack/react-router · Recharts · Tailwind v4 │
├─────────────────────────────────────────────────┤
│              @eyex/agents (LangGraph AI)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │Orchestrator│ │ SQL Agent│ │ Forecast Agent   │ │
│  ├──────────┤ ├──────────┤ ├──────────────────┤ │
│  │Root Cause│ │ Narrative│ │ Data Quality     │ │
│  ├──────────┤ ├──────────┤ ├──────────────────┤ │
│  │Insight   │ │ Pre-Mortem│ │ Action Agent     │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────┤
│              @eyex/services (Backend)            │
│  Auth · Billing · Alerts · Metrics · Schema     │
│  Data Import · GitOps · Embed · Permissions     │
├─────────────────────────────────────────────────┤
│              Supabase (Postgres + Auth + Realtime)│
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8, Tailwind v4 |
| Routing | @tanstack/react-router |
| Charts | Recharts |
| AI Agents | LangChain LangGraph, OpenAI, Anthropic |
| Backend Services | Supabase JS, Stripe, Resend, Slack |
| Data | Supabase (PostgreSQL), Redis |
| CI/CD | GitHub Actions, Cloudflare Pages |
| Container | Docker, docker-compose |
| Linting | Oxlint |
| Testing | Vitest |

## Project Structure

```
├── src/                        # Frontend (React + Vite)
│   ├── components/             # UI components (Tailwind)
│   ├── lib/supabase/           # Supabase client & types
│   ├── pages/                  # Route pages
│   ├── routes/                 # TanStack Router config
│   └── services/               # Frontend service layer
├── packages/
│   ├── agents/                 # @eyex/agents - AI agent suite
│   │   └── src/
│   │       ├── base.ts         # BaseAgent, types
│   │       ├── orchestrator.ts # AgentOrchestrator
│   │       ├── sql-agent.ts    # Natural language SQL
│   │       ├── forecast-agent.ts # Time-series forecasting
│   │       ├── insight-agent.ts   # KPI insight extraction
│   │       ├── root-cause-agent.ts # Root cause analysis
│   │       ├── narrative-agent.ts  # Report generation
│   │       ├── data-quality-agent.ts # Data quality checks
│   │       ├── pre-mortem-agent.ts  # Risk assessment
│   │       └── action-agent.ts      # Action recommendations
│   └── services/              # @eyex/services - backend
│       └── src/
│           ├── auth.ts          # Authentication
│           ├── billing.ts       # Stripe billing
│           ├── alerts.ts        # Alert engine
│           ├── metrics-engine.ts # Metrics & analytics
│           ├── data-import.ts   # File import (CSV, Excel)
│           ├── data-quality.ts  # Data quality rules
│           ├── embed.ts         # Embedded analytics
│           ├── git-ops.ts       # Git-based operations
│           ├── permissions.ts   # RBAC
│           ├── schema-cache.ts  # Schema introspection
│           ├── metric-cache.ts  # Redis metric cache
│           └── sql-validator.ts # SQL validation
├── Dockerfile                  # Frontend multi-stage build
├── Dockerfile.api              # API service container
├── docker-compose.yml          # Frontend + API + Redis
├── nginx.conf                  # Nginx reverse proxy config
└── .github/workflows/
    ├── ci.yml                  # Build + test + Docker push
    └── deploy.yml              # Cloudflare Pages deploy
```

## Setup

### Prerequisites

- Node.js 22+
- npm 10+
- Supabase account & project
- OpenAI API key (for AI agents)

### Installation

```bash
# Install dependencies (all workspaces)
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

### Development

```bash
# Start frontend dev server
npm run dev

# Build all workspace packages
npm run build:all

# Type-check
npm run typecheck

# Lint
npm run lint
```

### Testing

```bash
# Run all tests (unified via vitest workspace)
npm test

# Run tests in a specific package
npm run test -w packages/agents
npm run test -w packages/services

# With UI
npm run test:ui
```

### Docker

```bash
# Build & start all services
docker-compose up --build

# Or build individually
docker build -t eyex-frontend -f Dockerfile .
docker build -t eyex-api -f Dockerfile.api .
```

## AI Agents

The agent system uses a modular orchestrator pattern built on LangGraph:

- **AgentOrchestrator** — Routes requests to appropriate agents, manages execution plans, evaluates results
- **SQL Agent** — Converts natural language to SQL queries using the database schema
- **Forecast Agent** — Time-series forecasting with Prophet/NeuralProphet
- **Root Cause Agent** — Identifies drivers behind metric changes
- **Narrative Agent** — Generates human-readable report narratives
- **Insight Agent** — Extracts actionable insights from data
- **Data Quality Agent** — Validates data completeness, consistency, and accuracy
- **Pre-Mortem Agent** — Identifies potential risks before changes
- **Action Agent** — Recommends specific actions based on insights

## API

### Workspace Packages

```typescript
import { AgentOrchestrator } from '@eyex/agents';
import { SQLValidator } from '@eyex/services';

const orchestrator = new AgentOrchestrator({
  openaiApiKey: process.env.OPENAI_API_KEY,
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});

const result = await orchestrator.execute({
  type: 'sql',
  query: 'Show me revenue by month for Q1',
  orgId: 'org_123',
  userId: 'user_456',
});
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`): Builds all packages, runs tests, lints, and publishes Docker images to ghcr.io
- **Deploy** (`.github/workflows/deploy.yml`): Deploys frontend to Cloudflare Pages after CI succeeds

### Cloudflare Pages Setup

In the Cloudflare dashboard, configure:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Deploy command | `npx wrangler pages deploy dist` |
| Root directory | *(blank)* |
