import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/lib/supabase/types';
import fs from 'fs';
import path from 'path';

export interface AgentContext {
  orgId: string;
  userId: string;
  permissions: string[];
  budget: TokenBudget;
}

export interface TokenBudget {
  maxTokens: number;
  usedTokens: number;
}

export interface AgentOutput {
  output: unknown;
  tokensUsed: number;
  metadata?: Record<string, unknown>;
}

export interface LLMResponse {
  content: string;
  tokensUsed: number;
  finishReason: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
}

export interface LLMProvider {
  complete(prompt: string, options?: LLMOptions): Promise<LLMResponse>;
}

export interface ToolRegistry {
  execute(name: string, args: Record<string, unknown>): Promise<unknown>;
}

export abstract class BaseAgent {
  protected name: string = '';

  constructor(
    protected llm: LLMProvider,
    protected db: ReturnType<typeof createClient<Database>>,
    protected tools?: ToolRegistry
  ) {}

  abstract execute(input: unknown, context: AgentContext): Promise<AgentOutput>;

  protected async callLLM(prompt: string, options: LLMOptions = {}): Promise<LLMResponse> {
    return this.llm.complete(prompt, options);
  }

  protected async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    if (!this.tools) throw new Error('No tool registry');
    return this.tools.execute(name, args);
  }

  protected loadPrompt(name: string): string {
    return fs.readFileSync(path.join(__dirname, 'prompts', `${name}.txt`), 'utf-8');
  }
}