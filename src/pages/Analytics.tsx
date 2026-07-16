import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, BarChart, Kpi } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    customers: 0,
    invoices: 0,
    deals: 0,
    projects: 0,
    employees: 0,
    revenue: 0,
  });

  useEffect(() => {
    Promise.all([
      DatabaseService.getCustomers().catch(() => []),
      DatabaseService.getInvoices().catch(() => []),
      DatabaseService.getDeals().catch(() => []),
      DatabaseService.getProjects().catch(() => []),
      DatabaseService.getEmployees().catch(() => []),
      DatabaseService.getRevenueExpenses().catch(() => ({ revenue: 0, expenses: 0, months: [] })),
    ]).then(([cust, inv, deals, proj, emp, fin]) => {
      setMetrics({
        customers: cust.length,
        invoices: inv.length,
        deals: deals.length,
        projects: proj.length,
        employees: emp.length,
        revenue: fin.revenue,
      });
    });
  }, []);

  return (
    <AppShell title="Analytics" subtitle="Cross-module intelligence">
      <KpiRow
        items={[
          {
            label: "Customers",
            value: metrics.customers.toString(),
            delta: `+${metrics.customers}`,
            icon: "groups",
          },
          { label: "Invoices", value: metrics.invoices.toString(), icon: "receipt" },
          { label: "Deals", value: metrics.deals.toString(), icon: "trending_up" },
          { label: "Revenue", value: `$${(metrics.revenue / 1000).toFixed(0)}K`, icon: "payments" },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Business overview" className="lg:col-span-2">
          <div className="p-5 grid grid-cols-2 gap-4">
            <Kpi label="Projects" value={metrics.projects.toString()} icon="folder" />
            <Kpi label="Employees" value={metrics.employees.toString()} icon="people" />
            <Kpi label="Invoices" value={metrics.invoices.toString()} icon="receipt" />
            <Kpi label="Active Deals" value={metrics.deals.toString()} icon="handshake" />
          </div>
        </Card>
        <Card title="Modules">
          <div className="p-5 space-y-3">
            {[
              ["Finance", metrics.invoices],
              ["CRM", metrics.customers + metrics.deals],
              ["HR", metrics.employees],
              ["Projects", metrics.projects],
            ].map(([n, v]) => (
              <div key={n as string} className="flex justify-between text-xs">
                <span className="text-white">{n as string}</span>
                <span className="font-mono text-muted-foreground">{v} records</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
