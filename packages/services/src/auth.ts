import { createClient, type Database } from '../lib/supabase/client';

const db = createClient<Database>();

export interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'analyst' | 'viewer';
  organizationId: string;
  teamId: string | null;
  lastSignInAt: string | null;
}

export class AuthService {
  private db = createClient<Database>();

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return null;

    const { data: profile } = await db
      .from('users')
      .select('full_name, avatar_url, role, organization_id, team_id, last_sign_in_at')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email!,
      fullName: profile?.full_name || null,
      avatarUrl: profile?.avatar_url || null,
      role: profile?.role || 'viewer',
      organizationId: profile?.organization_id || '',
      teamId: profile?.team_id || null,
      lastSignInAt: profile?.last_sign_in_at || null,
    };
  }

  async signUp(email: string, password: string, orgName: string, orgSlug: string): Promise<{
    user: any;
    organizationId: string;
    session: any;
  }> {
    const { data: authData, error: authError } = await db.auth.signUp({
      email,
      password,
      options: {
        data: {
          organization_name: orgName,
          organization_slug: orgSlug,
        },
      },
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Signup failed');

    // The database trigger will create organization, profile, and org_member
    // Wait for it
    await new Promise(r => setTimeout(r, 1000));

    const { data: profile } = await db
      .from('users')
      .select('organization_id')
      .eq('id', authData.user.id)
      .single();

    const { data: session } = await db.auth.getSession();

    return {
      user: authData.user,
      organizationId: profile?.organization_id || '',
      session: session.session,
    };
  }

  async signIn(email: string, password: string): Promise<{ user: any; session: any }> {
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return { user: data.user, session: data.session };
  }

  async signOut(): Promise<void> {
    const { error } = await db.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async resetPassword(email: string, redirectTo: string): Promise<void> {
    const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw new Error(error.message);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await db.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  }

  async updateProfile(data: { fullName?: string; avatarUrl?: string }): Promise<AuthUser> {
    const { data: { user } } = await db.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await db.auth.updateUser({ data });
    if (error) throw new Error(error.message);

    return this.getCurrentUser()!;
  }

  async inviteUser(orgId: string, email: string, role: 'admin' | 'analyst' | 'viewer', teamIds?: string[]): Promise<{ user: any; inviteSent: boolean }> {
    const { data: invite, error } = await db.auth.admin.inviteUserByEmail(email, {
      data: { organization_id: orgId, role },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/accept-invite`,
    });

    if (error) throw new Error(`Failed to invite user: ${error.message}`);

    if (teamIds?.length && invite.user) {
      const memberships = teamIds.map(teamId => ({
        team_id: teamId,
        user_id: invite.user!.id,
        role: 'member' as const,
      }));
      const { error: memberError } = await db.from('team_members').insert(memberships);
      if (memberError) throw new Error(`Failed to add team members: ${memberError.message}`);
    }

    return { user: invite.user!, inviteSent: true };
  }

  async updateUserRole(userId: string, role: 'owner' | 'admin' | 'analyst' | 'viewer'): Promise<AuthUser> {
    const { data, error } = await db
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update role: ${error.message}`);
    return { ...data, email: '', lastSignInAt: null }; // Would need to fetch from auth
  }

  async removeUser(userId: string): Promise<void> {
    const { error } = await db.auth.admin.deleteUser(userId);
    if (error) throw new Error(`Failed to remove user: ${error.message}`);
  }

  async updateUserTeam(userId: string, teamId: string | null): Promise<void> {
    const { error } = await db
      .from('users')
      .update({ team_id: teamId, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw new Error(`Failed to update team: ${error.message}`);
  }

  async acceptInvite(token: string): Promise<{ user: any; session: any }> {
    const { data, error } = await db.auth.verifyOtp({ token_hash: token, type: 'invite' });
    if (error) throw new Error(error.message);
    return { user: data.user, session: data.session };
  }

  async getMFAFactors(userId: string): Promise<any[]> {
    const { data } = await db.auth.admin.listFactors(userId);
    return data?.factors || [];
  }

  async enrollMFA(userId: string, factorType: 'totp' | 'phone'): Promise<{ factor: any; qrCode?: string }> {
    const { data, error } = await db.auth.admin.enrollFactor(userId, { factorType });
    if (error) throw new Error(error.message);
    return data;
  }

  async challengeMFA(userId: string, factorId: string, code: string): Promise<void> {
    const { error } = await db.auth.admin.challengeFactor(userId, factorId, { code });
    if (error) throw new Error(error.message);
  }

  async unenrollMFA(userId: string, factorId: string): Promise<void> {
    const { error } = await db.auth.admin.unenrollFactor(userId, factorId);
    if (error) throw new Error(error.message);
  }

  async getSession(): Promise<{ user: AuthUser | null; session: any }> {
    const { data: { session } } = await db.auth.getSession();
    if (!session) return { user: null, session: null };

    const user = await this.getCurrentUser();
    return { user, session };
  }

  onAuthStateChange(callback: (event: string, session: any) => void): { unsubscribe: () => void } {
    const { data: { subscription } } = db.auth.onAuthStateChange(callback);
    return { unsubscribe: () => subscription.unsubscribe() };
  }
}

export function getAuthService(): AuthService {
  return new AuthService();
}