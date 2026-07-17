import { createClient, type Database } from '../lib/supabase/client';
import { Octokit } from '@octokit/rest';
import { createGitHubAppAuth } from '@octokit/auth-app';

const db = createClient<Database>();

export class GitOpsService {
  private db = createClient<Database>();

  async syncDashboard(dashboardId: string, orgId: string): Promise<{ success: boolean; commitHash?: string; error?: string }> {
    const { data: dashboard } = await db
      .from('dashboards_v2')
      .select('*, organization:organizations(git_repo, git_branch, git_path)')
      .eq('id', dashboardId)
      .eq('organization_id', orgId)
      .single();

    if (!dashboard) return { success: false, error: 'Dashboard not found' };
    if (!dashboard.organization.git_repo) return { success: false, error: 'Git sync not configured' };

    const octokit = await this.getOctokit(orgId);
    if (!octokit) return { success: false, error: 'GitHub auth not configured' };

    const spec = JSON.stringify(dashboard.spec, null, 2);
    const path = `${dashboard.organization.git_path || 'dashboards'}/${dashboard.slug}.json`;
    const branch = dashboard.organization.git_branch || 'main';
    const message = `Update dashboard: ${dashboard.name} (${dashboardId})`;

    try {
      // Get current file
      const { data: currentFile } = await this.getFileContent(octokit, dashboard.organization.git_repo, path, branch);
      const currentSha = currentFile?.sha;

      // Create/update file
      const { data: commit } = await octokit.repos.createOrUpdateFileContents({
        owner: this.getOwner(dashboard.organization.git_repo),
        repo: this.getRepo(dashboard.organization.git_repo),
        path,
        message,
        content: Buffer.from(spec).toString('base64'),
        sha: currentSha,
        branch,
        committer: { name: 'EyeX Bot', email: 'bot@eyex.ai' },
        author: { name: 'EyeX Bot', email: 'bot@eyex.ai' },
      });

      // Update dashboard sync status
      await this.updateSyncStatus(dashboardId, 'synced', commit.data.commit.sha);

      return { success: true, commitHash: commit.data.commit.sha };
    } catch (error) {
      await this.updateSyncStatus(dashboardId, 'error', null, error instanceof Error ? error.message : 'Unknown error');
      return { success: false, error: error instanceof Error ? error.message : 'Sync failed' };
    }
  }

  async pullFromGit(dashboardId: string, orgId: string): Promise<{ success: boolean; spec?: any; error?: string }> {
    const { data: dashboard } = await db
      .from('dashboards_v2')
      .select('*, organization:organizations(git_repo, git_branch, git_path)')
      .eq('id', dashboardId)
      .eq('organization_id', orgId)
      .single();

    if (!dashboard) return { success: false, error: 'Dashboard not found' };
    if (!dashboard.organization.git_repo) return { success: false, error: 'Git sync not configured' };

    const octokit = await this.getOctokit(orgId);
    if (!octokit) return { success: false, error: 'GitHub auth not configured' };

    const path = `${dashboard.organization.git_path || 'dashboards'}/${dashboard.slug}.json`;
    const branch = dashboard.organization.git_branch || 'main';

    try {
      const { data: file } = await this.getFileContent(octokit, dashboard.organization.git_repo, path, branch);
      if (!file) return { success: false, error: 'File not found in repository' };

      const spec = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));

      // Update dashboard spec
      await db
        .from('dashboards_v2')
        .update({ spec, updated_at: new Date().toISOString() })
        .eq('id', dashboardId);

      await this.updateSyncStatus(dashboardId, 'synced', null);

      return { success: true, spec };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Pull failed' };
    }
  }

  async createDashboardVersion(dashboardId: string, version: number, commitMessage: string): Promise<void> {
    const { data: dashboard } = await db
      .from('dashboards_v2')
      .select('spec')
      .eq('id', dashboardId)
      .single();

    await db.from('dashboard_versions').insert({
      dashboard_id: dashboardId,
      version,
      spec: dashboard.spec,
      commit_message: commitMessage,
      committed_by: 'system', // Would be user ID in production
    });
  }

  async getDashboardVersions(dashboardId: string): Promise<Array<{ version: number; spec: any; commit_message: string; committed_by: string; created_at: string }>> {
    const { data, error } = await db
      .from('dashboard_versions')
      .select('*')
      .eq('dashboard_id', dashboardId)
      .order('version', { ascending: false });

    if (error) throw new Error(`Failed to fetch versions: ${error.message}`);
    return data || [];
  }

  async revertDashboard(dashboardId: string, version: number): Promise<void> {
    const { data: versionData } = await db
      .from('dashboard_versions')
      .select('spec, commit_message')
      .eq('dashboard_id', dashboardId)
      .eq('version', version)
      .single();

    if (!versionData) throw new Error('Version not found');

    await db
      .from('dashboards_v2')
      .update({ spec: versionData.spec, updated_at: new Date().toISOString() })
      .eq('id', dashboardId);

    // Create new version for the revert
    const { data: latest } = await db
      .from('dashboard_versions')
      .select('version')
      .eq('dashboard_id', dashboardId)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    await this.createDashboardVersion(dashboardId, (latest?.version ?? 0) + 1, `Revert to v${version}: ${versionData.commit_message}`);
  }

  private async updateSyncStatus(dashboardId: string, status: string, commitSha?: string, error?: string): Promise<void> {
    await db
      .from('dashboards_v2')
      .update({
        sync_status: status,
        last_synced_at: status === 'synced' ? new Date().toISOString() : null,
        sync_error: error,
        git_commit_sha: commitSha,
      })
      .eq('id', dashboardId);
  }

  private async getOctokit(orgId: string): Promise<Octokit | null> {
    // In production, fetch GitHub App installation token from DB
    const { data: org } = await db
      .from('organizations')
      .select('github_app_id, github_installation_id, github_private_key')
      .eq('id', orgId)
      .single();

    if (!org?.github_app_id || !org?.github_installation_id || !org?.github_private_key) {
      return null;
    }

    const auth = createGitHubAppAuth({
      appId: org.github_app_id,
      privateKey: org.github_private_key,
      installationId: org.github_installation_id,
    });

    const authResult = await auth({ type: 'installation', installationId: org.github_installation_id });
    return new Octokit({ auth: authResult.token });
  }

  private async getFileContent(octokit: Octokit, repo: string, path: string, branch: string) {
    const owner = this.getOwner(repo);
    const repoName = this.getRepo(repo);

    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo: repoName,
        path,
        ref: branch,
      });
      return Array.isArray(data) ? data[0] : data;
    } catch (error: any) {
      if (error.status === 404) return { data: null };
      throw error;
    }
  }

  private getOwner(repo: string): string {
    return repo.split('/')[0];
  }

  private getRepo(repo: string): string {
    return repo.split('/')[1];
  }
}

export function getGitOpsService(): GitOpsService {
  return new GitOpsService();
}