import { describe, it, expect, vi } from 'vitest';

vi.mock('../../src/lib/supabase/client', () => ({
  createClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }) }),
  supabase: { from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }) }) },
}));

describe('SQLValidator', () => {
  it('should export SQLValidator class', async () => {
    const { SQLValidator } = await import('./sql-validator');
    expect(SQLValidator).toBeDefined();
  });

  it('should validate basic SQL', async () => {
    const { SQLValidator } = await import('./sql-validator');
    const validator = new SQLValidator();
    const result = await validator.validate('SELECT 1');
    expect(result).toBeDefined();
    expect(typeof result.valid).toBe('boolean');
  });
});