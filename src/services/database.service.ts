import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Dataset = Database["public"]["Tables"]["datasets"]["Row"];
type UploadedFile = Database["public"]["Tables"]["uploaded_files"]["Row"];
type Dashboard = Database["public"]["Tables"]["dashboards"]["Row"];
type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];
type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
type Budget = Database["public"]["Tables"]["budgets"]["Row"];
type Customer = Database["public"]["Tables"]["customers"]["Row"];
type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Deal = Database["public"]["Tables"]["deals"]["Row"];
type Activity = Database["public"]["Tables"]["activities"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type Department = Database["public"]["Tables"]["departments"]["Row"];
type Employee = Database["public"]["Tables"]["employees"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectTask = Database["public"]["Tables"]["project_tasks"]["Row"];
type StockItem = Database["public"]["Tables"]["stock_items"]["Row"];
type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
type Notification = Database["public"]["Tables"]["notifications"]["Row"];

async function getActiveOrgId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await supabase.from("profiles").select("active_org_id").eq("id", session.user.id).single();
  return profile.data?.active_org_id ?? null;
}

async function requireOrg(): Promise<string> {
  const orgId = await getActiveOrgId();
  if (!orgId) throw new Error("No active organization");
  return orgId;
}

export const DatabaseService = {
  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) { console.error("Error fetching profile", error); return null; }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single();
    if (error) throw error;
    return data;
  },

  // Datasets
  async getDatasets(): Promise<Dataset[]> {
    const { data, error } = await supabase.from("datasets").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createDataset(name: string, description?: string): Promise<Dataset> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in to create a dataset");
    const orgId = await getActiveOrgId();
    const { data, error } = await supabase.from("datasets").insert({ name, description, user_id: session.user.id, organization_id: orgId }).select().single();
    if (error) throw error;
    return data;
  },

  async deleteDataset(id: string) {
    const { error } = await supabase.from("datasets").delete().eq("id", id);
    if (error) throw error;
  },

  // Uploaded Files
  async getFilesByDataset(datasetId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase.from("uploaded_files").select("*").eq("dataset_id", datasetId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllUploadedFiles(): Promise<any[]> {
    const { data, error } = await supabase.from("uploaded_files").select("*, datasets(name)").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async recordFileMetadata(fileData: Database["public"]["Tables"]["uploaded_files"]["Insert"]): Promise<UploadedFile> {
    const { data, error } = await supabase.from("uploaded_files").insert(fileData).select().single();
    if (error) throw error;
    return data;
  },

  // Dashboards
  async getDashboards(): Promise<Dashboard[]> {
    const { data, error } = await supabase.from("dashboards").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async saveDashboard(title: string, layout: any): Promise<Dashboard> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in to save a dashboard");
    const orgId = await getActiveOrgId();
    const { data, error } = await supabase.from("dashboards").insert({ title, layout, user_id: session.user.id, organization_id: orgId }).select().single();
    if (error) throw error;
    return data;
  },

  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    const { data, error } = await supabase.from("dashboards").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  // Chat Messages
  async getChatHistory(sessionId?: string): Promise<ChatMessage[]> {
    let query = supabase.from("chat_messages").select("*").order("created_at", { ascending: true });
    if (sessionId) query = query.eq("session_id", sessionId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async saveChatMessage(role: "user" | "assistant" | "system", content: string, sessionId?: string): Promise<ChatMessage> {
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.from("chat_messages").insert({ role, content, session_id: sessionId, user_id: session?.user.id }).select().single();
    if (error) throw error;
    return data;
  },

  // Organization Members
  async getOrganizationMembers(): Promise<any[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];
    const profile = await DatabaseService.getProfile(session.user.id);
    if (!profile || !profile.active_org_id) return [];
    const { data, error } = await supabase.from("organization_members").select("*, profiles(full_name, email, avatar_url)").eq("organization_id", profile.active_org_id);
    if (error) throw error;
    return data || [];
  },

  async getOrganization(orgId: string): Promise<any> {
    const { data, error } = await supabase.from("organizations").select("*").eq("id", orgId).single();
    if (error) throw error;
    return data;
  },

  // ====== FINANCE ======
  async getInvoices(): Promise<Invoice[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("invoices").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createInvoice(invoice: Database["public"]["Tables"]["invoices"]["Insert"]): Promise<Invoice> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("invoices").insert({ ...invoice, organization_id: orgId }).select().single();
    if (error) throw error;
    return data;
  },

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const { data, error } = await supabase.from("invoices").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  async getBudgets(): Promise<Budget[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("budgets").select("*").eq("organization_id", orgId).order("fiscal_year", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getTransactions(): Promise<any[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("transactions").select("*, accounts(name, type)").eq("organization_id", orgId).order("date", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getRevenueExpenses(): Promise<{ revenue: number; expenses: number; months: { label: string; revenue: number; expenses: number }[] }> {
    const orgId = await requireOrg();
    const { data: txns } = await supabase.from("transactions").select("amount, type, category, date").eq("organization_id", orgId).gte("date", new Date(Date.now() - 365 * 86400000).toISOString().split("T")[0]);
    if (!txns) return { revenue: 0, expenses: 0, months: [] };
    const revenue = txns.filter(t => t.type === "credit" || t.category === "revenue").reduce((s, t) => s + Number(t.amount), 0);
    const expenses = txns.filter(t => t.type === "debit" || t.category === "expense").reduce((s, t) => s + Number(t.amount), 0);
    const monthMap: Record<string, { revenue: number; expenses: number }> = {};
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    txns.forEach(t => {
      const m = t.date?.slice(0, 7);
      if (!m) return;
      if (!monthMap[m]) monthMap[m] = { revenue: 0, expenses: 0 };
      if (t.type === "credit" || t.category === "revenue") monthMap[m].revenue += Number(t.amount);
      else monthMap[m].expenses += Number(t.amount);
    });
    const months = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({
      label: monthNames[parseInt(k.slice(5)) - 1] || k,
      revenue: v.revenue,
      expenses: v.expenses,
    }));
    return { revenue, expenses, months };
  },

  // ====== CRM ======
  async getCustomers(): Promise<Customer[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("customers").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getLeads(): Promise<Lead[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("leads").select("*, profiles(full_name)").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getDeals(): Promise<Deal[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("deals").select("*, profiles(full_name), customers(name)").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getActivities(): Promise<Activity[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("activities").select("*").eq("organization_id", orgId).order("created_at", { ascending: false }).limit(20);
    if (error) throw error;
    return data || [];
  },

  // ====== SALES ======
  async getProducts(): Promise<Product[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("products").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getOrders(): Promise<Order[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("orders").select("*, customers(name)").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getSubscriptions(): Promise<Subscription[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("subscriptions").select("*, customers(name), products(name)").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // ====== HR ======
  async getDepartments(): Promise<Department[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("departments").select("*").eq("organization_id", orgId);
    if (error) throw error;
    return data || [];
  },

  async getEmployees(): Promise<Employee[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("employees").select("*, departments(name)").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // ====== PROJECTS ======
  async getProjects(): Promise<Project[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("projects").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getProjectTasks(projectId?: string): Promise<ProjectTask[]> {
    const orgId = await requireOrg();
    let query = supabase.from("project_tasks").select("*, profiles(full_name), projects!inner(organization_id)").eq("projects.organization_id", orgId);
    if (projectId) query = query.eq("project_id", projectId);
    const { data, error } = await query.order("position", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  // ====== INVENTORY ======
  async getStockItems(): Promise<any[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("stock_items").select("*, products(name, sku), warehouses(name)").eq("organization_id", orgId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getSuppliers(): Promise<Supplier[]> {
    const orgId = await requireOrg();
    const { data, error } = await supabase.from("suppliers").select("*").eq("organization_id", orgId);
    if (error) throw error;
    return data || [];
  },

  // ====== NOTIFICATIONS ======
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    return data || [];
  },

  async markNotificationRead(id: string) {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
    if (error) throw error;
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("read", false);
    if (error) return 0;
    return count || 0;
  },
};
