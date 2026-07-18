# AI Architecture

## Overview

Corex AI uses a multi-agent orchestration system built on LangGraph. Each agent specializes in a specific analytical task, and the `AgentOrchestrator` routes requests, manages execution plans, and evaluates results.

## Agent System Design

```
User Request
     │
     ▼
AgentOrchestrator
     │
     ├─ Planner ────── Creates execution plan
     ├─ Agent Router ── Routes to specialized agent(s)
     ├─ Evaluator ──── Scores and validates results
     └─ Memory ─────── Persists session context
```

## Agents

### SQL Agent
- Converts natural language to SQL queries
- Uses database schema from `schema-cache` for context
- Validates generated SQL before execution

### Forecast Agent
- Time-series forecasting with Prophet/NeuralProphet
- Supports multiple forecast horizons
- Returns accuracy metrics with predictions

### Root Cause Agent
- Analyzes metric anomalies
- Identifies contributing dimensions and factors
- Generates hypothesis-driven analysis

### Narrative Agent
- Generates human-readable business narratives
- Structures output as executive summaries
- Supports multiple tones (analytical, strategic, operational)

### Insight Agent
- Extracts actionable KPIs from data
- Compares against historical benchmarks
- Ranks insights by significance

### Data Quality Agent
- Validates data completeness and accuracy
- Checks for anomalies and outliers
- Generates quality scores

### Pre-Mortem Agent
- Identifies risks before changes
- Analyzes potential failure modes
- Recommends mitigation strategies

### Action Agent
- Recommends specific business actions
- Prioritizes based on impact and effort
- Links to relevant data sources

## Prompt Management

Prompts are stored in `packages/agents/src/prompts/` and loaded by each agent at runtime. This separation allows prompt refinement without changing business logic.

```
packages/agents/src/prompts/
├── sql.txt
├── forecast.txt
├── root-cause.txt
├── narrative.txt
├── insight.txt
├── data-quality.txt
├── pre-mortem.txt
└── action.txt
```

## Token Budget Management

Each agent run has a token budget:
- `maxTokens`: Maximum tokens allowed
- `usedTokens`: Tokens consumed so far
- `consume(n)`: Deducts `n` tokens; returns `false` if exceeded

## Streaming

Agents support streaming responses via async generators:
```typescript
async function* streamRun(context: AgentContext): AsyncGenerator<string>
```

## Error Handling

- Timeout: Each agent has a configurable timeout (default 30s)
- Retry: Automatic retry with exponential backoff (max 3 attempts)
- Fallback: Graceful degradation to simpler models on failure

## Security

- All LLM calls use API keys stored in environment variables
- No secrets in prompts or agent code
- Prompt injection prevention via input sanitization
- Rate limiting per organization
