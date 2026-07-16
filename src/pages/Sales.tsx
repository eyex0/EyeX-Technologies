import { useEffect, useState } from "react";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function SalesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DatabaseService.getOrders(),
      DatabaseService.getProducts(),
      DatabaseService.getInvoices(),
    ])
      .then(([ord, prod, inv]) => {
        setOrders(ord);
        setProducts(prod);
        setInvoices(inv);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed",
  ).length;

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
                  {
                    label: "Total Revenue",
                    value: `$${(totalRevenue / 1000).toFixed(0)}K`,
                    delta: "+12.4%",
                    icon: "payments",
                  },
                  {
                    label: "Orders",
                    value: orders.length.toString(),
                    delta: `+${pendingOrders}`,
                    icon: "shopping_bag",
                  },
                  { label: "Products", value: products.length.toString(), icon: "inventory_2" },
                  { label: "Win Rate", value: "34%", delta: "+2.1%", icon: "emoji_events" },
                ]}
              />
              <Card title="Revenue by order">
                <BarChart
                  data={orders.slice(0, 10).map((o, i) => ({
                    label: o.order_number || `O-${i + 1}`,
                    value: Number(o.total || 0) / 1000,
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
              title={`Orders (${orders.length})`}
              columns={[
                { key: "order_number", label: "Order" },
                {
                  key: "customer_name",
                  label: "Customer",
                  render: (r: any) => r.customers?.name || "-",
                },
                { key: "total", label: "Amount", align: "right" },
                {
                  key: "status",
                  label: "Status",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === "delivered"
                          ? "success"
                          : r.status === "shipped"
                            ? "info"
                            : r.status === "cancelled"
                              ? "danger"
                              : "warn"
                      }
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                { key: "created_at", label: "Date", align: "right" },
              ]}
              rows={orders.map((o) => ({
                ...o,
                total: `$${Number(o.total).toLocaleString()}`,
                created_at: new Date(o.created_at).toLocaleDateString(),
              }))}
            />
          ),
        },
        {
          key: "invoices",
          label: "Invoices",
          render: () => (
            <TableCard
              title={`Invoices (${invoices.length})`}
              columns={[
                { key: "invoice_number", label: "Invoice" },
                { key: "customer_id", label: "Customer" },
                { key: "total", label: "Amount", align: "right" },
                {
                  key: "status",
                  label: "Status",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === "paid"
                          ? "success"
                          : r.status === "overdue"
                            ? "danger"
                            : r.status === "sent"
                              ? "info"
                              : "warn"
                      }
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                { key: "due_date", label: "Due", align: "right" },
              ]}
              rows={invoices.map((i) => ({
                ...i,
                total: `$${Number(i.total).toLocaleString()}`,
                due_date: i.due_date ? new Date(i.due_date).toLocaleDateString() : "-",
              }))}
            />
          ),
        },
        {
          key: "products",
          label: "Products",
          render: () => (
            <TableCard
              title={`Products (${products.length})`}
              columns={[
                { key: "sku", label: "SKU" },
                { key: "name", label: "Product" },
                { key: "unit", label: "Unit" },
                { key: "price", label: "Price", align: "right" },
                {
                  key: "active",
                  label: "Active",
                  render: (r: any) => (
                    <Badge tone={r.active ? "success" : "warn"}>{r.active ? "Yes" : "No"}</Badge>
                  ),
                },
              ]}
              rows={products.map((p) => ({ ...p, price: `$${Number(p.price).toLocaleString()}` }))}
            />
          ),
        },
        {
          key: "perf",
          label: "Performance",
          render: () => (
            <TableCard
              title="Sales performance"
              columns={[
                { key: "metric", label: "Metric" },
                { key: "value", label: "Value" },
              ]}
              rows={[
                { metric: "Total Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K` },
                { metric: "Total Orders", value: orders.length.toString() },
                { metric: "Products", value: products.length.toString() },
                {
                  metric: "Avg Order Value",
                  value: orders.length > 0 ? `$${(totalRevenue / orders.length).toFixed(0)}` : "$0",
                },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
