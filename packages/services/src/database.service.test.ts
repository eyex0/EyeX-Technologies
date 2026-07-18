import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/lib/supabase/client', () => {
  const mockError = new Error('DB Error');
  const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
  const mockOrder = vi.fn().mockResolvedValue({ data: null, error: mockError });

  return {
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: mockSingle,
        order: mockOrder,
        limit: vi.fn().mockReturnThis(),
        contains: vi.fn().mockReturnThis(),
        gt: vi.fn().mockReturnThis(),
        lt: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
      }),
      rpc: vi.fn(),
      auth: { admin: { inviteUserByEmail: vi.fn(), deleteUser: vi.fn() } },
      functions: { invoke: vi.fn() },
      channel: vi.fn().mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() }),
      removeChannel: vi.fn(),
    },
    getCurrentOrgId: vi.fn().mockResolvedValue('test-org-id'),
    getCurrentUserId: vi.fn().mockResolvedValue('test-user-id'),
  };
});

describe('db', () => {
  it('should export a db object', async () => {
    const { db } = await import('../../../src/services/database.service');
    expect(db).toBeDefined();
    expect(typeof db.getOrganization).toBe('function');
    expect(typeof db.getUsers).toBe('function');
    expect(typeof db.getTeams).toBe('function');
  });

  it('db.getOrganization should handle errors gracefully', async () => {
    const { db } = await import('../../../src/services/database.service');
    await expect(db.getOrganization()).rejects.toThrow('getOrganization: DB Error');
  });

  it('db.getUsers should handle errors gracefully', async () => {
    const { db } = await import('../../../src/services/database.service');
    await expect(db.getUsers()).rejects.toThrow('getUsers: DB Error');
  });

  it('db.getTeams should handle errors gracefully', async () => {
    const { db } = await import('../../../src/services/database.service');
    await expect(db.getTeams()).rejects.toThrow('getTeams: DB Error');
  });
});
