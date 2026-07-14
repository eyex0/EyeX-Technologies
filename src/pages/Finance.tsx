import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function FinancePage() {
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
                  { label: "Revenue", value: "$4.82M", delta: "+12.4%", icon: "payments" },
                  { label: "Expenses", value: "$3.44M", delta: "+4.2%", icon: "trending_down" },
                  { label: "Profit", value: "$1.38M", delta: "+28.6%", icon: "savings" },
                  { label: "Runway", value: "18 mo", icon: "schedule" },
                ]}
              />
              <Card title="Cash flow — 12mo">
                <BarChart
                  data={[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((l, i) => ({ label: l, value: 40 + i * 4 + Math.random() * 10 }))}
                />
              </Card>
            </>
          ),
        },
        {
          key: "inv",
          label: "Invoices",
          render: () => (
            <TableCard
              title="Invoices"
              columns={[
                { key: "id", label: "Invoice" },
                { key: "customer", label: "Customer" },
                { key: "amount", label: "Amount" },
                {
                  key: "status",
                  label: "Status",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === "Paid" ? "success" : r.status === "Overdue" ? "danger" : "info"
                      }
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                { key: "due", label: "Due", align: "right" },
              ]}
              rows={m.invoices}
            />
          ),
        },
        {
          key: "bud",
          label: "Budgets",
          render: () => (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                ["Engineering", "$1.2M", "78%"],
                ["Sales", "$800K", "92%"],
                ["Marketing", "$400K", "64%"],
                ["Ops", "$200K", "41%"],
              ].map(([n, b, p]) => (
                <div key={n} className="bento-card rounded-lg p-5">
                  <div className="flex justify-between mb-3">
                    <span className="text-white text-sm">{n}</span>
                    <span className="text-muted-foreground text-xs font-mono">{b}</span>
                  </div>
                  <div className="h-1 bg-border rounded">
                    <div className="h-full bg-white" style={{ width: p as string }} />
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mt-2">
                    {p} used
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: "rep",
          label: "Reports",
          render: () => (
            <TableCard
              title="Financial reports"
              columns={[
                { key: "name", label: "Report" },
                { key: "owner", label: "Owner" },
                { key: "updated", label: "Updated", align: "right" },
              ]}
              rows={m.reportsList.filter((r) => r.cat === "Financial")}
            />
          ),
        },
        {
          key: "fcst",
          label: "Forecast",
          render: () => (
            <Card title="Revenue forecast">
              <BarChart
                data={["Q1", "Q2", "Q3", "Q4"].map((l, i) => ({ label: l, value: 20 + i * 15 }))}
              />
            </Card>
          ),
        },
      ]}
    />
  );
}
