import { useQuery } from "@tanstack/react-query";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { SalesService, FinanceService, CrmService } from "@/services/data";

const SKELETON = <div className="h-4 w-full animate-pulse rounded bg-[#1A1A1C]" />;

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-[#A1A1AA]">No data available</p>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function SalesPage() {
  const summary = useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => SalesService.getSummary(),
  });

  const financeSummary = useQuery({
    queryKey: ["finance-summary"],
    queryFn: () => FinanceService.getSummary(),
  });

  const orders = useQuery({
    queryKey: ["sales-orders"],
    queryFn: () => SalesService.getOrders(),
  });

  const products = useQuery({
    queryKey: ["sales-products"],
    queryFn: () => SalesService.getProducts(),
  });

  const invoices = useQuery({
    queryKey: ["finance-invoices"],
    queryFn: () => FinanceService.getInvoices(),
  });

  const customers = useQuery({
    queryKey: ["crm-customers"],
    queryFn: () => CrmService.getCustomers(),
  });

  const totalRevenue = summary.data?.totalRevenue ?? 0;
  const totalOrders = summary.data?.totalOrders ?? 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const statusTone = (status: string) => {
    const s = status.toLowerCase();
    if (s === "fulfilled" || s === "completed" || s === "delivered" || s === "paid") return "success" as const;
    if (s === "pending" || s === "processing" || s === "draft" || s === "sent") return "warn" as const;
    if (s === "overdue") return "danger" as const;
    return "info" as const;
  };

  const orderRows = (orders.data ?? []).map((o) => ({
    order_number: o.order_number,
    customer_id: o.customer_id ?? "—",
    total: formatCurrency(o.total ?? 0),
    status: o.status ?? "pending",
    order_date: o.order_date ? formatDate(o.order_date) : "—",
  }));

  const invoiceRows = (invoices.data ?? []).map((i) => ({
    invoice_number: i.invoice_number,
    customer_name: i.customer_name,
    amount: formatCurrency(i.amount ?? 0),
    status: i.status ?? "draft",
    due_date: i.due_date ? formatDate(i.due_date) : "—",
  }));

  const productRows = (products.data ?? []).map((p) => ({
    sku: p.sku,
    name: p.name,
    category: p.category ?? "—",
    price: formatCurrency(p.price ?? 0),
  }));

  const customerRows = (customers.data ?? []).slice(0, 6).map((c) => ({
    name: c.name,
    value: formatCurrency(c.lifetime_value ?? 0),
  }));

  return <ModulePage title="Sales" subtitle="Orders · Revenue · Forecast" tabs={[
    { key: "dash", label: "Dashboard", render: () => (
      <>
        <KpiRow items={[
          { label: "Revenue MTD", value: summary.isLoading ? "—" : formatCurrency(totalRevenue), delta: `${summary.data?.completedOrders ?? 0} completed`, icon: "payments" },
          { label: "Orders", value: summary.isLoading ? "—" : String(totalOrders), delta: `${summary.data?.pendingOrders ?? 0} pending`, icon: "shopping_bag" },
          { label: "AOV", value: summary.isLoading ? "—" : formatCurrency(avgOrderValue), icon: "receipt" },
          { label: "Invoices", value: financeSummary.isLoading ? "—" : String(financeSummary.data?.totalInvoiced ?? 0), delta: `${financeSummary.data?.overdueInvoices ?? 0} overdue`, icon: "emoji_events" },
        ]}/>
        <Card title="Revenue by order">
          {orders.isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
          ) : orderRows.length === 0 ? <EmptyState /> : (
            <BarChart data={orderRows.slice(0, 12).map((o, i) => ({ label: o.order_number, value: parseFloat(o.total.replace(/[$K,M]/g, "")) * (o.total.includes("M") ? 1000000 : o.total.includes("K") ? 1000 : 1) }))} />
          )}
        </Card>
      </>
    )},
    { key: "orders", label: "Orders", render: () => (
      orders.isLoading ? (
        <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
      ) : orderRows.length === 0 ? <EmptyState /> : (
        <TableCard title="Recent orders" columns={[
          { key: "order_number", label: "Order" },{ key: "customer_id", label: "Customer" },{ key: "total", label: "Amount" },
          { key: "status", label: "Status", render: (r: typeof orderRows[number]) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
          { key: "order_date", label: "Date", align: "right" },
        ]} rows={orderRows} />
      )
    )},
    { key: "invoices", label: "Invoices", render: () => (
      invoices.isLoading ? (
        <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
      ) : invoiceRows.length === 0 ? <EmptyState /> : (
        <TableCard title="Invoices" columns={[
          { key: "invoice_number", label: "Invoice" },{ key: "customer_name", label: "Customer" },{ key: "amount", label: "Amount" },
          { key: "status", label: "Status", render: (r: typeof invoiceRows[number]) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
          { key: "due_date", label: "Due", align: "right" },
        ]} rows={invoiceRows} />
      )
    )},
    { key: "products", label: "Products", render: () => (
      products.isLoading ? (
        <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
      ) : productRows.length === 0 ? <EmptyState /> : (
        <TableCard title="Product catalog" columns={[
          { key: "sku", label: "SKU" },{ key: "name", label: "Product" },{ key: "category", label: "Category" },{ key: "price", label: "Price", align: "right" },
        ]} rows={productRows} />
      )
    )},
    { key: "revenue", label: "Revenue", render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue mix">
          {summary.isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 4 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
          ) : (
            <BarChart data={[
              { label: "Orders", value: summary.data?.totalOrders ?? 0 },
              { label: "Revenue", value: Math.round((summary.data?.totalRevenue ?? 0) / 1000) },
              { label: "Completed", value: summary.data?.completedOrders ?? 0 },
              { label: "Pending", value: summary.data?.pendingOrders ?? 0 },
            ]} />
          )}
        </Card>
        <Card title="Top accounts">
          <div className="p-5 space-y-3">
            {customers.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)
            ) : customerRows.length === 0 ? (
              <EmptyState />
            ) : (
              customerRows.map((c) => (
                <div key={c.name} className="flex justify-between text-xs border-b border-border pb-2"><span className="text-white">{c.name}</span><span className="font-mono text-muted-foreground">{c.value}</span></div>
              ))
            )}
          </div>
        </Card>
      </div>
    )},
    { key: "perf", label: "Performance", render: () => (
      <TableCard title="Sales reps" columns={[
        { key: "name", label: "Rep" },{ key: "quota", label: "Quota" },{ key: "actual", label: "Actual" },{ key: "pct", label: "%", align: "right" },
      ]} rows={[
        { name: "Sarah Chen", quota: "$800K", actual: "$942K", pct: "118%" },
        { name: "James Park", quota: "$600K", actual: "$548K", pct: "91%" },
        { name: "Priya Rao", quota: "$500K", actual: "$612K", pct: "122%" },
        { name: "Marco Silva", quota: "$500K", actual: "$402K", pct: "80%" },
      ]}/>
    )},
    { key: "forecast", label: "Forecast", render: () => (
      <Card title="Q4 forecast">
        <div className="p-5 space-y-4">
          <div className="flex items-baseline gap-3"><div className="text-3xl text-white font-semibold">$14.2M</div><Badge tone="success">+7% vs plan</Badge></div>
          <BarChart data={[{label:"Oct",value:38},{label:"Nov",value:52},{label:"Dec",value:64}]}/>
        </div>
      </Card>
    )},
  ]}/>;
}
