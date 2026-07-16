export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; full_name: string | null; avatar_url: string | null; active_org_id: string | null; created_at: string };
        Insert: { id: string; email: string; full_name?: string | null; avatar_url?: string | null; active_org_id?: string | null; created_at?: string };
        Update: { id?: string; email?: string; full_name?: string | null; avatar_url?: string | null; active_org_id?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "profiles_id_fkey"; columns: ["id"]; referencedRelation: "users"; referencedColumns: ["id"] }];
      };
      organizations: {
        Row: { id: string; name: string; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; created_at?: string; updated_at?: string };
        Update: { id?: string; name?: string; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      organization_members: {
        Row: { id: string; organization_id: string | null; user_id: string | null; role: string; created_at: string };
        Insert: { id?: string; organization_id?: string | null; user_id?: string | null; role: string; created_at?: string };
        Update: { id?: string; organization_id?: string | null; user_id?: string | null; role?: string; created_at?: string };
        Relationships: [
          { foreignKeyName: "organization_members_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] },
          { foreignKeyName: "organization_members_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      datasets: {
        Row: { id: string; user_id: string | null; organization_id: string | null; name: string; description: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id?: string | null; organization_id?: string | null; name: string; description?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string | null; organization_id?: string | null; name?: string; description?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "datasets_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      uploaded_files: {
        Row: { id: string; dataset_id: string | null; user_id: string | null; file_name: string; file_size: number; file_type: string; storage_path: string; created_at: string };
        Insert: { id?: string; dataset_id?: string | null; user_id?: string | null; file_name: string; file_size: number; file_type: string; storage_path: string; created_at?: string };
        Update: { id?: string; dataset_id?: string | null; user_id?: string | null; file_name?: string; file_size?: number; file_type?: string; storage_path?: string; created_at?: string };
        Relationships: [
          { foreignKeyName: "uploaded_files_dataset_id_fkey"; columns: ["dataset_id"]; referencedRelation: "datasets"; referencedColumns: ["id"] },
          { foreignKeyName: "uploaded_files_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      dashboards: {
        Row: { id: string; user_id: string | null; organization_id: string | null; title: string; layout: Json | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id?: string | null; organization_id?: string | null; title: string; layout?: Json | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string | null; organization_id?: string | null; title?: string; layout?: Json | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "dashboards_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      chat_messages: {
        Row: { id: string; user_id: string | null; role: string; content: string; session_id: string | null; created_at: string };
        Insert: { id?: string; user_id?: string | null; role: string; content: string; session_id?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string | null; role?: string; content?: string; session_id?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "chat_messages_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] }];
      };
      accounts: {
        Row: { id: string; organization_id: string; name: string; type: string; code: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; name: string; type: string; code?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; type?: string; code?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "accounts_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      transactions: {
        Row: { id: string; organization_id: string; account_id: string | null; amount: number; type: string; description: string | null; category: string | null; date: string; created_by: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; account_id?: string | null; amount: number; type: string; description?: string | null; category?: string | null; date?: string; created_by?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; account_id?: string | null; amount?: number; type?: string; description?: string | null; category?: string | null; date?: string; created_by?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "transactions_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      invoices: {
        Row: { id: string; organization_id: string; invoice_number: string; customer_id: string | null; status: string; subtotal: number; tax: number; total: number; due_date: string | null; paid_at: string | null; notes: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; invoice_number: string; customer_id?: string | null; status?: string; subtotal?: number; tax?: number; total?: number; due_date?: string | null; paid_at?: string | null; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; invoice_number?: string; customer_id?: string | null; status?: string; subtotal?: number; tax?: number; total?: number; due_date?: string | null; paid_at?: string | null; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "invoices_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      invoice_items: {
        Row: { id: string; invoice_id: string; description: string; quantity: number; unit_price: number; total: number };
        Insert: { id?: string; invoice_id: string; description: string; quantity?: number; unit_price?: number; total?: number };
        Update: { id?: string; invoice_id?: string; description?: string; quantity?: number; unit_price?: number; total?: number };
        Relationships: [{ foreignKeyName: "invoice_items_invoice_id_fkey"; columns: ["invoice_id"]; referencedRelation: "invoices"; referencedColumns: ["id"] }];
      };
      budgets: {
        Row: { id: string; organization_id: string; department: string; category: string; amount: number; spent: number; period: string; fiscal_year: number; created_at: string };
        Insert: { id?: string; organization_id: string; department: string; category: string; amount: number; spent?: number; period: string; fiscal_year: number; created_at?: string };
        Update: { id?: string; organization_id?: string; department?: string; category?: string; amount?: number; spent?: number; period?: string; fiscal_year?: number; created_at?: string };
        Relationships: [{ foreignKeyName: "budgets_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      customers: {
        Row: { id: string; organization_id: string; name: string; email: string | null; phone: string | null; company: string | null; status: string; lifetime_value: number; notes: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; name: string; email?: string | null; phone?: string | null; company?: string | null; status?: string; lifetime_value?: number; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; email?: string | null; phone?: string | null; company?: string | null; status?: string; lifetime_value?: number; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "customers_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      leads: {
        Row: { id: string; organization_id: string; name: string; email: string | null; phone: string | null; source: string | null; score: number; status: string; assigned_to: string | null; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; name: string; email?: string | null; phone?: string | null; source?: string | null; score?: number; status?: string; assigned_to?: string | null; notes?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; email?: string | null; phone?: string | null; source?: string | null; score?: number; status?: string; assigned_to?: string | null; notes?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "leads_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] },
          { foreignKeyName: "leads_assigned_to_fkey"; columns: ["assigned_to"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      deals: {
        Row: { id: string; organization_id: string; title: string; value: number; stage: string; customer_id: string | null; lead_id: string | null; assigned_to: string | null; probability: number; expected_close_date: string | null; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; title: string; value?: number; stage?: string; customer_id?: string | null; lead_id?: string | null; assigned_to?: string | null; probability?: number; expected_close_date?: string | null; notes?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; title?: string; value?: number; stage?: string; customer_id?: string | null; lead_id?: string | null; assigned_to?: string | null; probability?: number; expected_close_date?: string | null; notes?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "deals_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] },
          { foreignKeyName: "deals_customer_id_fkey"; columns: ["customer_id"]; referencedRelation: "customers"; referencedColumns: ["id"] },
        ];
      };
      activities: {
        Row: { id: string; organization_id: string; type: string; subject: string; description: string | null; related_to: string | null; related_id: string | null; assigned_to: string | null; completed: boolean; due_date: string | null; created_by: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; type: string; subject: string; description?: string | null; related_to?: string | null; related_id?: string | null; assigned_to?: string | null; completed?: boolean; due_date?: string | null; created_by?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; type?: string; subject?: string; description?: string | null; related_to?: string | null; related_id?: string | null; assigned_to?: string | null; completed?: boolean; due_date?: string | null; created_by?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "activities_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      products: {
        Row: { id: string; organization_id: string; name: string; sku: string | null; description: string | null; price: number; cost: number | null; unit: string; active: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; name: string; sku?: string | null; description?: string | null; price?: number; cost?: number | null; unit?: string; active?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; sku?: string | null; description?: string | null; price?: number; cost?: number | null; unit?: string; active?: boolean; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "products_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      orders: {
        Row: { id: string; organization_id: string; order_number: string; customer_id: string | null; status: string; subtotal: number; total: number; notes: string | null; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; order_number: string; customer_id?: string | null; status?: string; subtotal?: number; total?: number; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; order_number?: string; customer_id?: string | null; status?: string; subtotal?: number; total?: number; notes?: string | null; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "orders_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string | null; quantity: number; unit_price: number; total: number };
        Insert: { id?: string; order_id: string; product_id?: string | null; quantity?: number; unit_price?: number; total?: number };
        Update: { id?: string; order_id?: string; product_id?: string | null; quantity?: number; unit_price?: number; total?: number };
        Relationships: [{ foreignKeyName: "order_items_order_id_fkey"; columns: ["order_id"]; referencedRelation: "orders"; referencedColumns: ["id"] }];
      };
      subscriptions: {
        Row: { id: string; organization_id: string; customer_id: string | null; product_id: string | null; status: string; amount: number; interval: string; started_at: string; ends_at: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; customer_id?: string | null; product_id?: string | null; status?: string; amount: number; interval: string; started_at?: string; ends_at?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; customer_id?: string | null; product_id?: string | null; status?: string; amount?: number; interval?: string; started_at?: string; ends_at?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "subscriptions_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      departments: {
        Row: { id: string; organization_id: string; name: string; head_count: number; budget: number; created_at: string };
        Insert: { id?: string; organization_id: string; name: string; head_count?: number; budget?: number; created_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; head_count?: number; budget?: number; created_at?: string };
        Relationships: [{ foreignKeyName: "departments_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      employees: {
        Row: { id: string; organization_id: string; user_id: string | null; department_id: string | null; name: string; email: string; phone: string | null; position: string | null; salary: number; status: string; hired_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; user_id?: string | null; department_id?: string | null; name: string; email: string; phone?: string | null; position?: string | null; salary?: number; status?: string; hired_at?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; user_id?: string | null; department_id?: string | null; name?: string; email?: string; phone?: string | null; position?: string | null; salary?: number; status?: string; hired_at?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "employees_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      attendance: {
        Row: { id: string; employee_id: string; date: string; status: string; check_in: string | null; check_out: string | null; created_at: string };
        Insert: { id?: string; employee_id: string; date?: string; status: string; check_in?: string | null; check_out?: string | null; created_at?: string };
        Update: { id?: string; employee_id?: string; date?: string; status?: string; check_in?: string | null; check_out?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "attendance_employee_id_fkey"; columns: ["employee_id"]; referencedRelation: "employees"; referencedColumns: ["id"] }];
      };
      leave_requests: {
        Row: { id: string; employee_id: string; type: string; start_date: string; end_date: string; status: string; reason: string | null; approved_by: string | null; created_at: string };
        Insert: { id?: string; employee_id: string; type: string; start_date: string; end_date: string; status?: string; reason?: string | null; approved_by?: string | null; created_at?: string };
        Update: { id?: string; employee_id?: string; type?: string; start_date?: string; end_date?: string; status?: string; reason?: string | null; approved_by?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "leave_requests_employee_id_fkey"; columns: ["employee_id"]; referencedRelation: "employees"; referencedColumns: ["id"] }];
      };
      projects: {
        Row: { id: string; organization_id: string; name: string; description: string | null; status: string; priority: string; start_date: string | null; end_date: string | null; budget: number; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; name: string; description?: string | null; status?: string; priority?: string; start_date?: string | null; end_date?: string | null; budget?: number; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; description?: string | null; status?: string; priority?: string; start_date?: string | null; end_date?: string | null; budget?: number; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "projects_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      project_tasks: {
        Row: { id: string; project_id: string; title: string; description: string | null; status: string; priority: string; assignee: string | null; due_date: string | null; position: number; created_at: string; updated_at: string };
        Insert: { id?: string; project_id: string; title: string; description?: string | null; status?: string; priority?: string; assignee?: string | null; due_date?: string | null; position?: number; created_at?: string; updated_at?: string };
        Update: { id?: string; project_id?: string; title?: string; description?: string | null; status?: string; priority?: string; assignee?: string | null; due_date?: string | null; position?: number; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "project_tasks_project_id_fkey"; columns: ["project_id"]; referencedRelation: "projects"; referencedColumns: ["id"] }];
      };
      project_comments: {
        Row: { id: string; task_id: string; author_id: string | null; content: string; created_at: string };
        Insert: { id?: string; task_id: string; author_id?: string | null; content: string; created_at?: string };
        Update: { id?: string; task_id?: string; author_id?: string | null; content?: string; created_at?: string };
        Relationships: [{ foreignKeyName: "project_comments_task_id_fkey"; columns: ["task_id"]; referencedRelation: "project_tasks"; referencedColumns: ["id"] }];
      };
      time_entries: {
        Row: { id: string; task_id: string | null; user_id: string | null; duration: number; description: string | null; date: string; created_at: string };
        Insert: { id?: string; task_id?: string | null; user_id?: string | null; duration: number; description?: string | null; date?: string; created_at?: string };
        Update: { id?: string; task_id?: string | null; user_id?: string | null; duration?: number; description?: string | null; date?: string; created_at?: string };
        Relationships: [{ foreignKeyName: "time_entries_task_id_fkey"; columns: ["task_id"]; referencedRelation: "project_tasks"; referencedColumns: ["id"] }];
      };
      warehouses: {
        Row: { id: string; organization_id: string; name: string; location: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; name: string; location?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; location?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "warehouses_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      stock_items: {
        Row: { id: string; organization_id: string; product_id: string; warehouse_id: string | null; quantity: number; min_stock: number; max_stock: number; location: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; product_id: string; warehouse_id?: string | null; quantity?: number; min_stock?: number; max_stock?: number; location?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; product_id?: string; warehouse_id?: string | null; quantity?: number; min_stock?: number; max_stock?: number; location?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "stock_items_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      suppliers: {
        Row: { id: string; organization_id: string; name: string; email: string | null; phone: string | null; lead_time: number; created_at: string };
        Insert: { id?: string; organization_id: string; name: string; email?: string | null; phone?: string | null; lead_time?: number; created_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; email?: string | null; phone?: string | null; lead_time?: number; created_at?: string };
        Relationships: [{ foreignKeyName: "suppliers_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      purchase_orders: {
        Row: { id: string; organization_id: string; supplier_id: string | null; po_number: string; status: string; total: number; ordered_at: string | null; received_at: string | null; created_by: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; supplier_id?: string | null; po_number: string; status?: string; total?: number; ordered_at?: string | null; received_at?: string | null; created_by?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; supplier_id?: string | null; po_number?: string; status?: string; total?: number; ordered_at?: string | null; received_at?: string | null; created_by?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "purchase_orders_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      document_folders: {
        Row: { id: string; organization_id: string; name: string; parent_id: string | null; created_by: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; name: string; parent_id?: string | null; created_by?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; name?: string; parent_id?: string | null; created_by?: string | null; created_at?: string };
        Relationships: [{ foreignKeyName: "document_folders_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      documents: {
        Row: { id: string; organization_id: string; folder_id: string | null; name: string; type: string; size: number; storage_path: string | null; version: number; permissions: Json; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id: string; folder_id?: string | null; name: string; type: string; size?: number; storage_path?: string | null; version?: number; permissions?: Json; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; organization_id?: string; folder_id?: string | null; name?: string; type?: string; size?: number; storage_path?: string | null; version?: number; permissions?: Json; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "documents_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] }];
      };
      notifications: {
        Row: { id: string; organization_id: string; user_id: string; type: string; title: string; message: string | null; read: boolean; link: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; user_id: string; type: string; title: string; message?: string | null; read?: boolean; link?: string | null; created_at?: string };
        Update: { id?: string; organization_id?: string; user_id?: string; type?: string; title?: string; message?: string | null; read?: boolean; link?: string | null; created_at?: string };
        Relationships: [
          { foreignKeyName: "notifications_organization_id_fkey"; columns: ["organization_id"]; referencedRelation: "organizations"; referencedColumns: ["id"] },
          { foreignKeyName: "notifications_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
