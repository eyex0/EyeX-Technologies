export const customers = [
  { name: "Acme Corp", contact: "Sarah Chen", value: "$284K", status: "Active", industry: "SaaS" },
  { name: "Globex Industries", contact: "James Park", value: "$156K", status: "Active", industry: "Manufacturing" },
  { name: "Initech LLC", contact: "Priya Rao", value: "$92K", status: "Churn Risk", industry: "Finance" },
  { name: "Umbrella Group", contact: "Marco Silva", value: "$412K", status: "Active", industry: "Healthcare" },
  { name: "Wayne Enterprises", contact: "Lila Osei", value: "$1.2M", status: "Active", industry: "Conglomerate" },
  { name: "Stark Industries", contact: "Reed Palmer", value: "$780K", status: "Active", industry: "Defense" },
  { name: "Hooli", contact: "Alex Kim", value: "$203K", status: "Prospect", industry: "Tech" },
  { name: "Pied Piper", contact: "Nadia Ito", value: "$54K", status: "Active", industry: "Tech" },
];

export const leads = [
  { name: "Northwind Traders", owner: "Sarah C.", stage: "Qualified", score: 92, value: "$120K" },
  { name: "Contoso Ltd", owner: "James P.", stage: "Demo", score: 78, value: "$85K" },
  { name: "Fabrikam Inc", owner: "Priya R.", stage: "Proposal", score: 88, value: "$210K" },
  { name: "Adventure Works", owner: "Marco S.", stage: "Negotiation", score: 95, value: "$340K" },
  { name: "Tailspin Toys", owner: "Lila O.", stage: "New", score: 42, value: "$28K" },
];

export const deals = [
  { name: "Q4 Renewal — Acme", stage: "Negotiation", value: "$284K", close: "Dec 12", prob: "80%" },
  { name: "Expansion — Globex", stage: "Proposal", value: "$156K", close: "Dec 20", prob: "65%" },
  { name: "New Logo — Contoso", stage: "Demo", value: "$85K", close: "Jan 08", prob: "40%" },
  { name: "Upsell — Umbrella", stage: "Closed Won", value: "$412K", close: "Nov 30", prob: "100%" },
];

export const orders = [
  { id: "ORD-4821", customer: "Acme Corp", amount: "$12,480", status: "Fulfilled", date: "Nov 28" },
  { id: "ORD-4822", customer: "Globex", amount: "$3,290", status: "Processing", date: "Nov 28" },
  { id: "ORD-4823", customer: "Umbrella", amount: "$28,120", status: "Fulfilled", date: "Nov 27" },
  { id: "ORD-4824", customer: "Wayne Ent.", amount: "$91,004", status: "Shipped", date: "Nov 27" },
  { id: "ORD-4825", customer: "Hooli", amount: "$1,540", status: "Pending", date: "Nov 26" },
];

export const invoices = [
  { id: "INV-9021", customer: "Acme Corp", amount: "$12,480", status: "Paid", due: "Nov 30" },
  { id: "INV-9022", customer: "Globex", amount: "$3,290", status: "Overdue", due: "Nov 15" },
  { id: "INV-9023", customer: "Umbrella", amount: "$28,120", status: "Paid", due: "Nov 22" },
  { id: "INV-9024", customer: "Wayne Ent.", amount: "$91,004", status: "Sent", due: "Dec 15" },
];

export const products = [
  { sku: "SKU-101", name: "Neural Core X1", stock: 128, price: "$1,240", category: "Hardware" },
  { sku: "SKU-102", name: "Vector Engine Pro", stock: 42, price: "$3,900", category: "Software" },
  { sku: "SKU-103", name: "Edge Node Kit", stock: 8, price: "$820", category: "Hardware" },
  { sku: "SKU-104", name: "Inference Cluster", stock: 3, price: "$18,500", category: "Enterprise" },
  { sku: "SKU-105", name: "API Credits (10k)", stock: 9999, price: "$99", category: "Digital" },
];

export const campaigns = [
  { name: "Winter Launch — Search", channel: "Google Ads", spend: "$24.1K", roas: "4.2x", ctr: "3.8%", conv: "612" },
  { name: "Retarget — Enterprise", channel: "Meta", spend: "$12.8K", roas: "3.1x", ctr: "2.1%", conv: "184" },
  { name: "Newsletter — Nov", channel: "Email", spend: "$0.9K", roas: "12.4x", ctr: "8.2%", conv: "1,204" },
  { name: "Brand — Programmatic", channel: "DV360", spend: "$41.0K", roas: "1.8x", ctr: "0.9%", conv: "88" },
];

export const employees = [
  { name: "Sarah Chen", role: "VP Sales", dept: "Sales", status: "Active", location: "SF" },
  { name: "James Park", role: "Product Lead", dept: "Product", status: "Active", location: "NYC" },
  { name: "Priya Rao", role: "Sr. Engineer", dept: "Engineering", status: "Active", location: "Remote" },
  { name: "Marco Silva", role: "Marketing Manager", dept: "Marketing", status: "On Leave", location: "London" },
  { name: "Lila Osei", role: "CFO", dept: "Finance", status: "Active", location: "SF" },
  { name: "Reed Palmer", role: "HR Director", dept: "People", status: "Active", location: "NYC" },
];

export const projects = [
  { name: "Atlas Migration", lead: "Priya Rao", status: "On Track", progress: 72, due: "Q1 2026" },
  { name: "Aurora Redesign", lead: "James Park", status: "At Risk", progress: 41, due: "Dec 2025" },
  { name: "Vector v2 Launch", lead: "Sarah Chen", status: "On Track", progress: 88, due: "Dec 2025" },
  { name: "Compliance SOC2", lead: "Lila Osei", status: "Complete", progress: 100, due: "Nov 2025" },
];

export const documents = [
  { name: "MSA — Acme Corp.pdf", type: "Contract", owner: "Legal", updated: "2h ago", tag: "Signed" },
  { name: "Q3 Financials.xlsx", type: "Report", owner: "Finance", updated: "1d ago", tag: "Final" },
  { name: "Employee Handbook 2026.pdf", type: "Policy", owner: "HR", updated: "3d ago", tag: "Draft" },
  { name: "INV-9023.pdf", type: "Invoice", owner: "Finance", updated: "5d ago", tag: "Paid" },
  { name: "Vendor SLA — Globex.pdf", type: "Contract", owner: "Legal", updated: "1w ago", tag: "Review" },
];

export const integrationsCatalog = [
  { name: "Google Sheets", desc: "Sync spreadsheets bi-directionally", status: "Connected", icon: "table_chart" },
  { name: "Excel", desc: "Import & export Excel workbooks", status: "Connected", icon: "table_view" },
  { name: "Supabase", desc: "Managed Postgres + Auth backend", status: "Connected", icon: "database" },
  { name: "Stripe", desc: "Payments, subscriptions, invoicing", status: "Connected", icon: "payments" },
  { name: "Shopify", desc: "Ecommerce orders and products", status: "Available", icon: "storefront" },
  { name: "HubSpot", desc: "CRM contacts and deals sync", status: "Available", icon: "hub" },
  { name: "Salesforce", desc: "Enterprise CRM integration", status: "Available", icon: "cloud" },
  { name: "Google Analytics", desc: "Website & app analytics", status: "Connected", icon: "analytics" },
  { name: "Meta Ads", desc: "Facebook & Instagram campaigns", status: "Available", icon: "ads_click" },
  { name: "Google Ads", desc: "Search & display advertising", status: "Available", icon: "ads_click" },
  { name: "Slack", desc: "Alerts and workflow notifications", status: "Connected", icon: "chat" },
  { name: "Notion", desc: "Docs and knowledge base sync", status: "Available", icon: "sticky_note_2" },
  { name: "QuickBooks", desc: "Accounting and bookkeeping", status: "Available", icon: "receipt_long" },
  { name: "Power BI", desc: "Push datasets to Power BI", status: "Available", icon: "insights" },
];

export const notifications = [
  { title: "Invoice INV-9022 is overdue", meta: "Finance • 12m ago", tone: "warn" as const },
  { title: "New lead: Adventure Works ($340K)", meta: "CRM • 34m ago", tone: "info" as const },
  { title: "Deploy succeeded: Vector v2 build 481", meta: "Platform • 1h ago", tone: "success" as const },
  { title: "Stock alert: Inference Cluster (3 left)", meta: "Inventory • 2h ago", tone: "danger" as const },
  { title: "Marco Silva starts leave tomorrow", meta: "HR • 5h ago", tone: "neutral" as const },
];

export const sourcesConnected = [
  { name: "sales_2025.csv", type: "CSV", owner: "Sarah C.", status: "Synced", lastSync: "2m ago" },
  { name: "hubspot_prod", type: "API", owner: "James P.", status: "Synced", lastSync: "8m ago" },
  { name: "warehouse.postgres", type: "Database", owner: "Priya R.", status: "Syncing", lastSync: "just now" },
  { name: "ads_export.xlsx", type: "Excel", owner: "Marco S.", status: "Failed", lastSync: "1h ago" },
  { name: "stripe_live", type: "API", owner: "Lila O.", status: "Synced", lastSync: "14m ago" },
];

export const reportsList = [
  { name: "Executive Summary — November", cat: "Business", owner: "CEO Office", updated: "1d ago" },
  { name: "P&L Q4 Forecast", cat: "Financial", owner: "Finance", updated: "2d ago" },
  { name: "Campaign ROAS by Channel", cat: "Marketing", owner: "Marketing", updated: "3h ago" },
  { name: "Pipeline Coverage Ratio", cat: "Sales", owner: "Sales Ops", updated: "5h ago" },
  { name: "Attrition & Headcount", cat: "HR", owner: "People", updated: "1w ago" },
];
