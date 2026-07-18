import { BaseAgent, type AgentContext, type LLMProvider, type ToolRegistry, type AgentOutput } from './base';
import { z } from 'zod';

interface ActionInput {
  action: string;
  params: Record<string, unknown>;
  context: string;
}

export class ActionAgent extends BaseAgent {
  constructor(llm: LLMProvider, db: any, tools?: ToolRegistry) {
    super(llm, db, tools);
    this.name = 'action';
  }

  schema = z.object({
    action: z.string(),
    params: z.record(z.unknown()),
    context: z.string(),
  });

  async execute(input: ActionInput, context: AgentContext): Promise<AgentOutput> {
    return {
      output: { action: input.action, params: input.params, result: 'executed' },
      tokensUsed: 0,
    };
  }
}