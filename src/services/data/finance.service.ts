import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Invoice = Database["public"]["Tables"]["finance_invoices"]["Row"];
type InvoiceInsert = Database["public"]["Tables"]["finance_invoices"]["Insert"];
type InvoiceUpdate = Database["public"]["Tables"]["finance_invoices"]["Update"];
type Budget = Database["public"]["Tables"]["finance_budgets"]["Row"];
type BudgetInsert = Database["public"]["Tables"]["finance_budgets"]["Insert"];
type Transaction = Database["public"]["Tables"]["finance_transactions"]["Row"];
type TransactionInsert = Database["public"]["Tables"]["finance_transactions"]["Insert"];

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalInvoiced: number;
}

export const FinanceService = {
  async getInvoices(organizationId?: string): Promise<Invoice[]> {
    let query = supabase
      .from("finance_invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getInvoice(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from("finance_invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createInvoice(invoice: InvoiceInsert): Promise<Invoice> {
    const { data, error } = await supabase
      .from("finance_invoices")
      .insert(invoice)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateInvoice(id: string, updates: InvoiceUpdate): Promise<Invoice> {
    const { data, error } = await supabase
      .from("finance_invoices")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from("finance_invoices")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getBudgets(organizationId?: string): Promise<Budget[]> {
    let query = supabase
      .from("finance_budgets")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createBudget(budget: BudgetInsert): Promise<Budget> {
    const { data, error } = await supabase
      .from("finance_budgets")
      .insert(budget)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTransactions(organizationId?: string): Promise<Transaction[]> {
    let query = supabase
      .from("finance_transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createTransaction(transaction: TransactionInsert): Promise<Transaction> {
    const { data, error } = await supabase
      .from("finance_transactions")
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSummary(organizationId?: string): Promise<FinanceSummary> {
    const invoices = await this.getInvoices(organizationId);
    const transactions = await this.getTransactions(organizationId);

    const totalRevenue = transactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const pendingInvoices = invoices.filter(
      (i) => i.status === "sent" || i.status === "draft"
    ).length;

    const overdueInvoices = invoices.filter((i) => i.status === "overdue").length;

    const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.amount), 0);

    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      pendingInvoices,
      overdueInvoices,
      totalInvoiced,
    };
  },
};
