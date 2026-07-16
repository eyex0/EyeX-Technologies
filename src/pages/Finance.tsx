import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [finData, setFinData] = useState<{ revenue: number; expenses: number; months: any[] }>({ revenue: 0, expenses: 0, months: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DatabaseService.getInvoices(),
      DatabaseService.getBudgets(),
      DatabaseService.getRevenueExpenses(),
    ]).then(([inv, bud, fin]) => {
      setInvoices(inv);
      setBudgets(bud);
      setFinData(fin);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const profit = finData.revenue - finData.expenses;
  const profitMargin = finData.revenue > 0 ? ((profit / finData.revenue) * 100).toFixed(1) : "0.0";

  return (
    <ModulePage
      title="Finance"
      subtitle="Revenue · Expenses · Forecast"
      tabs={[
        {
          key: "over",
          label: "Overview",
          render: () => (
            <>
              <KpiRow
                items={[
                  { label: "Revenue", value: `$${(finData.revenue / 1000).toFixed(1)}K`, delta: "+12.4%", icon: "payments" },
                  { label: "Expenses", value: `$${(finData.expenses / 1000).toFixed(1)}K`, delta: "+4.2%", icon: "trending_down" },
                  { label: "Profit", value: `$${(profit / 1000).toFixed(1)}K`, delta: `+${profitMargin}%`, icon: "savings" },
                  { label: "Margin", value: `${profitMargin}%`, icon: "pie_chart" },
                ]}
              />
              <Card title="Revenue vs Expenses">
                {finData.months.length > 0 ? (
                  <div className="p-4">
                    <BarChart data={finData.months.map(m => ({ label: m.label, value: m.revenue }))} />
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    {loading ? "Loading..." : "No transaction data yet. Add transactions to see cash flow."}
                  </div>
                )}
              </Card>
            </>
          ),
        },
        {
          key: "inv",
          label: "Invoices",
          render: () => (
            <TableCard
              title={`Invoices (${invoices.length})`}
              columns={[
                { key: "invoice_number", label: "Invoice" },
                { key: "customer_id", label: "Customer" },
                { key: "total", label: "Amount", align: "right" },
                { key: "status", label: "Status", render: (r: any) => (
                  <Badge tone={r.status === "paid" ? "success" : r.status === "overdue" ? "danger" : r.status === "sent" ? "info" : "warn"}>{r.status}</Badge>
                )},
                { key: "due_date", label: "Due", align: "right" },
              ]}
              rows={invoices.map(i => ({ ...i, total: `$${Number(i.total).toLocaleString()}`, due_date: i.due_date ? new Date(i.due_date).toLocaleDateString() : "-" }))}
            />
          ),
        },
        {
          key: "bud",
          label: "Budgets",
          render: () => (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(budgets.length > 0 ? budgets : [
                { department: "Engineering", amount: 1200000, spent: 936000 },
                { department: "Sales", amount: 800000, spent: 736000 },
                { department: "Marketing", amount: 400000, spent: 256000 },
                { department: "Ops", amount: 200000, spent: 82000 },
              ]).map((b: any) => {
                const pct = b.amount > 0 ? Math.round((b.spent / b.amount) * 100) : 0;
                return (
                  <div key={b.department || b.id} className="bento-card rounded-lg p-5">
                    <div className="flex justify-between mb-3">
                      <span className="text-white text-sm">{b.department}</span>
                      <span className="text-muted-foreground text-xs font-mono">${(b.amount / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="h-1 bg-border rounded">
                      <div className="h-full bg-white" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase mt-2">{pct}% used</div>
                  </div>
                );
              })}
            </div>
          ),
        },
        {
          key: "fcst",
          label: "Forecast",
          render: () => (
            <Card title="Revenue forecast">
              <BarChart data={["Q1", "Q2", "Q3", "Q4"].map((l, i) => ({ label: l, value: 20 + i * 15 }))} />
            </Card>
          ),
        },
      ]}
    />
  );
}
