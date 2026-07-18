import { createClient, type Database } from '../../src/lib/supabase/client';

const db = createClient<Database>();

export interface UserPermissions {
  canView: boolean;
  canEdit: boolean;
  canAdmin: boolean;
  canManageUsers: boolean;
  canManageBilling: boolean;
  canAccessAPI: boolean;
  canCreateDashboards: boolean;
  canManageMetrics: boolean;
  canManageAlerts: boolean;
  canManageIntegrations: boolean;
  canManageDataSources: boolean;
  canExportData: boolean;
}

export class PermissionsService {
  private db = createClient<Database>();

  async getUserPermissions(userId: string, orgId: string): Promise<UserPermissions> {
    // Get user's role and team memberships
    const { data: user } = await db
      .from('users')
      .select('role, team_id')
      .eq('id', userId)
      .eq('organization_id', orgId)
      .single();

    if (!user) {
      return this.getDefaultPermissions();
    }

    // Get team permissions
    const teamPerms = user.team_id ? await this.getTeamPermissions(user.team_id) : {};

    // Merge user role + team permissions
    return this.mergePermissions(user.role, teamPerms);
  }

  async canAccessDashboard(dashboardId: string, userId: string, permission: 'view' | 'edit' | 'admin'): Promise<boolean> {
    const { data: dashboard } = await db
      .from('dashboards_v2')
      .select('organization_id')
      .eq('id', dashboardId)
      .single();

    if (!dashboard) return false;

    const permissions = await this.getUserPermissions(userId, dashboard.organization_id);
    
    switch (permission) {
      case 'view':
        return permissions.canView;
      case 'edit':
        return permissions.canEdit;
      case 'admin':
        return permissions.canAdmin;
      default:
        return false;
    }
  }

  async getDashboardPermissions(dashboardId: string, userId: string): Promise<{
    canView: boolean;
    canEdit: boolean;
    canAdmin: boolean;
  }> {
    const permissions = await this.getUserDashboardPermissions(dashboardId, userId);
    return {
      canView: permissions.includes('view') || permissions.includes('edit') || permissions.includes('admin'),
      canEdit: permissions.includes('edit') || permissions.includes('admin'),
      canAdmin: permissions.includes('admin'),
    };
  }

  private async getUserDashboardPermissions(dashboardId: string, userId: string): Promise<string[]> {
    const { data: dashboard } = await db
      .from('dashboards_v2')
      .select('organization_id')
      .eq('id', dashboardId)
      .single();

    if (!dashboard) return [];

    // Check direct permissions
    const { data: directPerms } = await db
      .from('dashboard_permissions')
      .select('permission')
      .eq('dashboard_id', dashboardId)
      .eq('principal_type', 'user')
      .eq('principal_id', userId);

    const perms = new Set(directPerms?.map(p => p.permission) || []);

    // Check team permissions
    const { data: user } = await db
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single();

    if (user?.team_id) {
      const { data: teamPerms } = await db
        .from('dashboard_permissions')
        .select('permission')
        .eq('dashboard_id', dashboardId)
        .eq('principal_type', 'team')
        .eq('principal_id', user.team_id);

      (teamPerms || []).forEach(p => perms.add(p.permission));
    }

    // Check public access
    const { data: dashboardData } = await db
      .from('dashboards_v2')
      .select('is_public')
      .eq('id', dashboardId)
      .single();

    if (dashboardData?.is_public) {
      perms.add('view');
    }

    return Array.from(perms);
  }

  private async getTeamPermissions(teamId: string): Promise<Partial<UserPermissions>> {
    const { data: team } = await db
      .from('teams')
      .select('default_role')
      .eq('id', teamId)
      .single();

    if (!team) return {};

    return this.getRolePermissions(team.default_role || 'member');
  }

  private getRolePermissions(role: string): Partial<UserPermissions> {
    const rolePermissions: Record<string, Partial<UserPermissions>> = {
      owner: {
        canView: true, canEdit: true, canAdmin: true,
        canManageUsers: true, canManageBilling: true, canAccessAPI: true,
        canCreateDashboards: true, canManageMetrics: true, canManageAlerts: true,
        canManageIntegrations: true, canManageDataSources: true, canExportData: true,
      },
      admin: {
        canView: true, canEdit: true, canAdmin: true,
        canManageUsers: true, canManageBilling: false, canAccessAPI: true,
        canCreateDashboards: true, canManageMetrics: true, canManageAlerts: true,
        canManageIntegrations: true, canManageDataSources: true, canExportData: true,
      },
      analyst: {
        canView: true, canEdit: true, canAdmin: false,
        canManageUsers: false, canManageBilling: false, canAccessAPI: true,
        canCreateDashboards: true, canManageMetrics: true, canManageAlerts: true,
        canManageIntegrations: false, canManageDataSources: true, canExportData: true,
      },
      analyst_viewer: {
        canView: true, canEdit: false, canAdmin: false,
        canManageUsers: false, canManageBilling: false, canAccessAPI: false,
        canCreateDashboards: false, canManageMetrics: false, canManageAlerts: false,
        canManageIntegrations: false, canManageDataSources: false, canExportData: true,
      },
      viewer: {
        canView: true, canEdit: false, canAdmin: false,
        canManageUsers: false, canManageBilling: false, canAccessAPI: false,
        canCreateDashboards: false, canManageMetrics: false, canManageAlerts: false,
        canManageIntegrations: false, canManageDataSources: false, canExportData: false,
      },
    };

    return rolePermissions[role] || this.getDefaultPermissions();
  }

  private getDefaultPermissions(): UserPermissions {
    return {
      canView: false,
      canEdit: false,
      canAdmin: false,
      canManageUsers: false,
      canManageBilling: false,
      canAccessAPI: false,
      canCreateDashboards: false,
      canManageMetrics: false,
      canManageAlerts: false,
      canManageIntegrations: false,
      canManageDataSources: false,
      canExportData: false,
    };
  }

  private mergePermissions(userRole: string, teamPerms: Partial<UserPermissions>): UserPermissions {
    const rolePerms = this.getRolePermissions(userRole);
    const defaults = this.getDefaultPermissions();

    return {
      canView: rolePerms.canView || teamPerms.canView || defaults.canView,
      canEdit: rolePerms.canEdit || teamPerms.canEdit || defaults.canEdit,
      canAdmin: rolePerms.canAdmin || teamPerms.canAdmin || defaults.canAdmin,
      canManageUsers: rolePerms.canManageUsers || teamPerms.canManageUsers || defaults.canManageUsers,
      canManageBilling: rolePerms.canManageBilling || teamPerms.canManageBilling || defaults.canManageBilling,
      canAccessAPI: rolePerms.canAccessAPI || teamPerms.canAccessAPI || defaults.canAccessAPI,
      canCreateDashboards: rolePerms.canCreateDashboards || teamPerms.canCreateDashboards || defaults.canCreateDashboards,
      canManageMetrics: rolePerms.canManageMetrics || teamPerms.canManageMetrics || defaults.canManageMetrics,
      canManageAlerts: rolePerms.canManageAlerts || teamPerms.canManageAlerts || defaults.canManageAlerts,
      canManageIntegrations: rolePerms.canManageIntegrations || teamPerms.canManageIntegrations || defaults.canManageIntegrations,
      canManageDataSources: rolePerms.canManageDataSources || teamPerms.canManageDataSources || defaults.canManageDataSources,
      canExportData: rolePerms.canExportData || teamPerms.canExportData || defaults.canExportData,
    };
  }

  private getRolePermissions(role: string): UserPermissions {
    return this.getRolePermissions(role) as UserPermissions;
  }

  async setDashboardPermissions(dashboardId: string, permissions: Array<{
    principalType: 'user' | 'team' | 'public';
    principalId: string | null;
    permission: 'view' | 'edit' | 'admin';
  }>, grantedBy: string): Promise<void> {
    const transaction = await this.db.rpc('set_dashboard_permissions', {
      p_dashboard_id: dashboardId,
      p_permissions: permissions,
      p_granted_by: grantedBy,
    });

    if (transaction.error) throw new Error(transaction.error.message);
  }

  async getAPIKeyPermissions(keyId: string): Promise<{ scopes: string[]; rateLimit: number }> {
    const { data } = await db
      .from('api_keys')
      .select('scopes, rate_limit')
      .eq('id', keyId)
      .single();

    return { scopes: data?.scopes || [], rateLimit: data?.rate_limit || 1000 };
  }

  async checkAPIKeyScope(keyId: string, scope: string): Promise<boolean> {
    const { scopes } = await this.getAPIKeyPermissions(keyId);
    return scopes.includes(scope) || scopes.includes('admin');
  }
}

export function getPermissionsService(): PermissionsService {
  return new PermissionsService();
}