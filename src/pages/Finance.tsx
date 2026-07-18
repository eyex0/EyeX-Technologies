import { useQuery } from "@tanstack/react-query";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { FinanceService } from "@/services/data";
import { reportsList } from "@/lib/mock";

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

export function FinancePage() {
  const summary = useQuery({
    queryKey: ["finance-summary"],
    queryFn: () => FinanceService.getSummary(),
  });

  const invoices = useQuery({
    queryKey: ["finance-invoices"],
    queryFn: () => FinanceService.getInvoices(),
  });

  const budgets = useQuery({
    queryKey: ["finance-budgets"],
    queryFn: () => FinanceService.getBudgets(),
  });

  const transactions = useQuery({
    queryKey: ["finance-transactions"],
    queryFn: () => FinanceService.getTransactions(),
  });

  const s = summary.data;

  const invoiceRows = (invoices.data ?? []).map((i) => ({
    invoice_number: i.invoice_number,
    customer_name: i.customer_name,
    amount: formatCurrency(i.amount ?? 0),
    status: i.status ?? "draft",
    due_date: i.due_date ? formatDate(i.due_date) : "—",
  }));

  const statusTone = (status: string) => {
    const st = status.toLowerCase();
    if (st === "paid" || st === "completed") return "success" as const;
    if (st === "overdue") return "danger" as const;
    return "info" as const;
  };

  const budgetRows = (budgets.data ?? []).map((b) => {
    const pct = b.allocated > 0 ? Math.round((b.spent / b.allocated) * 100) : 0;
    return {
      department: b.department,
      category: b.category,
      allocated: formatCurrency(b.allocated ?? 0),
      spent: formatCurrency(b.spent ?? 0),
      pct,
    };
  });

  const txRows = (transactions.data ?? []).slice(0, 10).map((t) => ({
    type: t.type,
    category: t.category,
    amount: formatCurrency(t.amount ?? 0),
    description: t.description ?? t.category ?? "—",
    transaction_date: t.transaction_date ? formatDate(t.transaction_date) : "—",
  }));

  return <ModulePage title="Finance" subtitle="Revenue · Expenses · Forecast" tabs={[
    { key: "over", label: "Overview", render: () => (
      <>
        <KpiRow items={[
          { label: "Revenue", value: summary.isLoading ? "—" : formatCurrency(s?.totalRevenue ?? 0), delta: `${formatCurrency(s?.netIncome ?? 0)} net`, icon: "payments" },
          { label: "Expenses", value: summary.isLoading ? "—" : formatCurrency(s?.totalExpenses ?? 0), icon: "trending_down" },
          { label: "Profit", value: summary.isLoading ? "—" : formatCurrency(s?.netIncome ?? 0), icon: "savings" },
          { label: "Invoices", value: summary.isLoading ? "—" : `${s?.pendingInvoices ?? 0} pending`, delta: `${s?.overdueInvoices ?? 0} overdue`, icon: "schedule" },
        ]}/>
        <Card title="Cash flow — recent transactions">
          {transactions.isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
          ) : txRows.length === 0 ? <EmptyState /> : (
            <BarChart data={txRows.slice(0, 12).map((t, i) => ({ label: t.category || `TX${i + 1}`, value: Math.abs(parseFloat(t.amount.replace(/[$K,M]/g, "")) * (t.amount.includes("M") ? 1000000 : t.amount.includes("K") ? 1000 : 1)) }))} />
          )}
        </Card>
      </>
    )},
    { key: "inv", label: "Invoices", render: () => (
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
    { key: "bud", label: "Budgets", render: () => (
      budgets.isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="bento-card rounded-lg p-5 space-y-3">{Array.from({ length: 3 }).map((_, j) => <div key={j}>{SKELETON}</div>)}</div>)}</div>
      ) : budgetRows.length === 0 ? <EmptyState /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {budgetRows.map((b) => (
            <div key={b.department + b.category} className="bento-card rounded-lg p-5">
              <div className="flex justify-between mb-3"><span className="text-white text-sm">{b.department}</span><span className="text-muted-foreground text-xs font-mono">{b.allocated}</span></div>
              <div className="h-1 bg-border rounded"><div className="h-full bg-white" style={{width:`${Math.min(b.pct, 100)}%`}}/></div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase mt-2">{b.pct}% used</div>
            </div>
          ))}
        </div>
      )
    )},
    { key: "rep", label: "Reports", render: () => (
      <TableCard title="Financial reports" columns={[
        { key: "name", label: "Report" },{ key: "owner", label: "Owner" },{ key: "updated", label: "Updated", align: "right" },
      ]} rows={reportsList.filter(r=>r.cat==="Financial")} />
    )},
    { key: "fcst", label: "Forecast", render: () => (
      <Card title="Revenue forecast"><BarChart data={["Q1","Q2","Q3","Q4"].map((l,i)=>({label:l,value:20+i*15}))}/></Card>
    )},
  ]}/>;
}
