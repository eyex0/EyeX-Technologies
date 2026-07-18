import { describe, it, expect, vi } from 'vitest';
import { SQLAgent, DatabaseSchema, SemanticLayer } from './sql-agent';
import type { LLMProvider, LLMResponse, ToolRegistry } from './base';

vi.mock('../../src/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }), order: () => Promise.resolve({ data: [], error: null }) }) }), rpc: () => Promise.resolve({ data: null, error: null }) }),
  }),
  supabase: { from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }) },
}));

vi.mock('fs', () => {
  const readFileSync = vi.fn().mockReturnValue('template {{QUESTION}} {{CONTEXT}} {{SCHEMA}} {{SEMANTIC_LAYER}}');
  return { default: { readFileSync }, readFileSync };
});

describe('SQLAgent', () => {
  const mockLLM: LLMProvider = {
    complete: vi.fn().mockResolvedValue({ content: 'ok', tokensUsed: 0, finishReason: 'stop' } as LLMResponse),
  };
  const mockDb = { from: vi.fn(), rpc: vi.fn() };
  const mockTools: ToolRegistry = { execute: vi.fn() };

  it('should be defined', () => {
    expect(SQLAgent).toBeDefined();
  });

  it('should have a name sql-agent', () => {
    const agent = new SQLAgent(mockLLM, mockDb as any, mockTools);
    expect(agent.name).toBe('sql-agent');
  });

  it('should build a prompt with context', () => {
    const agent = new SQLAgent(mockLLM, mockDb as any, mockTools);
    const schema = new DatabaseSchema([]);
    const semanticLayer = new SemanticLayer([]);
    const prompt = (agent as any).buildPrompt('test question', schema, semanticLayer, { key: 'value' });
    expect(prompt).toContain('test question');
    expect(prompt).toContain('"key":"value"');
  });
});
