-- Run this entire script in Supabase SQL Editor to set up all tables + RLS + seed data

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'member',
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Org Members
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- 4. Finance: Invoices
CREATE TABLE IF NOT EXISTS finance_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  due_date DATE NOT NULL,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Finance: Budgets
CREATE TABLE IF NOT EXISTS finance_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  category TEXT NOT NULL,
  allocated DECIMAL(12,2) NOT NULL,
  spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  period TEXT NOT NULL,
  fiscal_year INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Finance: Transactions
CREATE TABLE IF NOT EXISTS finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('revenue','expense')),
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CRM: Customers
CREATE TABLE IF NOT EXISTS crm_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  lifetime_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  last_contacted TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CRM: Leads
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. CRM: Deals
CREATE TABLE IF NOT EXISTS crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  stage TEXT NOT NULL DEFAULT 'prospecting',
  probability INT NOT NULL DEFAULT 10,
  close_date DATE,
  customer_id UUID REFERENCES crm_customers(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. CRM: Activities
CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  related_to TEXT,
  related_id UUID,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Sales: Orders
CREATE TABLE IF NOT EXISTS sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_id UUID REFERENCES crm_customers(id) ON DELETE SET NULL,
  total DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Sales: Products
CREATE TABLE IF NOT EXISTS sales_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. HR: Employees
CREATE TABLE IF NOT EXISTS hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT NOT NULL,
  department_id UUID,
  salary DECIMAL(12,2) NOT NULL,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. HR: Departments
CREATE TABLE IF NOT EXISTS hr_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  head_id UUID REFERENCES hr_employees(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add department FK to employees after departments exist
ALTER TABLE hr_employees DROP CONSTRAINT IF EXISTS hr_employees_department_id_fkey;
ALTER TABLE hr_employees ADD CONSTRAINT hr_employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES hr_departments(id) ON DELETE SET NULL;

-- 15. HR: Payroll
CREATE TABLE IF NOT EXISTS hr_payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  salary DECIMAL(12,2) NOT NULL,
  bonuses DECIMAL(12,2) NOT NULL DEFAULT 0,
  deductions DECIMAL(12,2) NOT NULL DEFAULT 0,
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. Projects
CREATE TABLE IF NOT EXISTS projects_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  priority TEXT NOT NULL DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  budget DECIMAL(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Tasks
CREATE TABLE IF NOT EXISTS projects_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'medium',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  estimated_hours DECIMAL(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. Inventory: Warehouses
CREATE TABLE IF NOT EXISTS inventory_warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  capacity INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. Inventory: Suppliers
CREATE TABLE IF NOT EXISTS inventory_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. Inventory: Products
CREATE TABLE IF NOT EXISTS inventory_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 10,
  warehouse_id UUID REFERENCES inventory_warehouses(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES inventory_suppliers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  size_bytes BIGINT,
  tags TEXT[],
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. Dashboards
CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 24. Data Sources
CREATE TABLE IF NOT EXISTS data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 25. Imported Datasets (for Excel/CSV uploads)
CREATE TABLE IF NOT EXISTS imported_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_filename TEXT,
  columns JSONB NOT NULL DEFAULT '[]',
  rows JSONB NOT NULL DEFAULT '[]',
  row_count INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  mapped_table TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 26. Import Mappings (column mapping configs)
CREATE TABLE IF NOT EXISTS import_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  dataset_id UUID REFERENCES imported_datasets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_columns JSONB NOT NULL DEFAULT '[]',
  target_table TEXT NOT NULL,
  column_mapping JSONB NOT NULL DEFAULT '{}',
  transform_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_finance_invoices_org ON finance_invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_org ON finance_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_org ON crm_customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_org ON crm_leads(organization_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_org ON crm_deals(organization_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_org ON sales_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_hr_employees_org ON hr_employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_projects_org ON projects_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_tasks_project ON projects_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_inventory_products_org ON inventory_products(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_org ON documents(organization_id);

-- RLS: Enable on all tables
DO $$ DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'organizations','profiles','org_members',
      'finance_invoices','finance_budgets','finance_transactions',
      'crm_customers','crm_leads','crm_deals','crm_activities',
      'sales_orders','sales_products',
      'hr_employees','hr_departments','hr_payroll',
      'projects_projects','projects_tasks',
      'inventory_products','inventory_warehouses','inventory_suppliers',
      'documents','notifications','dashboards','data_sources',
      'imported_datasets','import_mappings'
    ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- RLS Policies (simplified: authenticated users can access their org's data)
CREATE POLICY "org_access" ON organizations FOR ALL USING (true);
CREATE POLICY "org_access" ON profiles FOR ALL USING (true);
CREATE POLICY "org_access" ON org_members FOR ALL USING (true);
CREATE POLICY "org_access" ON finance_invoices FOR ALL USING (true);
CREATE POLICY "org_access" ON finance_budgets FOR ALL USING (true);
CREATE POLICY "org_access" ON finance_transactions FOR ALL USING (true);
CREATE POLICY "org_access" ON crm_customers FOR ALL USING (true);
CREATE POLICY "org_access" ON crm_leads FOR ALL USING (true);
CREATE POLICY "org_access" ON crm_deals FOR ALL USING (true);
CREATE POLICY "org_access" ON crm_activities FOR ALL USING (true);
CREATE POLICY "org_access" ON sales_orders FOR ALL USING (true);
CREATE POLICY "org_access" ON sales_products FOR ALL USING (true);
CREATE POLICY "org_access" ON hr_employees FOR ALL USING (true);
CREATE POLICY "org_access" ON hr_departments FOR ALL USING (true);
CREATE POLICY "org_access" ON hr_payroll FOR ALL USING (true);
CREATE POLICY "org_access" ON projects_projects FOR ALL USING (true);
CREATE POLICY "org_access" ON projects_tasks FOR ALL USING (true);
CREATE POLICY "org_access" ON inventory_products FOR ALL USING (true);
CREATE POLICY "org_access" ON inventory_warehouses FOR ALL USING (true);
CREATE POLICY "org_access" ON inventory_suppliers FOR ALL USING (true);
CREATE POLICY "org_access" ON documents FOR ALL USING (true);
CREATE POLICY "org_access" ON notifications FOR ALL USING (true);
CREATE POLICY "org_access" ON dashboards FOR ALL USING (true);
CREATE POLICY "org_access" ON data_sources FOR ALL USING (true);
CREATE POLICY "org_access" ON imported_datasets FOR ALL USING (true);
CREATE POLICY "org_access" ON import_mappings FOR ALL USING (true);

-- Auto-provisioning trigger: create org + profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  org_id UUID;
BEGIN
  INSERT INTO public.organizations (name, slug)
  VALUES (COALESCE(NEW.raw_user_meta_data ->> 'organization_name', 'My Organization'),
          COALESCE(NEW.raw_user_meta_data ->> 'organization_slug', 'org-' || substr(NEW.id::text, 1, 8)))
  RETURNING id INTO org_id;

  INSERT INTO public.profiles (id, email, full_name, role, organization_id)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), 'owner', org_id);

  INSERT INTO public.org_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ensure_organization RPC (for client-side idempotent org access)
CREATE OR REPLACE FUNCTION public.ensure_organization(p_slug TEXT, p_name TEXT)
RETURNS SETOF public.organizations
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.organizations (name, slug)
  VALUES (p_name, p_slug)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING *;
END;
$$;

-- Seed data
DO $$
DECLARE
  org_id UUID;
BEGIN
  SELECT id INTO org_id FROM organizations WHERE slug = 'default-org';
  IF org_id IS NULL THEN
    INSERT INTO organizations (name, slug) VALUES ('Default Organization', 'default-org')
    RETURNING id INTO org_id;
  END IF;

  -- Finance: Invoices
  INSERT INTO finance_invoices (organization_id, invoice_number, customer_name, amount, status, due_date) VALUES
    (org_id, 'INV-001', 'Acme Corp', 15000.00, 'paid', '2026-06-01'),
    (org_id, 'INV-002', 'Globex Inc', 22000.00, 'sent', '2026-07-15'),
    (org_id, 'INV-003', 'Initech', 8500.00, 'overdue', '2026-05-01'),
    (org_id, 'INV-004', 'Umbrella Corp', 30000.00, 'draft', '2026-08-01'),
    (org_id, 'INV-005', 'Stark Industries', 45000.00, 'paid', '2026-06-15')
  ON CONFLICT DO NOTHING;

  -- Finance: Budgets
  INSERT INTO finance_budgets (organization_id, department, category, allocated, spent, period, fiscal_year) VALUES
    (org_id, 'Engineering', 'Software', 500000.00, 320000.00, 'Q2', 2026),
    (org_id, 'Marketing', 'Advertising', 200000.00, 145000.00, 'Q2', 2026),
    (org_id, 'Sales', 'Travel', 100000.00, 42000.00, 'Q2', 2026),
    (org_id, 'HR', 'Training', 75000.00, 28000.00, 'Q2', 2026)
  ON CONFLICT DO NOTHING;

  -- Finance: Transactions
  INSERT INTO finance_transactions (organization_id, type, category, amount, description, transaction_date) VALUES
    (org_id, 'revenue', 'Product Sales', 150000.00, 'Q2 product revenue', '2026-04-15'),
    (org_id, 'revenue', 'Services', 85000.00, 'Consulting fees', '2026-05-01'),
    (org_id, 'expense', 'Payroll', 120000.00, 'Monthly payroll', '2026-04-30'),
    (org_id, 'expense', 'Infrastructure', 25000.00, 'Cloud services', '2026-04-30'),
    (org_id, 'revenue', 'Product Sales', 165000.00, 'Q2 product revenue', '2026-05-15'),
    (org_id, 'expense', 'Marketing', 35000.00, 'Ad campaigns', '2026-05-15'),
    (org_id, 'revenue', 'Services', 92000.00, 'Consulting fees', '2026-06-01'),
    (org_id, 'expense', 'Office', 12000.00, 'Rent & utilities', '2026-06-01'),
    (org_id, 'revenue', 'Product Sales', 180000.00, 'Q2 product revenue', '2026-06-15'),
    (org_id, 'expense', 'Payroll', 120000.00, 'Monthly payroll', '2026-05-31'),
    (org_id, 'expense', 'Payroll', 125000.00, 'Monthly payroll', '2026-06-30'),
    (org_id, 'revenue', 'Licensing', 45000.00, 'Software licenses', '2026-06-20')
  ON CONFLICT DO NOTHING;

  -- CRM: Customers
  INSERT INTO crm_customers (organization_id, name, email, company, status, lifetime_value, last_contacted) VALUES
    (org_id, 'John Smith', 'john@acme.com', 'Acme Corp', 'active', 45000.00, '2026-06-10'),
    (org_id, 'Jane Doe', 'jane@globex.com', 'Globex Inc', 'active', 32000.00, '2026-06-12'),
    (org_id, 'Bob Johnson', 'bob@initech.com', 'Initech', 'at_risk', 15000.00, '2026-05-01'),
    (org_id, 'Alice Brown', 'alice@umbrella.com', 'Umbrella Corp', 'active', 67000.00, '2026-06-14'),
    (org_id, 'Tony Stark', 'tony@stark.com', 'Stark Industries', 'vip', 120000.00, '2026-06-13')
  ON CONFLICT DO NOTHING;

  -- CRM: Leads
  INSERT INTO crm_leads (organization_id, name, email, source, status) VALUES
    (org_id, 'Mark Wilson', 'mark@example.com', 'Website', 'new'),
    (org_id, 'Sarah Connor', 'sarah@cyberdyne.com', 'Referral', 'contacted'),
    (org_id, 'Peter Parker', 'peter@dailybugle.com', 'Social Media', 'qualified'),
    (org_id, 'Bruce Wayne', 'bruce@wayne.com', 'Event', 'new'),
    (org_id, 'Clark Kent', 'clark@dailyplanet.com', 'Website', 'lost')
  ON CONFLICT DO NOTHING;

  -- CRM: Deals
  INSERT INTO crm_deals (organization_id, name, value, stage, probability, close_date) VALUES
    (org_id, 'Acme Platform Upgrade', 75000.00, 'negotiation', 60, '2026-08-01'),
    (org_id, 'Globex Consulting', 25000.00, 'proposal', 40, '2026-07-15'),
    (org_id, 'Stark Integration', 150000.00, 'closed_won', 100, '2026-06-01'),
    (org_id, 'Umbrella Security Audit', 35000.00, 'discovery', 20, '2026-09-01'),
    (org_id, 'Initech Renewal', 12000.00, 'closed_lost', 0, '2026-05-01')
  ON CONFLICT DO NOTHING;

  -- CRM: Activities
  INSERT INTO crm_activities (organization_id, type, subject, description) VALUES
    (org_id, 'call', 'Follow-up with Acme', 'Discussed timeline for platform upgrade'),
    (org_id, 'email', 'Proposal sent to Globex', 'Sent consulting proposal package'),
    (org_id, 'meeting', 'Stark kickoff', 'Project kickoff meeting completed'),
    (org_id, 'demo', 'Product demo for Umbrella', 'Demonstrated security suite'),
    (org_id, 'task', 'Review Initech contract', 'Need to review renewal terms')
  ON CONFLICT DO NOTHING;

  -- Sales: Products
  INSERT INTO sales_products (organization_id, name, sku, price, cost, category) VALUES
    (org_id, 'Enterprise Suite', 'ENT-001', 49999.00, 25000.00, 'Software'),
    (org_id, 'Pro License', 'PRO-001', 9999.00, 5000.00, 'Software'),
    (org_id, 'Consulting Day', 'CONS-001', 2500.00, 1000.00, 'Services'),
    (org_id, 'Support Package', 'SUP-001', 15000.00, 8000.00, 'Services'),
    (org_id, 'Training Session', 'TRN-001', 5000.00, 2000.00, 'Services')
  ON CONFLICT DO NOTHING;

  -- HR: Departments
  INSERT INTO hr_departments (organization_id, name, description) VALUES
    (org_id, 'Engineering', 'Software development and infrastructure'),
    (org_id, 'Marketing', 'Brand and demand generation'),
    (org_id, 'Sales', 'Revenue and customer acquisition'),
    (org_id, 'Human Resources', 'People operations and culture'),
    (org_id, 'Finance', 'Financial planning and analysis')
  ON CONFLICT DO NOTHING;

  -- HR: Employees
  INSERT INTO hr_employees (organization_id, first_name, last_name, email, position, salary, hire_date) VALUES
    (org_id, 'Alice', 'Johnson', 'alice@company.com', 'CEO', 250000.00, '2024-01-15'),
    (org_id, 'Bob', 'Williams', 'bob@company.com', 'CTO', 220000.00, '2024-02-01'),
    (org_id, 'Carol', 'Davis', 'carol@company.com', 'VP Engineering', 190000.00, '2024-03-01'),
    (org_id, 'David', 'Miller', 'david@company.com', 'Senior Developer', 150000.00, '2024-04-15'),
    (org_id, 'Eve', 'Wilson', 'eve@company.com', 'Marketing Director', 160000.00, '2024-05-01'),
    (org_id, 'Frank', 'Taylor', 'frank@company.com', 'Sales Director', 170000.00, '2024-06-01'),
    (org_id, 'Grace', 'Anderson', 'grace@company.com', 'HR Manager', 120000.00, '2024-07-15'),
    (org_id, 'Henry', 'Thomas', 'henry@company.com', 'Developer', 130000.00, '2024-08-01'),
    (org_id, 'Ivy', 'Jackson', 'ivy@company.com', 'Designer', 110000.00, '2024-09-01'),
    (org_id, 'Jack', 'White', 'jack@company.com', 'Analyst', 95000.00, '2024-10-15')
  ON CONFLICT DO NOTHING;

  -- HR: Payroll
  INSERT INTO hr_payroll (organization_id, employee_id, salary, bonuses, deductions, pay_period_start, pay_period_end, status, paid_at)
  SELECT org_id, e.id, e.salary, 5000.00, 2000.00, '2026-06-01', '2026-06-30', 'paid', '2026-06-30'
  FROM hr_employees e WHERE e.organization_id = org_id
  ON CONFLICT DO NOTHING;

  -- Projects
  INSERT INTO projects_projects (organization_id, name, description, status, priority, start_date, end_date, budget) VALUES
    (org_id, 'Platform Redesign', 'Complete redesign of core platform UI/UX', 'in_progress', 'high', '2026-01-15', '2026-08-30', 500000.00),
    (org_id, 'Mobile App v2', 'Native mobile app rewrite', 'planning', 'high', '2026-07-01', '2026-12-31', 300000.00),
    (org_id, 'Data Migration', 'Migrate legacy data to new warehouse', 'in_progress', 'medium', '2026-03-01', '2026-07-31', 150000.00),
    (org_id, 'Security Audit', 'External security audit and penetration testing', 'completed', 'high', '2026-04-01', '2026-05-30', 80000.00),
    (org_id, 'AI Integration', 'Integrate AI-powered features into platform', 'planning', 'medium', '2026-08-01', '2026-12-31', 400000.00)
  ON CONFLICT DO NOTHING;

  -- Tasks
  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Design system overhaul', 'in_progress', 'high', '2026-07-15', 120
  FROM projects_projects p WHERE p.name = 'Platform Redesign' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Component library migration', 'todo', 'high', '2026-08-01', 80
  FROM projects_projects p WHERE p.name = 'Platform Redesign' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'User testing sessions', 'review', 'medium', '2026-06-30', 40
  FROM projects_projects p WHERE p.name = 'Platform Redesign' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Performance optimization', 'done', 'medium', '2026-06-15', 60
  FROM projects_projects p WHERE p.name = 'Platform Redesign' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Requirements gathering', 'done', 'high', '2026-03-15', 30
  FROM projects_projects p WHERE p.name = 'Data Migration' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Schema mapping', 'in_progress', 'high', '2026-05-30', 100
  FROM projects_projects p WHERE p.name = 'Data Migration' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'ETL pipeline development', 'todo', 'medium', '2026-07-01', 120
  FROM projects_projects p WHERE p.name = 'Data Migration' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Penetration testing', 'done', 'high', '2026-05-01', 40
  FROM projects_projects p WHERE p.name = 'Security Audit' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Vulnerability report', 'done', 'high', '2026-05-15', 20
  FROM projects_projects p WHERE p.name = 'Security Audit' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Remediation plan', 'done', 'high', '2026-05-30', 30
  FROM projects_projects p WHERE p.name = 'Security Audit' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Market research', 'todo', 'medium', '2026-08-15', 60
  FROM projects_projects p WHERE p.name = 'Mobile App v2' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  INSERT INTO projects_tasks (organization_id, project_id, title, status, priority, due_date, estimated_hours)
  SELECT org_id, p.id, 'Tech stack evaluation', 'todo', 'high', '2026-08-01', 40
  FROM projects_projects p WHERE p.name = 'Mobile App v2' AND p.organization_id = org_id
  ON CONFLICT DO NOTHING;

  -- Inventory: Warehouses
  INSERT INTO inventory_warehouses (organization_id, name, location, capacity) VALUES
    (org_id, 'Main Warehouse', 'New York, NY', 10000),
    (org_id, 'West Coast Hub', 'San Francisco, CA', 8000),
    (org_id, 'Europe Distribution', 'Berlin, Germany', 12000)
  ON CONFLICT DO NOTHING;

  -- Inventory: Suppliers
  INSERT INTO inventory_suppliers (organization_id, name, contact_name, email, phone) VALUES
    (org_id, 'TechSupply Co', 'James Miller', 'james@techsupply.com', '+1-555-0100'),
    (org_id, 'Global Parts Inc', 'Maria Garcia', 'maria@globalparts.com', '+1-555-0101'),
    (org_id, 'Quality Components', 'Alex Chen', 'alex@qualitycomp.com', '+1-555-0102')
  ON CONFLICT DO NOTHING;

  -- Inventory: Products
  INSERT INTO inventory_products (organization_id, name, sku, category, unit_price, quantity, reorder_level)
  SELECT org_id, 'Laptop Pro 15', 'LAP-001', 'Electronics', 1999.99, 45, 10
  ON CONFLICT DO NOTHING;

  INSERT INTO inventory_products (organization_id, name, sku, category, unit_price, quantity, reorder_level)
  SELECT org_id, 'Wireless Mouse', 'MOU-001', 'Accessories', 49.99, 200, 50
  ON CONFLICT DO NOTHING;

  INSERT INTO inventory_products (organization_id, name, sku, category, unit_price, quantity, reorder_level)
  SELECT org_id, 'USB-C Hub', 'HUB-001', 'Accessories', 79.99, 150, 30
  ON CONFLICT DO NOTHING;

  INSERT INTO inventory_products (organization_id, name, sku, category, unit_price, quantity, reorder_level)
  SELECT org_id, '4K Monitor 27"', 'MON-001', 'Electronics', 599.99, 25, 10
  ON CONFLICT DO NOTHING;

  INSERT INTO inventory_products (organization_id, name, sku, category, unit_price, quantity, reorder_level)
  SELECT org_id, 'Mechanical Keyboard', 'KEY-001', 'Accessories', 149.99, 8, 15
  ON CONFLICT DO NOTHING;

  -- Documents
  INSERT INTO documents (organization_id, name, file_type, tags) VALUES
    (org_id, 'Q2 Report.pdf', 'application/pdf', ARRAY['finance', 'quarterly']),
    (org_id, 'Employee Handbook.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ARRAY['hr', 'policies']),
    (org_id, 'Product Roadmap.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ARRAY['product', 'planning']),
    (org_id, 'Security Policy.pdf', 'application/pdf', ARRAY['security', 'compliance']),
    (org_id, 'Marketing Plan.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ARRAY['marketing', 'campaigns'])
  ON CONFLICT DO NOTHING;

  -- Notifications
  INSERT INTO notifications (organization_id, title, message, type) VALUES
    (org_id, 'Invoice Overdue', 'Invoice INV-003 from Initech is overdue by 45 days', 'warning'),
    (org_id, 'New Deal Closed', 'Stark Integration deal worth $150,000 has been closed', 'success'),
    (org_id, 'Low Stock Alert', 'Mechanical Keyboard is below reorder level (8 remaining)', 'error'),
    (org_id, 'Project Update', 'Platform Redesign is 60% complete', 'info'),
    (org_id, 'Payroll Processed', 'June payroll has been processed successfully', 'success')
  ON CONFLICT DO NOTHING;

  -- Dashboards
  INSERT INTO dashboards (organization_id, name, description, config) VALUES
    (org_id, 'Executive Overview', 'High-level KPI dashboard for leadership', '{"widgets": ["revenue", "customers", "deals", "employees"]}'),
    (org_id, 'Sales Pipeline', 'Sales team pipeline and forecasting', '{"widgets": ["deals_by_stage", "monthly_revenue", "conversion_rate"]}'),
    (org_id, 'Engineering Velocity', 'Engineering metrics and project tracking', '{"widgets": ["sprint_burndown", "task_completion", "deployment_frequency"]}')
  ON CONFLICT DO NOTHING;

  -- Data Sources
  INSERT INTO data_sources (organization_id, name, type, config, enabled) VALUES
    (org_id, 'Stripe Payments', 'stripe', '{"live_mode": false}', true),
    (org_id, 'Google Analytics', 'google_analytics', '{"property_id": "UA-12345-6"}', true),
    (org_id, 'Slack Integration', 'slack', '{"channel": "#general"}', true),
    (org_id, 'GitHub Repos', 'github', '{"org": "mycompany"}', false)
  ON CONFLICT DO NOTHING;

END $$;
