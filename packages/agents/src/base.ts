import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/lib/supabase/types';
import { OpenAI } from 'openai';
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

export class OpenAILLMProvider implements LLMProvider {
  private client: OpenAI;

  constructor(private apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async complete(prompt: string, options?: LLMOptions): Promise<LLMResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        stop: options?.stop ?? undefined,
      });

      return {
        content: response.choices[0]?.message?.content || '',
        tokensUsed: response.usage?.total_tokens ?? 0,
        finishReason: response.choices[0]?.finish_reason ?? 'stop',
      };
    } catch (error) {
      return {
        content: '',
        tokensUsed: 0,
        finishReason: `error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
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