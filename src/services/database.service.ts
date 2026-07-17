import { supabase } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

const ORG_SLUG = 'default-org'
const ORG_NAME = 'Default Organization'

const dbClient = supabase as any

async function ensureOrg(): Promise<string> {
  const { data: org } = await dbClient.from('organizations').select('id').eq('slug', ORG_SLUG).maybeSingle()
  if (org) return org.id
  const { data: created } = await dbClient.from('organizations').insert({ name: ORG_NAME, slug: ORG_SLUG }).select('id').single()
  return created?.id ?? 'fallback-org-id'
}

async function getOrgId(): Promise<string> {
  try { return await ensureOrg() } catch { return 'fallback-org-id' }
}

export const db = {
  async getOrganization() {
    try { const id = await ensureOrg(); const { data } = await dbClient.from('organizations').select('*').eq('id', id).single(); return data }
    catch { return null }
  },
  async getProfiles() {
    try { const { data } = await dbClient.from('profiles').select('*'); return data ?? [] }
    catch { return [] }
  },
  async getInvoices() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('finance_invoices').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getBudgets() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('finance_budgets').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getTransactions() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('finance_transactions').select('*').eq('organization_id', orgId).order('transaction_date', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getCustomers() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('crm_customers').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getLeads() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('crm_leads').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getDeals() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('crm_deals').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getActivities() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('crm_activities').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getOrders() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('sales_orders').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getSalesProducts() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('sales_products').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getEmployees() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('hr_employees').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getDepartments() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('hr_departments').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getPayroll() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('hr_payroll').select('*').eq('organization_id', orgId).order('pay_period_start', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getProjects() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('projects_projects').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getTasks(projectId?: string) {
    try {
      const orgId = await getOrgId()
      let q = dbClient.from('projects_tasks').select('*').eq('organization_id', orgId)
      if (projectId) q = q.eq('project_id', projectId)
      const { data } = await q.order('created_at', { ascending: false }); return data ?? []
    } catch { return [] }
  },
  async getInventoryProducts() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('inventory_products').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getWarehouses() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('inventory_warehouses').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getSuppliers() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('inventory_suppliers').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getDocuments() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('documents').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async getNotifications() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('notifications').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },
  async markNotificationRead(id: string) {
    try { await dbClient.from('notifications').update({ read: true }).eq('id', id) } catch { /* ignore */ }
  },
  async getDashboards() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('dashboards').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  async getDataSources() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('data_sources').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },
  subscribeNotifications(callback: (payload: Tables<'notifications'>) => void) {
    let unsub = () => {}
    getOrgId().then((orgId) => {
      const channel = dbClient.channel('notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `organization_id=eq.${orgId}` }, (payload: any) => {
          callback(payload.new as Tables<'notifications'>)
        })
        .subscribe()
      unsub = () => { dbClient.removeChannel(channel) }
    })
    return () => unsub()
  },

  // Imported Datasets
  async getDatasets() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('imported_datasets').select('*').eq('organization_id', orgId).order('created_at', { ascending: false }); return data ?? [] }
    catch { return [] }
  },

  async createDataset(dataset: any) {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('imported_datasets').insert({ ...dataset, organization_id: orgId }).select().single(); return data }
    catch { return null }
  },

  async updateDataset(id: string, updates: any) {
    try { await dbClient.from('imported_datasets').update(updates).eq('id', id) } catch { /* ignore */ }
  },

  async deleteDataset(id: string) {
    try { await dbClient.from('imported_datasets').delete().eq('id', id) } catch { /* ignore */ }
  },

  // Import Mappings
  async getMappings() {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('import_mappings').select('*').eq('organization_id', orgId); return data ?? [] }
    catch { return [] }
  },

  async createMapping(mapping: any) {
    try { const orgId = await getOrgId(); const { data } = await dbClient.from('import_mappings').insert({ ...mapping, organization_id: orgId }).select().single(); return data }
    catch { return null }
  },

  async deleteMapping(id: string) {
    try { await dbClient.from('import_mappings').delete().eq('id', id) } catch { /* ignore */ }
  },
}
