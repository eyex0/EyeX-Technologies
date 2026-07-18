import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ORG_NAME = 'Acme Corp';
const ORG_SLUG = 'acme-corp';

async function seed() {
  console.log('=== Seeding database ===\n');

  // Clear data in reverse dependency order
  const clearOrder = [
    'import_mappings', 'imported_datasets', 'data_sources',
    'notifications', 'documents', 'inventory_products',
    'inventory_suppliers', 'inventory_warehouses',
    'projects_tasks', 'projects_projects',
    'hr_payroll', 'hr_employees', 'hr_departments',
    'sales_orders', 'sales_products',
    'crm_activities', 'crm_deals', 'crm_leads', 'crm_customers',
    'finance_transactions', 'finance_budgets', 'finance_invoices',
    'dashboards', 'org_members', 'profiles',
  ];

  for (const table of clearOrder) {
    console.log(`  Clearing ${table}...`);
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error && error.code !== 'PGRST116') {
      console.error(`    Warning clearing ${table}: ${error.message}`);
    }
  }

  // 1. Organization
  console.log('\n  Seeding organizations...');
  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .upsert({ name: ORG_NAME, slug: ORG_SLUG }, { onConflict: 'slug' })
    .select()
    .single();
  if (orgErr) { console.error('    Failed:', orgErr.message); process.exit(1); }
  const orgId = org.id;
  console.log(`    Created organization: ${ORG_NAME} (${orgId})`);

  // 2. Profiles (needs auth.users reference - use a dummy UUID for demo)
  const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
  console.log('\n  Seeding profiles...');
  const { error: profileErr } = await supabase
    .from('profiles')
    .upsert({
      id: DEMO_USER_ID,
      email: 'admin@acme-corp.com',
      full_name: 'Admin User',
      role: 'owner',
      organization_id: orgId,
    }, { onConflict: 'id' });
  if (profileErr) console.error('    Warning:', profileErr.message);
  else console.log('    Created demo profile');

  // 3. Org Members
  console.log('\n  Seeding org_members...');
  const { error: memberErr } = await supabase
    .from('org_members')
    .upsert({
      organization_id: orgId,
      user_id: DEMO_USER_ID,
      role: 'owner',
    }, { onConflict: 'organization_id,user_id' });
  if (memberErr) console.error('    Warning:', memberErr.message);
  else console.log('    Created org member');

  // 4. CRM Customers
  console.log('\n  Seeding crm_customers...');
  const customers = [
    { name: 'Acme Corp', email: 'info@acme.com', company: 'Acme Corp', status: 'active', lifetime_value: 95000 },
    { name: 'Dubai Tech Solutions', email: 'contact@dubai-tech.ae', company: 'Dubai Tech', status: 'active', lifetime_value: 120000 },
    { name: 'Abu Dhabi Systems', email: 'info@abudhabi-sys.ae', company: 'Abu Dhabi Systems', status: 'active', lifetime_value: 78000 },
    { name: 'Saudi Horizons', email: 'info@saudi-horizons.com', company: 'Saudi Horizons', status: 'vip', lifetime_value: 200000 },
    { name: 'Qatar Digital Hub', email: 'hello@qatar-digital.qa', company: 'Qatar Digital Hub', status: 'active', lifetime_value: 55000 },
    { name: 'Oman Tech Ventures', email: 'info@oman-tech.om', company: 'Oman Tech Ventures', status: 'at_risk', lifetime_value: 22000 },
    { name: 'Kuwait Business Solutions', email: 'contact@kuwait-biz.kw', company: 'Kuwait Business Solutions', status: 'active', lifetime_value: 43000 },
  ].map(c => ({ ...c, organization_id: orgId }));
  const { data: custRows, error: custErr } = await supabase.from('crm_customers').insert(customers).select();
  if (custErr) { console.error('    Failed:', custErr.message); process.exit(1); }
  console.log(`    Inserted ${custRows.length} customers`);

  // 5. CRM Leads
  console.log('\n  Seeding crm_leads...');
  const leads = [
    { name: 'Omar Al-Rashid', email: 'omar@example.ae', source: 'Website', status: 'new' },
    { name: 'Layla Hassan', email: 'layla@example.com', source: 'Referral', status: 'contacted' },
    { name: 'Khalid Al-Mansouri', email: 'khalid@example.ae', source: 'LinkedIn', status: 'qualified' },
    { name: 'Nora Al-Falasi', email: 'nora@example.ae', source: 'Event', status: 'new' },
    { name: 'Saeed Al-Ghamdi', email: 'saeed@example.com', source: 'Website', status: 'lost' },
    { name: 'Mona Ibrahim', email: 'mona@example.com', source: 'Social Media', status: 'contacted' },
    { name: 'Faisal Al-Qahtani', email: 'faisal@example.ae', source: 'Referral', status: 'qualified' },
  ].map(l => ({ ...l, organization_id: orgId }));
  const { data: leadRows, error: leadErr } = await supabase.from('crm_leads').insert(leads).select();
  if (leadErr) { console.error('    Failed:', leadErr.message); process.exit(1); }
  console.log(`    Inserted ${leadRows.length} leads`);

  // 6. CRM Deals
  console.log('\n  Seeding crm_deals...');
  const deals = [
    { name: 'Dubai Tech Platform Upgrade', value: 75000, stage: 'negotiation', probability: 60, close_date: '2026-08-15' },
    { name: 'Abu Dhabi Systems Integration', value: 120000, stage: 'prospecting', probability: 25, close_date: '2026-09-30' },
    { name: 'Saudi Horizons AI Suite', value: 250000, stage: 'negotiation', probability: 50, close_date: '2026-10-01' },
    { name: 'Qatar Digital Analytics Platform', value: 45000, stage: 'proposal', probability: 40, close_date: '2026-08-01' },
    { name: 'Oman Tech Security Audit', value: 18000, stage: 'discovery', probability: 15, close_date: '2026-11-01' },
    { name: 'Kuwait Business ERP Migration', value: 85000, stage: 'closed_won', probability: 100, close_date: '2026-07-01' },
    { name: 'Future Tech Consulting', value: 500000, stage: 'prospecting', probability: 10, close_date: '2026-12-31' },
    { name: 'Regional Data Center Setup', value: 35000, stage: 'closed_lost', probability: 0, close_date: '2026-06-01' },
  ].map(d => ({ ...d, organization_id: orgId }));
  const { data: dealRows, error: dealErr } = await supabase.from('crm_deals').insert(deals).select();
  if (dealErr) { console.error('    Failed:', dealErr.message); process.exit(1); }
  console.log(`    Inserted ${dealRows.length} deals`);

  // 7. CRM Activities
  console.log('\n  Seeding crm_activities...');
  const activities = [
    { type: 'call', subject: 'Follow-up with Dubai Tech', description: 'Discussed timeline for platform upgrade', related_to: 'deal', related_id: dealRows[0].id },
    { type: 'email', subject: 'Proposal sent to Qatar Digital', description: 'Sent analytics platform proposal', related_to: 'deal', related_id: dealRows[3].id },
    { type: 'meeting', subject: 'Kuwait kickoff meeting', description: 'Project kickoff meeting completed successfully', related_to: 'deal', related_id: dealRows[5].id },
    { type: 'demo', subject: 'Product demo for Abu Dhabi Systems', description: 'Demonstrated integration capabilities', related_to: 'deal', related_id: dealRows[1].id },
    { type: 'task', subject: 'Review Oman Tech contract', description: 'Need to review security audit terms', related_to: 'deal', related_id: dealRows[4].id },
    { type: 'call', subject: 'Discovery call with Saudi Horizons', description: 'Explored AI suite requirements', related_to: 'deal', related_id: dealRows[2].id },
    { type: 'email', subject: 'Follow-up email to Omar Al-Rashid', description: 'Sent product brochure', related_to: 'lead', related_id: leadRows[0].id },
    { type: 'meeting', subject: 'Quarterly review with Acme Corp', description: 'Reviewed Q2 performance metrics', related_to: 'customer', related_id: custRows[0].id },
    { type: 'call', subject: 'Check-in with Layla Hassan', description: 'Answered questions about pricing', related_to: 'lead', related_id: leadRows[1].id },
    { type: 'demo', subject: 'Live demo for Khalid Al-Mansouri', description: 'Showed advanced reporting features', related_to: 'lead', related_id: leadRows[2].id },
    { type: 'email', subject: 'Contract renewal for Kuwait Business', description: 'Sent renewal terms for FY2027', related_to: 'customer', related_id: custRows[6].id },
    { type: 'meeting', subject: 'Strategic planning with Saudi Horizons', description: 'Discussed Q3-Q4 roadmap alignment', related_to: 'customer', related_id: custRows[3].id },
  ].map(a => ({ ...a, organization_id: orgId }));
  const { data: actRows, error: actErr } = await supabase.from('crm_activities').insert(activities).select();
  if (actErr) { console.error('    Failed:', actErr.message); process.exit(1); }
  console.log(`    Inserted ${actRows.length} activities`);

  // 8. Finance Invoices
  console.log('\n  Seeding finance_invoices...');
  const invoices = [
    { invoice_number: 'INV-2026-001', customer_name: 'Dubai Tech Solutions', amount: 15000, status: 'paid', due_date: '2026-06-15', issued_date: '2026-05-15' },
    { invoice_number: 'INV-2026-002', customer_name: 'Abu Dhabi Systems', amount: 22500, status: 'paid', due_date: '2026-06-30', issued_date: '2026-05-30' },
    { invoice_number: 'INV-2026-003', customer_name: 'Saudi Horizons', amount: 50000, status: 'sent', due_date: '2026-07-15', issued_date: '2026-06-15' },
    { invoice_number: 'INV-2026-004', customer_name: 'Qatar Digital Hub', amount: 8750, status: 'draft', due_date: '2026-08-01', issued_date: '2026-07-01' },
    { invoice_number: 'INV-2026-005', customer_name: 'Kuwait Business Solutions', amount: 32000, status: 'overdue', due_date: '2026-05-01', issued_date: '2026-04-01' },
    { invoice_number: 'INV-2026-006', customer_name: 'Oman Tech Ventures', amount: 5000, status: 'paid', due_date: '2026-06-01', issued_date: '2026-05-01' },
    { invoice_number: 'INV-2026-007', customer_name: 'Acme Corp', amount: 45000, status: 'sent', due_date: '2026-07-31', issued_date: '2026-07-01' },
    { invoice_number: 'INV-2026-008', customer_name: 'Dubai Tech Solutions', amount: 12000, status: 'draft', due_date: '2026-08-15', issued_date: '2026-07-15' },
    { invoice_number: 'INV-2026-009', customer_name: 'Saudi Horizons', amount: 78000, status: 'overdue', due_date: '2026-04-30', issued_date: '2026-03-30' },
    { invoice_number: 'INV-2026-010', customer_name: 'Qatar Digital Hub', amount: 15000, status: 'paid', due_date: '2026-07-01', issued_date: '2026-06-01' },
    { invoice_number: 'INV-2026-011', customer_name: 'Abu Dhabi Systems', amount: 35000, status: 'sent', due_date: '2026-08-30', issued_date: '2026-07-30' },
  ].map(i => ({ ...i, organization_id: orgId }));
  const { data: invRows, error: invErr } = await supabase.from('finance_invoices').insert(invoices).select();
  if (invErr) { console.error('    Failed:', invErr.message); process.exit(1); }
  console.log(`    Inserted ${invRows.length} invoices`);

  // 9. Finance Budgets
  console.log('\n  Seeding finance_budgets...');
  const budgets = [
    { department: 'Engineering', category: 'Software & Tools', allocated: 500000, spent: 320000, period: 'Q2', fiscal_year: 2026 },
    { department: 'Marketing', category: 'Advertising', allocated: 200000, spent: 145000, period: 'Q2', fiscal_year: 2026 },
    { department: 'Sales', category: 'Travel & Events', allocated: 100000, spent: 42000, period: 'Q2', fiscal_year: 2026 },
    { department: 'Operations', category: 'Infrastructure', allocated: 150000, spent: 98000, period: 'Q2', fiscal_year: 2026 },
    { department: 'Finance', category: 'Professional Services', allocated: 75000, spent: 28000, period: 'Q2', fiscal_year: 2026 },
  ].map(b => ({ ...b, organization_id: orgId }));
  const { data: budRows, error: budErr } = await supabase.from('finance_budgets').insert(budgets).select();
  if (budErr) { console.error('    Failed:', budErr.message); process.exit(1); }
  console.log(`    Inserted ${budRows.length} budgets`);

  // 10. Finance Transactions
  console.log('\n  Seeding finance_transactions...');
  const transactions = [
    { type: 'revenue', category: 'Product Sales', amount: 150000, description: 'Q2 platform license revenue', transaction_date: '2026-04-15' },
    { type: 'revenue', category: 'Consulting', amount: 85000, description: 'Integration consulting fees', transaction_date: '2026-04-20' },
    { type: 'expense', category: 'Payroll', amount: 120000, description: 'April payroll', transaction_date: '2026-04-30' },
    { type: 'expense', category: 'Cloud Infrastructure', amount: 25000, description: 'AWS monthly hosting', transaction_date: '2026-04-30' },
    { type: 'revenue', category: 'Product Sales', amount: 165000, description: 'May license renewals', transaction_date: '2026-05-15' },
    { type: 'expense', category: 'Marketing', amount: 35000, description: 'Google Ads campaign', transaction_date: '2026-05-15' },
    { type: 'expense', category: 'Office Rent', amount: 18000, description: 'Monthly office lease', transaction_date: '2026-05-01' },
    { type: 'revenue', category: 'Consulting', amount: 92000, description: 'Abu Dhabi Systems consulting', transaction_date: '2026-05-20' },
    { type: 'expense', category: 'Office', amount: 12000, description: 'Utilities & supplies', transaction_date: '2026-06-01' },
    { type: 'revenue', category: 'Product Sales', amount: 180000, description: 'June enterprise deals', transaction_date: '2026-06-15' },
    { type: 'expense', category: 'Payroll', amount: 125000, description: 'May payroll', transaction_date: '2026-05-31' },
    { type: 'expense', category: 'Payroll', amount: 125000, description: 'June payroll', transaction_date: '2026-06-30' },
    { type: 'revenue', category: 'Licensing', amount: 45000, description: 'Annual software license fees', transaction_date: '2026-06-20' },
    { type: 'expense', category: 'Professional Services', amount: 30000, description: 'Legal & compliance fees', transaction_date: '2026-06-10' },
    { type: 'expense', category: 'Travel', amount: 8500, description: 'Client visit expenses', transaction_date: '2026-06-05' },
    { type: 'revenue', category: 'Training', amount: 22000, description: 'Corporate training sessions', transaction_date: '2026-06-25' },
    { type: 'expense', category: 'Equipment', amount: 15000, description: 'New workstation setup', transaction_date: '2026-05-10' },
  ].map(t => ({ ...t, organization_id: orgId }));
  const { data: txRows, error: txErr } = await supabase.from('finance_transactions').insert(transactions).select();
  if (txErr) { console.error('    Failed:', txErr.message); process.exit(1); }
  console.log(`    Inserted ${txRows.length} transactions`);

  // 11. HR Departments
  console.log('\n  Seeding hr_departments...');
  const departments = [
    { name: 'Engineering', description: 'Software development and infrastructure' },
    { name: 'Sales', description: 'Revenue and customer acquisition' },
    { name: 'Marketing', description: 'Brand and demand generation' },
    { name: 'Operations', description: 'Business operations and logistics' },
    { name: 'Finance', description: 'Financial planning and analysis' },
  ].map(d => ({ ...d, organization_id: orgId }));
  const { data: deptRows, error: deptErr } = await supabase.from('hr_departments').insert(departments).select();
  if (deptErr) { console.error('    Failed:', deptErr.message); process.exit(1); }
  console.log(`    Inserted ${deptRows.length} departments`);

  // 12. HR Employees
  console.log('\n  Seeding hr_employees...');
  const employees = [
    { first_name: 'Ahmed', last_name: 'Al-Maktoum', email: 'ahmed@acme-corp.com', position: 'CEO', salary: 300000, hire_date: '2024-01-15', department_id: null },
    { first_name: 'Sara', last_name: 'Al-Nahyan', email: 'sara@acme-corp.com', position: 'CTO', salary: 260000, hire_date: '2024-02-01', department_id: null },
    { first_name: 'Mohammed', last_name: 'Al-Attiyah', email: 'mohammed@acme-corp.com', position: 'VP Engineering', salary: 220000, hire_date: '2024-03-01', department_id: null },
    { first_name: 'Fatima', last_name: 'Al-Zaabi', email: 'fatima@acme-corp.com', position: 'Senior Developer', salary: 170000, hire_date: '2024-04-15', department_id: null },
    { first_name: 'Khalifa', last_name: 'Al-Marri', email: 'khalifa@acme-corp.com', position: 'Marketing Director', salary: 190000, hire_date: '2024-05-01', department_id: null },
    { first_name: 'Noura', last_name: 'Al-Kaabi', email: 'noura@acme-corp.com', position: 'Sales Director', salary: 200000, hire_date: '2024-06-01', department_id: null },
    { first_name: 'Hamad', last_name: 'Al-Thani', email: 'hamad@acme-corp.com', position: 'Operations Manager', salary: 140000, hire_date: '2024-07-15', department_id: null },
    { first_name: 'Mariam', last_name: 'Al-Suwaidi', email: 'mariam@acme-corp.com', position: 'Finance Manager', salary: 150000, hire_date: '2024-08-01', department_id: null },
  ].map(e => ({ ...e, organization_id: orgId }));
  const { data: empRows, error: empErr } = await supabase.from('hr_employees').insert(employees).select();
  if (empErr) { console.error('    Failed:', empErr.message); process.exit(1); }

  // Assign department heads and department IDs
  const engDept = deptRows.find(d => d.name === 'Engineering');
  const salesDept = deptRows.find(d => d.name === 'Sales');
  const mktgDept = deptRows.find(d => d.name === 'Marketing');
  const opsDept = deptRows.find(d => d.name === 'Operations');
  const finDept = deptRows.find(d => d.name === 'Finance');
  const ceo = empRows.find(e => e.position === 'CEO');
  const cto = empRows.find(e => e.position === 'CTO');
  const vpEng = empRows.find(e => e.position === 'VP Engineering');
  const mktgDir = empRows.find(e => e.position === 'Marketing Director');
  const salesDir = empRows.find(e => e.position === 'Sales Director');
  const opsMgr = empRows.find(e => e.position === 'Operations Manager');
  const finMgr = empRows.find(e => e.position === 'Finance Manager');

  if (engDept && vpEng) {
    await supabase.from('hr_departments').update({ head_id: vpEng.id }).eq('id', engDept.id);
    await supabase.from('hr_employees').update({ department_id: engDept.id }).eq('id', vpEng.id);
    await supabase.from('hr_employees').update({ department_id: engDept.id }).eq('id', empRows.find(e => e.position === 'Senior Developer').id);
  }
  if (salesDept && salesDir) {
    await supabase.from('hr_departments').update({ head_id: salesDir.id }).eq('id', salesDept.id);
    await supabase.from('hr_employees').update({ department_id: salesDept.id }).eq('id', salesDir.id);
  }
  if (mktgDept && mktgDir) {
    await supabase.from('hr_departments').update({ head_id: mktgDir.id }).eq('id', mktgDept.id);
    await supabase.from('hr_employees').update({ department_id: mktgDept.id }).eq('id', mktgDir.id);
  }
  if (opsDept && opsMgr) {
    await supabase.from('hr_departments').update({ head_id: opsMgr.id }).eq('id', opsDept.id);
    await supabase.from('hr_employees').update({ department_id: opsDept.id }).eq('id', opsMgr.id);
  }
  if (finDept && finMgr) {
    await supabase.from('hr_departments').update({ head_id: finMgr.id }).eq('id', finDept.id);
    await supabase.from('hr_employees').update({ department_id: finDept.id }).eq('id', finMgr.id);
  }
  console.log(`    Inserted ${empRows.length} employees and assigned departments`);

  // 13. HR Payroll
  console.log('\n  Seeding hr_payroll...');
  const payroll = empRows.map(e => ({
    organization_id: orgId,
    employee_id: e.id,
    salary: e.salary,
    bonuses: 5000,
    deductions: 2000,
    pay_period_start: '2026-06-01',
    pay_period_end: '2026-06-30',
    status: 'paid',
    paid_at: '2026-06-30T12:00:00Z',
  }));
  const { data: payRows, error: payErr } = await supabase.from('hr_payroll').insert(payroll).select();
  if (payErr) { console.error('    Failed:', payErr.message); process.exit(1); }
  console.log(`    Inserted ${payRows.length} payroll records`);

  // 14. Sales Products
  console.log('\n  Seeding sales_products...');
  const salesProducts = [
    { name: 'Enterprise Suite', sku: 'ENT-001', price: 49999, cost: 25000, category: 'Software' },
    { name: 'Pro License', sku: 'PRO-001', price: 9999, cost: 5000, category: 'Software' },
    { name: 'Consulting Day', sku: 'CONS-001', price: 2500, cost: 1000, category: 'Services' },
    { name: 'Support Package', sku: 'SUP-001', price: 15000, cost: 8000, category: 'Services' },
    { name: 'Training Session', sku: 'TRN-001', price: 5000, cost: 2000, category: 'Services' },
    { name: 'AI Add-on Module', sku: 'AI-001', price: 12000, cost: 6000, category: 'Software' },
  ].map(p => ({ ...p, organization_id: orgId }));
  const { data: spRows, error: spErr } = await supabase.from('sales_products').insert(salesProducts).select();
  if (spErr) { console.error('    Failed:', spErr.message); process.exit(1); }
  console.log(`    Inserted ${spRows.length} sales products`);

  // 15. Sales Orders
  console.log('\n  Seeding sales_orders...');
  const orders = [
    { order_number: 'SO-2026-001', customer_id: custRows[0].id, total: 75000, status: 'completed', order_date: '2026-04-10' },
    { order_number: 'SO-2026-002', customer_id: custRows[1].id, total: 45000, status: 'completed', order_date: '2026-04-22' },
    { order_number: 'SO-2026-003', customer_id: custRows[2].id, total: 120000, status: 'shipped', order_date: '2026-05-05' },
    { order_number: 'SO-2026-004', customer_id: custRows[3].id, total: 25000, status: 'pending', order_date: '2026-06-01' },
    { order_number: 'SO-2026-005', customer_id: custRows[4].id, total: 18000, status: 'cancelled', order_date: '2026-05-15' },
    { order_number: 'SO-2026-006', customer_id: custRows[5].id, total: 32000, status: 'completed', order_date: '2026-06-10' },
    { order_number: 'SO-2026-007', customer_id: custRows[6].id, total: 65000, status: 'shipped', order_date: '2026-06-20' },
    { order_number: 'SO-2026-008', customer_id: custRows[0].id, total: 15000, status: 'pending', order_date: '2026-07-01' },
    { order_number: 'SO-2026-009', customer_id: custRows[2].id, total: 88000, status: 'processing', order_date: '2026-07-05' },
  ].map(o => ({ ...o, organization_id: orgId }));
  const { data: ordRows, error: ordErr } = await supabase.from('sales_orders').insert(orders).select();
  if (ordErr) { console.error('    Failed:', ordErr.message); process.exit(1); }
  console.log(`    Inserted ${ordRows.length} orders`);

  // 16. Projects
  console.log('\n  Seeding projects_projects...');
  const projects = [
    { name: 'Platform Redesign', description: 'Complete redesign of core platform UI/UX', status: 'active', priority: 'high', start_date: '2026-01-15', end_date: '2026-08-30', budget: 500000 },
    { name: 'Mobile App v2', description: 'Native mobile app rewrite', status: 'on_hold', priority: 'high', start_date: '2026-07-01', end_date: '2026-12-31', budget: 300000 },
    { name: 'Data Migration', description: 'Migrate legacy data to new warehouse', status: 'active', priority: 'medium', start_date: '2026-03-01', end_date: '2026-07-31', budget: 150000 },
    { name: 'Security Audit', description: 'External security audit and penetration testing', status: 'completed', priority: 'high', start_date: '2026-04-01', end_date: '2026-05-30', budget: 80000 },
    { name: 'AI Integration', description: 'Integrate AI-powered features into platform', status: 'on_hold', priority: 'medium', start_date: '2026-08-01', end_date: '2026-12-31', budget: 400000 },
    { name: 'Compliance Upgrade', description: 'GDPR and data residency compliance updates', status: 'active', priority: 'high', start_date: '2026-06-01', end_date: '2026-09-30', budget: 200000 },
  ].map(p => ({ ...p, organization_id: orgId }));
  const { data: projRows, error: projErr } = await supabase.from('projects_projects').insert(projects).select();
  if (projErr) { console.error('    Failed:', projErr.message); process.exit(1); }
  console.log(`    Inserted ${projRows.length} projects`);

  // 17. Tasks
  console.log('\n  Seeding projects_tasks...');
  const taskData = [
    { project_name: 'Platform Redesign', title: 'Design system overhaul', status: 'in_progress', priority: 'high', due_date: '2026-07-15', estimated_hours: 120 },
    { project_name: 'Platform Redesign', title: 'Component library migration', status: 'todo', priority: 'high', due_date: '2026-08-01', estimated_hours: 80 },
    { project_name: 'Platform Redesign', title: 'User testing sessions', status: 'review', priority: 'medium', due_date: '2026-06-30', estimated_hours: 40 },
    { project_name: 'Platform Redesign', title: 'Performance optimization', status: 'done', priority: 'medium', due_date: '2026-06-15', estimated_hours: 60 },
    { project_name: 'Data Migration', title: 'Requirements gathering', status: 'done', priority: 'high', due_date: '2026-03-15', estimated_hours: 30 },
    { project_name: 'Data Migration', title: 'Schema mapping', status: 'in_progress', priority: 'high', due_date: '2026-05-30', estimated_hours: 100 },
    { project_name: 'Data Migration', title: 'ETL pipeline development', status: 'todo', priority: 'medium', due_date: '2026-07-01', estimated_hours: 120 },
    { project_name: 'Security Audit', title: 'Penetration testing', status: 'done', priority: 'high', due_date: '2026-05-01', estimated_hours: 40 },
    { project_name: 'Security Audit', title: 'Vulnerability report', status: 'done', priority: 'high', due_date: '2026-05-15', estimated_hours: 20 },
    { project_name: 'Security Audit', title: 'Remediation plan', status: 'done', priority: 'high', due_date: '2026-05-30', estimated_hours: 30 },
    { project_name: 'Mobile App v2', title: 'Market research', status: 'todo', priority: 'medium', due_date: '2026-08-15', estimated_hours: 60 },
    { project_name: 'Mobile App v2', title: 'Tech stack evaluation', status: 'todo', priority: 'high', due_date: '2026-08-01', estimated_hours: 40 },
    { project_name: 'Compliance Upgrade', title: 'Data residency assessment', status: 'in_progress', priority: 'high', due_date: '2026-07-15', estimated_hours: 50 },
    { project_name: 'Compliance Upgrade', title: 'Policy documentation', status: 'todo', priority: 'medium', due_date: '2026-08-30', estimated_hours: 80 },
  ];
  const tasks = taskData.map(t => {
    const proj = projRows.find(p => p.name === t.project_name);
    return {
      organization_id: orgId,
      project_id: proj ? proj.id : projRows[0].id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date,
      estimated_hours: t.estimated_hours,
    };
  });
  const { data: taskRows, error: taskErr } = await supabase.from('projects_tasks').insert(tasks).select();
  if (taskErr) { console.error('    Failed:', taskErr.message); process.exit(1); }
  console.log(`    Inserted ${taskRows.length} tasks`);

  // 18. Inventory Warehouses
  console.log('\n  Seeding inventory_warehouses...');
  const warehouses = [
    { name: 'Dubai Main Warehouse', location: 'Dubai, UAE', capacity: 15000 },
    { name: 'Abu Dhabi Distribution', location: 'Abu Dhabi, UAE', capacity: 10000 },
    { name: 'Riyadh Hub', location: 'Riyadh, Saudi Arabia', capacity: 20000 },
  ].map(w => ({ ...w, organization_id: orgId }));
  const { data: whRows, error: whErr } = await supabase.from('inventory_warehouses').insert(warehouses).select();
  if (whErr) { console.error('    Failed:', whErr.message); process.exit(1); }
  console.log(`    Inserted ${whRows.length} warehouses`);

  // 19. Inventory Suppliers
  console.log('\n  Seeding inventory_suppliers...');
  const suppliers = [
    { name: 'TechSupply Middle East', contact_name: 'Khalid Al-Rashid', email: 'khalid@techsupply.ae', phone: '+971-50-123-4567' },
    { name: 'Global Parts Trading', contact_name: 'Ahmed Hassan', email: 'ahmed@globalparts.ae', phone: '+971-55-987-6543' },
    { name: 'Quality Components LLC', contact_name: 'Mohammed Noor', email: 'mohammed@qualitycomp.com', phone: '+966-55-111-2222' },
    { name: 'Gulf Logistics Solutions', contact_name: 'Saeed Al-Otaibi', email: 'saeed@gulflogistics.com', phone: '+965-99-333-4444' },
  ].map(s => ({ ...s, organization_id: orgId }));
  const { data: suppRows, error: suppErr } = await supabase.from('inventory_suppliers').insert(suppliers).select();
  if (suppErr) { console.error('    Failed:', suppErr.message); process.exit(1); }
  console.log(`    Inserted ${suppRows.length} suppliers`);

  // 20. Inventory Products
  console.log('\n  Seeding inventory_products...');
  const invProducts = [
    { name: 'Laptop Pro 15', sku: 'LAP-001', category: 'Electronics', unit_price: 1999.99, quantity: 45, reorder_level: 10, warehouse_id: whRows[0].id, supplier_id: suppRows[0].id },
    { name: 'Wireless Mouse', sku: 'MOU-001', category: 'Accessories', unit_price: 49.99, quantity: 200, reorder_level: 50, warehouse_id: whRows[0].id, supplier_id: suppRows[1].id },
    { name: 'USB-C Hub', sku: 'HUB-001', category: 'Accessories', unit_price: 79.99, quantity: 150, reorder_level: 30, warehouse_id: whRows[1].id, supplier_id: suppRows[2].id },
    { name: '4K Monitor 27"', sku: 'MON-001', category: 'Electronics', unit_price: 599.99, quantity: 25, reorder_level: 10, warehouse_id: whRows[0].id, supplier_id: suppRows[0].id },
    { name: 'Mechanical Keyboard', sku: 'KEY-001', category: 'Accessories', unit_price: 149.99, quantity: 8, reorder_level: 15, warehouse_id: whRows[1].id, supplier_id: suppRows[1].id },
    { name: 'Server Rack Unit', sku: 'SRV-001', category: 'Infrastructure', unit_price: 4999.99, quantity: 5, reorder_level: 2, warehouse_id: whRows[2].id, supplier_id: suppRows[3].id },
    { name: 'Network Switch 48-port', sku: 'NET-001', category: 'Infrastructure', unit_price: 1299.99, quantity: 12, reorder_level: 5, warehouse_id: whRows[2].id, supplier_id: suppRows[0].id },
    { name: 'Webcam HD Pro', sku: 'CAM-001', category: 'Accessories', unit_price: 129.99, quantity: 60, reorder_level: 20, warehouse_id: whRows[0].id, supplier_id: suppRows[2].id },
    { name: 'Portable SSD 1TB', sku: 'STO-001', category: 'Storage', unit_price: 179.99, quantity: 35, reorder_level: 10, warehouse_id: whRows[1].id, supplier_id: suppRows[1].id },
  ].map(p => ({ ...p, organization_id: orgId }));
  const { data: invProdRows, error: invProdErr } = await supabase.from('inventory_products').insert(invProducts).select();
  if (invProdErr) { console.error('    Failed:', invProdErr.message); process.exit(1); }
  console.log(`    Inserted ${invProdRows.length} inventory products`);

  // 21. Documents
  console.log('\n  Seeding documents...');
  const documents = [
    { name: 'Q3 Strategic Plan.pdf', file_type: 'application/pdf', tags: ['strategy', 'planning'], size_bytes: 245000 },
    { name: 'Employee Handbook 2026.docx', file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', tags: ['hr', 'policies'], size_bytes: 512000 },
    { name: 'Infrastructure Architecture.pdf', file_type: 'application/pdf', tags: ['engineering', 'architecture'], size_bytes: 1800000 },
    { name: 'Sales Playbook.xlsx', file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', tags: ['sales', 'training'], size_bytes: 89000 },
  ].map(d => ({ ...d, organization_id: orgId }));
  const { data: docRows, error: docErr } = await supabase.from('documents').insert(documents).select();
  if (docErr) { console.error('    Failed:', docErr.message); process.exit(1); }
  console.log(`    Inserted ${docRows.length} documents`);

  // 22. Notifications
  console.log('\n  Seeding notifications...');
  const notifications = [
    { title: 'Invoice Overdue', message: 'Invoice INV-2026-005 from Kuwait Business Solutions is overdue', type: 'warning' },
    { title: 'New Deal Closed', message: 'Kuwait Business ERP Migration deal worth $85,000 has been closed won', type: 'success' },
    { title: 'Low Stock Alert', message: 'Mechanical Keyboard is below reorder level (8 remaining)', type: 'error' },
    { title: 'Project Update', message: 'Platform Redesign is 65% complete', type: 'info' },
    { title: 'Payroll Processed', message: 'June payroll has been processed successfully', type: 'success' },
    { title: 'New Lead Assigned', message: 'Faisal Al-Qahtani has been assigned as a qualified lead', type: 'info' },
    { title: 'Budget Alert', message: 'Engineering department has used 64% of Q2 budget', type: 'warning' },
  ].map(n => ({ ...n, organization_id: orgId }));
  const { data: notifRows, error: notifErr } = await supabase.from('notifications').insert(notifications).select();
  if (notifErr) { console.error('    Failed:', notifErr.message); process.exit(1); }
  console.log(`    Inserted ${notifRows.length} notifications`);

  // 23. Dashboards
  console.log('\n  Seeding dashboards...');
  const dashboards = [
    { name: 'Executive Overview', description: 'High-level KPI dashboard for leadership', config: { widgets: ['revenue', 'customers', 'deals', 'employees'] } },
    { name: 'Sales Pipeline', description: 'Sales team pipeline and forecasting', config: { widgets: ['deals_by_stage', 'monthly_revenue', 'conversion_rate'] } },
    { name: 'Engineering Velocity', description: 'Engineering metrics and project tracking', config: { widgets: ['sprint_burndown', 'task_completion', 'deployment_frequency'] } },
  ].map(d => ({ ...d, organization_id: orgId }));
  const { data: dashRows, error: dashErr } = await supabase.from('dashboards').insert(dashboards).select();
  if (dashErr) { console.error('    Failed:', dashErr.message); process.exit(1); }
  console.log(`    Inserted ${dashRows.length} dashboards`);

  // 24. Data Sources
  console.log('\n  Seeding data_sources...');
  const dataSources = [
    { name: 'Stripe Payments', type: 'stripe', config: { live_mode: false }, enabled: true },
    { name: 'Google Analytics', type: 'google_analytics', config: { property_id: 'UA-12345-6' }, enabled: true },
    { name: 'Slack Integration', type: 'slack', config: { channel: '#general' }, enabled: false },
  ].map(d => ({ ...d, organization_id: orgId }));
  const { data: dsRows, error: dsErr } = await supabase.from('data_sources').insert(dataSources).select();
  if (dsErr) { console.error('    Failed:', dsErr.message); process.exit(1); }
  console.log(`    Inserted ${dsRows.length} data sources`);

  // 25. Imported Datasets
  console.log('\n  Seeding imported_datasets...');
  const datasets = [
    { name: 'Q2 Sales Data.xlsx', original_filename: 'Q2_Sales_Data.xlsx', columns: [{ name: 'date', type: 'date' }, { name: 'revenue', type: 'number' }, { name: 'region', type: 'string' }], rows: [{ date: '2026-04-01', revenue: 150000, region: 'UAE' }], row_count: 1, status: 'draft' },
    { name: 'Employee Directory.csv', original_filename: 'employee_directory.csv', columns: [{ name: 'name', type: 'string' }, { name: 'department', type: 'string' }, { name: 'email', type: 'string' }], rows: [{ name: 'Ahmed Al-Maktoum', department: 'Executive', email: 'ahmed@acme-corp.com' }], row_count: 1, status: 'draft' },
    { name: 'Inventory Count.xlsx', original_filename: 'inventory_count.xlsx', columns: [{ name: 'sku', type: 'string' }, { name: 'quantity', type: 'number' }, { name: 'warehouse', type: 'string' }], rows: [{ sku: 'LAP-001', quantity: 45, warehouse: 'Dubai Main' }], row_count: 1, status: 'draft' },
  ].map(d => ({ ...d, organization_id: orgId }));
  const { data: dsets, error: dsetErr } = await supabase.from('imported_datasets').insert(datasets).select();
  if (dsetErr) { console.error('    Failed:', dsetErr.message); process.exit(1); }
  console.log(`    Inserted ${dsets.length} datasets`);

  // 26. Import Mappings
  console.log('\n  Seeding import_mappings...');
  const mappings = [
    { name: 'Sales Data Mapping', dataset_id: dsets[0].id, source_columns: [{ name: 'date', type: 'date' }, { name: 'revenue', type: 'number' }, { name: 'region', type: 'string' }], target_table: 'finance_transactions', column_mapping: { date: 'transaction_date', revenue: 'amount', region: 'description' }, transform_rules: {} },
    { name: 'Employee Mapping', dataset_id: dsets[1].id, source_columns: [{ name: 'name', type: 'string' }, { name: 'department', type: 'string' }, { name: 'email', type: 'string' }], target_table: 'hr_employees', column_mapping: { name: 'full_name', department: 'department', email: 'email' }, transform_rules: {} },
    { name: 'Inventory Mapping', dataset_id: dsets[2].id, source_columns: [{ name: 'sku', type: 'string' }, { name: 'quantity', type: 'number' }, { name: 'warehouse', type: 'string' }], target_table: 'inventory_products', column_mapping: { sku: 'sku', quantity: 'quantity', warehouse: 'warehouse' }, transform_rules: {} },
  ].map(m => ({ ...m, organization_id: orgId }));
  const { data: mapRows, error: mapErr } = await supabase.from('import_mappings').insert(mappings).select();
  if (mapErr) { console.error('    Failed:', mapErr.message); process.exit(1); }
  console.log(`    Inserted ${mapRows.length} mappings`);

  console.log('\n=== Seeding complete! ===');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
