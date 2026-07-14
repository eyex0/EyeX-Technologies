import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function SalesPage() {
  return (
    <ModulePage
      title="Sales"
      subtitle="Orders · Revenue · Forecast"
      tabs={[
        {
          key: "dash",
          label: "Dashboard",
          render: () => (
            <>
              <KpiRow
                items={[
                  { label: "Revenue MTD", value: "$4.82M", delta: "+12.4%", icon: "payments" },
                  { label: "Orders", value: "1,284", delta: "+4.1%", icon: "shopping_bag" },
                  { label: "AOV", value: "$3,750", delta: "+0.9%", icon: "receipt" },
                  { label: "Win Rate", value: "34%", delta: "+2.1%", icon: "emoji_events" },
                ]}
              />
              <Card title="Revenue by week">
                <BarChart
                  data={Array.from({ length: 12 }, (_, i) => ({
                    label: `W${i + 1}`,
                    value: 30 + i * 5 + Math.random() * 10,
                  }))}
                />
              </Card>
            </>
          ),
        },
        {
          key: "orders",
          label: "Orders",
          render: () => (
            <TableCard
              title="Recent orders"
              columns={[
                { key: "id", label: "Order" },
                { key: "customer", label: "Customer" },
                { key: "amount", label: "Amount" },
                {
                  key: "status",
                  label: "Status",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === "Fulfilled"
                          ? "success"
                          : r.status === "Pending"
                            ? "warn"
                            : "info"
                      }
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                { key: "date", label: "Date", align: "right" },
              ]}
              rows={m.orders}
            />
          ),
        },
        {
          key: "invoices",
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
          key: "products",
          label: "Products",
          render: () => (
            <TableCard
              title="Product catalog"
              columns={[
                { key: "sku", label: "SKU" },
                { key: "name", label: "Product" },
                { key: "category", label: "Category" },
                { key: "stock", label: "Stock" },
                { key: "price", label: "Price", align: "right" },
              ]}
              rows={m.products}
            />
          ),
        },
        {
          key: "revenue",
          label: "Revenue",
          render: () => (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Revenue mix">
                <BarChart
                  data={[
                    { label: "Sub", value: 82 },
                    { label: "Pro", value: 56 },
                    { label: "Ent", value: 120 },
                    { label: "Serv", value: 38 },
                  ]}
                />
              </Card>
              <Card title="Top accounts">
                <div className="p-5 space-y-3">
                  {m.customers.slice(0, 6).map((c) => (
                    <div
                      key={c.name}
                      className="flex justify-between text-xs border-b border-border pb-2"
                    >
                      <span className="text-white">{c.name}</span>
                      <span className="font-mono text-muted-foreground">{c.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ),
        },
        {
          key: "perf",
          label: "Performance",
          render: () => (
            <TableCard
              title="Sales reps"
              columns={[
                { key: "name", label: "Rep" },
                { key: "quota", label: "Quota" },
                { key: "actual", label: "Actual" },
                { key: "pct", label: "%", align: "right" },
              ]}
              rows={[
                { name: "Sarah Chen", quota: "$800K", actual: "$942K", pct: "118%" },
                { name: "James Park", quota: "$600K", actual: "$548K", pct: "91%" },
                { name: "Priya Rao", quota: "$500K", actual: "$612K", pct: "122%" },
                { name: "Marco Silva", quota: "$500K", actual: "$402K", pct: "80%" },
              ]}
            />
          ),
        },
        {
          key: "forecast",
          label: "Forecast",
          render: () => (
            <Card title="Q4 forecast">
              <div className="p-5 space-y-4">
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl text-white font-semibold">$14.2M</div>
                  <Badge tone="success">+7% vs plan</Badge>
                </div>
                <BarChart
                  data={[
                    { label: "Oct", value: 38 },
                    { label: "Nov", value: 52 },
                    { label: "Dec", value: 64 },
                  ]}
                />
              </div>
            </Card>
          ),
        },
      ]}
    />
  );
}
