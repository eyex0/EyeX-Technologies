import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Customer = Database["public"]["Tables"]["crm_customers"]["Row"];
type CustomerInsert = Database["public"]["Tables"]["crm_customers"]["Insert"];
type CustomerUpdate = Database["public"]["Tables"]["crm_customers"]["Update"];
type Lead = Database["public"]["Tables"]["crm_leads"]["Row"];
type LeadInsert = Database["public"]["Tables"]["crm_leads"]["Insert"];
type LeadUpdate = Database["public"]["Tables"]["crm_leads"]["Update"];
type Deal = Database["public"]["Tables"]["crm_deals"]["Row"];
type DealInsert = Database["public"]["Tables"]["crm_deals"]["Insert"];
type DealUpdate = Database["public"]["Tables"]["crm_deals"]["Update"];
type Activity = Database["public"]["Tables"]["crm_activities"]["Row"];
type ActivityInsert = Database["public"]["Tables"]["crm_activities"]["Insert"];

export interface CrmSummary {
  totalCustomers: number;
  activeCustomers: number;
  totalLeads: number;
  newLeads: number;
  pipelineValue: number;
  closedDeals: number;
  totalDealValue: number;
  conversionRate: number;
}

export const CrmService = {
  async getCustomers(organizationId?: string): Promise<Customer[]> {
    let query = supabase
      .from("crm_customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getCustomer(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from("crm_customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCustomer(customer: CustomerInsert): Promise<Customer> {
    const { data, error } = await supabase
      .from("crm_customers")
      .insert(customer)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomer(id: string, updates: CustomerUpdate): Promise<Customer> {
    const { data, error } = await supabase
      .from("crm_customers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase
      .from("crm_customers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getLeads(organizationId?: string): Promise<Lead[]> {
    let query = supabase
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createLead(lead: LeadInsert): Promise<Lead> {
    const { data, error } = await supabase
      .from("crm_leads")
      .insert(lead)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLead(id: string, updates: LeadUpdate): Promise<Lead> {
    const { data, error } = await supabase
      .from("crm_leads")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDeals(organizationId?: string): Promise<Deal[]> {
    let query = supabase
      .from("crm_deals")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createDeal(deal: DealInsert): Promise<Deal> {
    const { data, error } = await supabase
      .from("crm_deals")
      .insert(deal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeal(id: string, updates: DealUpdate): Promise<Deal> {
    const { data, error } = await supabase
      .from("crm_deals")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getActivities(organizationId?: string): Promise<Activity[]> {
    let query = supabase
      .from("crm_activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createActivity(activity: ActivityInsert): Promise<Activity> {
    const { data, error } = await supabase
      .from("crm_activities")
      .insert(activity)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSummary(organizationId?: string): Promise<CrmSummary> {
    const customers = await this.getCustomers(organizationId);
    const leads = await this.getLeads(organizationId);
    const deals = await this.getDeals(organizationId);

    const activeCustomers = customers.filter((c) => c.status === "active" || c.status === "vip").length;
    const newLeads = leads.filter((l) => l.status === "new").length;

    const openDeals = deals.filter(
      (d) => d.stage !== "closed_won" && d.stage !== "closed_lost"
    );
    const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.value), 0);

    const closedWon = deals.filter((d) => d.stage === "closed_won");
    const closedDeals = closedWon.length;
    const totalDealValue = closedWon.reduce((sum, d) => sum + Number(d.value), 0);

    const totalDeals = deals.length;
    const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;

    return {
      totalCustomers: customers.length,
      activeCustomers,
      totalLeads: leads.length,
      newLeads,
      pipelineValue,
      closedDeals,
      totalDealValue,
      conversionRate,
    };
  },
};
