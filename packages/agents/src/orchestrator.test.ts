import { describe, it, expect } from 'vitest';
import { AgentOrchestrator } from './orchestrator';

describe('AgentOrchestrator', () => {
  it('should be defined', () => {
    expect(AgentOrchestrator).toBeDefined();
  });

  it('should create instance with default config', () => {
    const orchestrator = new AgentOrchestrator({
      openaiApiKey: 'test-key',
      supabaseUrl: 'https://test.supabase.co',
      supabaseServiceKey: 'test-svc-key',
    });
    expect(orchestrator).toBeInstanceOf(AgentOrchestrator);
  });
});