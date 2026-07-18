import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import type { Database } from '../../src/lib/supabase/types';
import { BaseAgent, type AgentContext, type TokenBudget, type AgentOutput, type LLMProvider, type LLMOptions, type LLMResponse, type ToolRegistry } from './base';
import { SQLAgent } from './sql-agent';
import { InsightAgent } from './insight-agent';
import { ActionAgent } from './action-agent';
import { ForecastAgent } from './forecast-agent';
import { RootCauseAgent } from './root-cause-agent';
import { NarrativeAgent } from './narrative-agent';
import { DataQualityAgent } from './data-quality-agent';
import { PreMortemAgent } from './pre-mortem-agent';

export interface AgentStep {
  agent: AgentType;
  input: unknown;
  output?: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  tokensUsed: number;
  error?: string;
}

export type AgentType = 
  | 'sql' 
  | 'insight' 
  | 'action' 
  | 'forecast' 
  | 'root_cause' 
  | 'narrative' 
  | 'data_quality' 
  | 'pre_mortem';

interface AgentPlan {
  steps: Array<{ agent: AgentType; input: unknown }>;
  continueOnFailure: boolean;
}

interface AgentRequest {
  agentType: AgentType;
  input: Record<string, unknown>;
  sessionId?: string;
  context: AgentContext;
  options?: { timeoutMs?: number; maxRetries?: number };
}

interface AgentResponse {
  runId: string;
  output: unknown;
  steps: AgentStep[];
  evaluation: { score: number; feedback: string };
}

class TokenBudgetManager {
  private budget: TokenBudget;
  
  constructor(maxTokens: number) {
    this.budget = { maxTokens, usedTokens: 0 };
  }
  
  consume(tokens: number): boolean {
    if (this.budget.usedTokens + tokens > this.budget.maxTokens) return false;
    this.budget.usedTokens += tokens;
    return true;
  }
  
  get remaining(): number {
    return this.budget.maxTokens - this.budget.usedTokens;
  }
  
  get exceeded(): boolean {
    return this.budget.usedTokens >= this.budget.maxTokens;
  }
}

export class AgentOrchestrator {
  private agents: Map<AgentType, BaseAgent> = new Map();
  private planner: PlannerAgent;
  private evaluator: EvaluatorAgent;
  private memory: ConversationMemory;
  private toolRegistry: ToolRegistry;

  constructor(
    private llm: LLMProvider,
    private db: ReturnType<typeof createClient<Database>>,
    private config: OrchestratorConfig
  ) {
    this.registerAgents();
    this.planner = new PlannerAgent(llm);
    this.evaluator = new EvaluatorAgent(llm);
    this.memory = new ConversationMemory(db);
    this.toolRegistry = new ToolRegistry();
  }

  private registerAgents() {
    this.agents.set('sql', new SQLAgent(this.llm, this.db, this.toolRegistry));
    this.agents.set('insight', new InsightAgent(this.llm, this.db));
    this.agents.set('action', new ActionAgent(this.llm, this.db, this.toolRegistry));
    this.agents.set('forecast', new ForecastAgent(this.llm, this.db));
    this.agents.set('root_cause', new RootCauseAgent(this.llm, this.db));
    this.agents.set('narrative', new NarrativeAgent(this.llm, this.db));
    this.agents.set('data_quality', new DataQualityAgent(this.llm, this.db));
    this.agents.set('pre_mortem', new PreMortemAgent(this.llm, this.db));
  }

  async execute(request: AgentRequest): Promise<AgentResponse> {
    const context: AgentContext = {
      orgId: request.context.orgId,
      userId: request.context.userId,
      permissions: request.context.permissions,
      budget: new TokenBudgetManager(this.config.maxTokensPerRequest),
    };

    const sessionId = request.sessionId ?? crypto.randomUUID();
    await this.memory.load(sessionId);

    // 1. Plan
    const plan = await this.planner.createPlan(request, context);
    
    const steps: AgentStep[] = plan.steps.map(step => ({
      ...step,
      status: 'pending' as const,
      startedAt: new Date(),
      tokensUsed: 0,
    }));

    const results: AgentStep[] = [];

    // 2. Execute steps
    for (const step of steps) {
      const agent = this.agents.get(step.agent);
      if (!agent) throw new Error(`Unknown agent: ${step.agent}`);

      step.status = 'running';
      const startTime = Date.now();

      try {
        const output = await agent.execute(step.input, context);
        step.output = output;
        step.status = 'completed';
        step.tokensUsed = output.tokensUsed ?? 0;
      } catch (error) {
        step.status = 'failed';
        step.error = error instanceof Error ? error.message : 'Unknown error';
        if (!plan.continueOnFailure) break;
      }

      step.completedAt = new Date();
      results.push(step);
      context.budget.consume(step.tokensUsed);

      // Check budget
      if (context.budget.exceeded) {
        throw new Error('Token budget exceeded');
      }
    }

    // 3. Evaluate
    const evaluation = await this.evaluator.evaluate(request, results, context);
    
    // 4. Save to memory
    await this.memory.save(sessionId, {
      request,
      plan,
      results,
      evaluation,
      timestamp: new Date(),
    });

    const runId = await this.persistRun({
      sessionId,
      agentType: request.agentType,
      input: request.input,
      output: steps[steps.length - 1]?.output,
      status: steps.every(s => s.status === 'completed') ? 'completed' : 'failed',
      tokensUsed: results.reduce((sum, s) => sum + s.tokensUsed, 0),
      steps: results,
    });

    return {
      runId,
      output: steps[steps.length - 1]?.output,
      steps: results,
      evaluation,
    };
  }

  private async persistRun(run: Omit<AgentRun, 'id' | 'created_at'>): Promise<string> {
    const { data, error } = await this.db
      .from('agent_runs')
      .insert({
        organization_id: run.context.orgId,
        session_id: run.sessionId,
        agent_type: run.agentType,
        input: run.input,
        output: run.output,
        status: run.status,
        tokens_used: run.tokensUsed,
        metadata: { steps: run.steps },
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async cancel(runId: string): Promise<void> {
    await this.db
      .from('agent_runs')
      .update({ status: 'cancelled', completed_at: new Date().toISOString() })
      .eq('id', runId);
  }
}

// ==================== Planner Agent ====================

class PlannerAgent {
  constructor(private llm: LLMProvider) {}

  async createPlan(request: AgentRequest, context: AgentContext): Promise<AgentPlan> {
    const prompt = `
You are a planning agent. Break down the user's request into executable steps using available agents.

Available agents:
- sql: Text-to-SQL generation with validation
- insight: Anomaly detection, correlation, trend analysis
- action: Create alerts, send webhooks, emails, create tasks
- forecast: Time series forecasting with Prophet/NeuralProphet
- root_cause: 5 Whys analysis, drill-down analysis
- narrative: Board decks, executive summaries, metric deep-dives
- data_quality: Freshness, completeness, schema validation
- pre_mortem: Simulate failures, risk assessment

User request: ${JSON.stringify(request.input)}
Available context: org=${request.context.orgId}, user=${request.context.userId}

Return a JSON plan with steps. Each step: { agent, input }.
Set continueOnFailure based on whether partial results are useful.
`;

    const response = await this.llm.complete(prompt, { temperature: 0.2, maxTokens: 2000 });
    return this.parsePlan(response.content);
  }

  private parsePlan(content: string): AgentPlan {
    try {
      const parsed = JSON.parse(content);
      return {
        steps: parsed.steps || [],
        continueOnFailure: parsed.continueOnFailure ?? false,
      };
    } catch {
      return { steps: [], continueOnFailure: false };
    }
  }
}

// ==================== Evaluator Agent ====================

class EvaluatorAgent {
  constructor(private llm: LLMProvider) {}

  async evaluate(request: AgentRequest, results: AgentStep[], context: AgentContext): Promise<{ score: number; feedback: string }> {
    const prompt = `
Evaluate the agent execution results against the original request.

Original request: ${JSON.stringify(request.input)}
Execution results: ${JSON.stringify(results.map(s => ({ agent: s.agent, status: s.status, output: s.output })))}

Rate 0-1 on:
1. Completeness - did it answer the request?
2. Accuracy - are results correct?
3. Actionability - can user act on this?
4. Quality - clarity, citations, explanations

Return JSON: { score: 0-1, feedback: "..." }
`;

    const response = await this.llm.complete(prompt, { temperature: 0.1, maxTokens: 1000 });
    try {
      return JSON.parse(response.content);
    } catch {
      return { score: 0.5, feedback: 'Evaluation parsing failed' };
    }
  }
}

// ==================== Memory ====================

class ConversationMemory {
  constructor(private db: ReturnType<typeof createClient<Database>>) {}

  async load(sessionId: string): Promise<void> {
    // Load from DB or Redis
  }

  async save(sessionId: string, entry: MemoryEntry): Promise<void> {
    await this.db.from('conversation_memory').upsert({
      session_id: sessionId,
      entry,
      updated_at: new Date().toISOString(),
    });
  }
}

interface MemoryEntry {
  request: AgentRequest;
  plan: AgentPlan;
  results: AgentStep[];
  evaluation: { score: number; feedback: string };
  timestamp: Date;
}

// ==================== Tool Registry ====================

class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  async execute(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool.execute(args);
  }
}

interface Tool {
  name: string;
  description: string;
  schema: z.ZodSchema;
  execute(args: Record<string, unknown>): Promise<unknown>;
}

// ==================== Types ====================

interface OrchestratorConfig {
  maxTokensPerRequest: number;
  defaultTimeoutMs: number;
  maxRetries: number;
}

interface AgentRun {
  id?: string;
  sessionId: string;
  agentType: string;
  input: Record<string, unknown>;
  output: unknown;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  tokensUsed: number;
  latencyMs: number | null;
  error: string | null;
  context: AgentContext;
  metadata: Record<string, unknown>;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

export type { AgentContext, AgentStep, AgentType, AgentRequest, AgentResponse, AgentPlan };