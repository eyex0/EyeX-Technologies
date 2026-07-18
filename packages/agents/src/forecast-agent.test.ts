import { describe, it, expect, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));
vi.mock('./base', () => ({
  BaseAgent: class {
    name = 'forecast-agent';
    loadPrompt() { return ''; }
    async execute() { return { output: { metric: 'test', horizon: 10, predictions: [], accuracy: {}, modelInfo: {} } }; }
  },
  TokenBudget: class { constructor() {} },
}));

describe('ForecastAgent', () => {
  it('should be defined', async () => {
    const mod = await import('./forecast-agent');
    expect(mod.ForecastAgent).toBeDefined();
  });

  it('should have a name forecast-agent', async () => {
    vi.resetModules();
    const { ForecastAgent } = await import('./forecast-agent');
    const agent = new (ForecastAgent as any)({}, {});
    expect(agent.name).toBe('forecast-agent');
  });
});
