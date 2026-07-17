export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string; name: string; slug: string; logo_url: string | null; plan: string; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; name: string; slug: string; logo_url?: string | null; plan?: string; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; name?: string; slug?: string; logo_url?: string | null; plan?: string; created_at?: string; updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string; email: string; full_name: string | null; avatar_url: string | null; role: string; organization_id: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id: string; email: string; full_name?: string | null; avatar_url?: string | null; role?: string; organization_id?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; email?: string; full_name?: string | null; avatar_url?: string | null; role?: string; organization_id?: string | null; created_at?: string; updated_at?: string
        }
      }
      org_members: {
        Row: {
          id: string; organization_id: string; user_id: string; role: string; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; user_id: string; role?: string; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; user_id?: string; role?: string; created_at?: string
        }
      }
      finance_invoices: {
        Row: {
          id: string; organization_id: string; invoice_number: string; customer_name: string; amount: number; status: string; due_date: string; issued_date: string; description: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; invoice_number: string; customer_name: string; amount: number; status?: string; due_date: string; issued_date?: string; description?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; invoice_number?: string; customer_name?: string; amount?: number; status?: string; due_date?: string; issued_date?: string; description?: string | null; created_at?: string; updated_at?: string
        }
      }
      finance_budgets: {
        Row: {
          id: string; organization_id: string; department: string; category: string; allocated: number; spent: number; period: string; fiscal_year: number; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; department: string; category: string; allocated: number; spent?: number; period: string; fiscal_year: number; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; department?: string; category?: string; allocated?: number; spent?: number; period?: string; fiscal_year?: number; created_at?: string; updated_at?: string
        }
      }
      finance_transactions: {
        Row: {
          id: string; organization_id: string; type: string; category: string; amount: number; description: string | null; transaction_date: string; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; type: string; category: string; amount: number; description?: string | null; transaction_date?: string; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; type?: string; category?: string; amount?: number; description?: string | null; transaction_date?: string; created_at?: string
        }
      }
      crm_customers: {
        Row: {
          id: string; organization_id: string; name: string; email: string | null; phone: string | null; company: string | null; status: string; lifetime_value: number; last_contacted: string | null; notes: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; email?: string | null; phone?: string | null; company?: string | null; status?: string; lifetime_value?: number; last_contacted?: string | null; notes?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; email?: string | null; phone?: string | null; company?: string | null; status?: string; lifetime_value?: number; last_contacted?: string | null; notes?: string | null; created_at?: string; updated_at?: string
        }
      }
      crm_leads: {
        Row: {
          id: string; organization_id: string; name: string; email: string | null; phone: string | null; source: string | null; status: string; owner_id: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; email?: string | null; phone?: string | null; source?: string | null; status?: string; owner_id?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; email?: string | null; phone?: string | null; source?: string | null; status?: string; owner_id?: string | null; created_at?: string; updated_at?: string
        }
      }
      crm_deals: {
        Row: {
          id: string; organization_id: string; name: string; value: number; stage: string; probability: number; close_date: string | null; customer_id: string | null; owner_id: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; value: number; stage?: string; probability?: number; close_date?: string | null; customer_id?: string | null; owner_id?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; value?: number; stage?: string; probability?: number; close_date?: string | null; customer_id?: string | null; owner_id?: string | null; created_at?: string; updated_at?: string
        }
      }
      crm_activities: {
        Row: {
          id: string; organization_id: string; type: string; subject: string; description: string | null; related_to: string | null; related_id: string | null; performed_by: string | null; completed_at: string | null; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; type: string; subject: string; description?: string | null; related_to?: string | null; related_id?: string | null; performed_by?: string | null; completed_at?: string | null; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; type?: string; subject?: string; description?: string | null; related_to?: string | null; related_id?: string | null; performed_by?: string | null; completed_at?: string | null; created_at?: string
        }
      }
      sales_orders: {
        Row: {
          id: string; organization_id: string; order_number: string; customer_id: string | null; total: number; status: string; order_date: string; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; order_number: string; customer_id?: string | null; total: number; status?: string; order_date?: string; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; order_number?: string; customer_id?: string | null; total?: number; status?: string; order_date?: string; created_at?: string; updated_at?: string
        }
      }
      sales_products: {
        Row: {
          id: string; organization_id: string; name: string; sku: string; price: number; cost: number | null; category: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; sku: string; price: number; cost?: number | null; category?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; sku?: string; price?: number; cost?: number | null; category?: string | null; created_at?: string; updated_at?: string
        }
      }
      hr_employees: {
        Row: {
          id: string; organization_id: string; first_name: string; last_name: string; email: string; phone: string | null; position: string; department_id: string | null; salary: number; hire_date: string; status: string; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; first_name: string; last_name: string; email: string; phone?: string | null; position: string; department_id?: string | null; salary: number; hire_date?: string; status?: string; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; first_name?: string; last_name?: string; email?: string; phone?: string | null; position?: string; department_id?: string | null; salary?: number; hire_date?: string; status?: string; created_at?: string; updated_at?: string
        }
      }
      hr_departments: {
        Row: {
          id: string; organization_id: string; name: string; description: string | null; head_id: string | null; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; description?: string | null; head_id?: string | null; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; description?: string | null; head_id?: string | null; created_at?: string
        }
      }
      hr_payroll: {
        Row: {
          id: string; organization_id: string; employee_id: string; salary: number; bonuses: number; deductions: number; pay_period_start: string; pay_period_end: string; status: string; paid_at: string | null; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; employee_id: string; salary: number; bonuses?: number; deductions?: number; pay_period_start: string; pay_period_end: string; status?: string; paid_at?: string | null; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; employee_id?: string; salary?: number; bonuses?: number; deductions?: number; pay_period_start?: string; pay_period_end?: string; status?: string; paid_at?: string | null; created_at?: string
        }
      }
      projects_projects: {
        Row: {
          id: string; organization_id: string; name: string; description: string | null; status: string; priority: string; start_date: string | null; end_date: string | null; owner_id: string | null; budget: number | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; description?: string | null; status?: string; priority?: string; start_date?: string | null; end_date?: string | null; owner_id?: string | null; budget?: number | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; description?: string | null; status?: string; priority?: string; start_date?: string | null; end_date?: string | null; owner_id?: string | null; budget?: number | null; created_at?: string; updated_at?: string
        }
      }
      projects_tasks: {
        Row: {
          id: string; organization_id: string; project_id: string; title: string; description: string | null; status: string; priority: string; assignee_id: string | null; due_date: string | null; estimated_hours: number | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; project_id: string; title: string; description?: string | null; status?: string; priority?: string; assignee_id?: string | null; due_date?: string | null; estimated_hours?: number | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; project_id?: string; title?: string; description?: string | null; status?: string; priority?: string; assignee_id?: string | null; due_date?: string | null; estimated_hours?: number | null; created_at?: string; updated_at?: string
        }
      }
      inventory_products: {
        Row: {
          id: string; organization_id: string; name: string; sku: string; category: string | null; unit_price: number; quantity: number; reorder_level: number; warehouse_id: string | null; supplier_id: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; sku: string; category?: string | null; unit_price: number; quantity?: number; reorder_level?: number; warehouse_id?: string | null; supplier_id?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; sku?: string; category?: string | null; unit_price?: number; quantity?: number; reorder_level?: number; warehouse_id?: string | null; supplier_id?: string | null; created_at?: string; updated_at?: string
        }
      }
      inventory_warehouses: {
        Row: {
          id: string; organization_id: string; name: string; location: string | null; capacity: number | null; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; location?: string | null; capacity?: number | null; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; location?: string | null; capacity?: number | null; created_at?: string
        }
      }
      inventory_suppliers: {
        Row: {
          id: string; organization_id: string; name: string; contact_name: string | null; email: string | null; phone: string | null; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; contact_name?: string | null; email?: string | null; phone?: string | null; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; contact_name?: string | null; email?: string | null; phone?: string | null; created_at?: string
        }
      }
      documents: {
        Row: {
          id: string; organization_id: string; name: string; file_url: string | null; file_type: string | null; size_bytes: number | null; tags: string[] | null; uploaded_by: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; file_url?: string | null; file_type?: string | null; size_bytes?: number | null; tags?: string[] | null; uploaded_by?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; file_url?: string | null; file_type?: string | null; size_bytes?: number | null; tags?: string[] | null; uploaded_by?: string | null; created_at?: string; updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string; organization_id: string; user_id: string | null; title: string; message: string; type: string; read: boolean; created_at: string
        }
        Insert: {
          id?: string; organization_id: string; user_id?: string | null; title: string; message: string; type?: string; read?: boolean; created_at?: string
        }
        Update: {
          id?: string; organization_id?: string; user_id?: string | null; title?: string; message?: string; type?: string; read?: boolean; created_at?: string
        }
      }
      dashboards: {
        Row: {
          id: string; organization_id: string; name: string; description: string | null; config: Json; created_by: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; description?: string | null; config?: Json; created_by?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; description?: string | null; config?: Json; created_by?: string | null; created_at?: string; updated_at?: string
        }
      }
      data_sources: {
        Row: {
          id: string; organization_id: string; name: string; type: string; config: Json; enabled: boolean; last_synced_at: string | null; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; organization_id: string; name: string; type: string; config?: Json; enabled?: boolean; last_synced_at?: string | null; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; organization_id?: string; name?: string; type?: string; config?: Json; enabled?: boolean; last_synced_at?: string | null; created_at?: string; updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      get_organization: {
        Args: { p_slug: string }
        Returns: {
          id: string; name: string; slug: string; logo_url: string | null; plan: string; created_at: string; updated_at: string
        }
      }
      ensure_organization: {
        Args: { p_slug: string; p_name: string }
        Returns: { id: string; name: string; slug: string; logo_url: string | null; plan: string; created_at: string; updated_at: string }
      }
    }
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
