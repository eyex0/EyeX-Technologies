import { useEffect, useState } from "react";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DatabaseService.getProducts(),
      DatabaseService.getStockItems(),
      DatabaseService.getSuppliers(),
    ])
      .then(([prod, stock, sup]) => {
        setProducts(prod);
        setStockItems(stock);
        setSuppliers(sup);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const lowStock = stockItems.filter((s) => s.quantity <= s.min_stock).length;
  const totalStock = stockItems.reduce((s, i) => s + Number(i.quantity || 0), 0);

  return (
    <ModulePage
      title="Inventory"
      subtitle="Stock · Warehouses · Suppliers"
      tabs={[
        {
          key: "prod",
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
                  label: "Status",
                  render: (r: any) => (
                    <Badge tone={r.active ? "success" : "warn"}>
                      {r.active ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
              ]}
              rows={products.map((p) => ({ ...p, price: `$${Number(p.price).toLocaleString()}` }))}
            />
          ),
        },
        {
          key: "stock",
          label: "Stock",
          render: () => (
            <>
              <KpiRow
                items={[
                  { label: "Products", value: products.length.toString(), icon: "inventory_2" },
                  { label: "Total Stock", value: totalStock.toString(), icon: "check_circle" },
                  { label: "Low Stock", value: lowStock.toString(), icon: "warning" },
                  {
                    label: "Suppliers",
                    value: suppliers.length.toString(),
                    icon: "local_shipping",
                  },
                ]}
              />
              <TableCard
                title={`Stock levels (${stockItems.length})`}
                columns={[
                  {
                    key: "product_name",
                    label: "Product",
                    render: (r: any) => r.products?.name || "-",
                  },
                  { key: "sku", label: "SKU", render: (r: any) => r.products?.sku || "-" },
                  { key: "quantity", label: "Qty", align: "right" },
                  {
                    key: "warehouse_name",
                    label: "Warehouse",
                    render: (r: any) => r.warehouses?.name || "-",
                  },
                  {
                    key: "status",
                    label: "Status",
                    render: (r: any) => (
                      <Badge
                        tone={
                          r.quantity <= r.min_stock
                            ? "danger"
                            : r.quantity <= r.max_stock * 0.3
                              ? "warn"
                              : "success"
                        }
                      >
                        {r.quantity <= r.min_stock ? "Low" : "OK"}
                      </Badge>
                    ),
                  },
                ]}
                rows={stockItems}
              />
            </>
          ),
        },
        {
          key: "ware",
          label: "Warehouses",
          render: () => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["SF-01", "NYC-02", "AMS-03"].map((id, i) => (
                <div key={id} className="bento-card rounded-lg p-5">
                  <div className="text-white text-sm">
                    {["San Francisco", "New York", "Amsterdam"][i]}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    {id}
                  </div>
                  <div className="mt-4 h-1 bg-border rounded">
                    <div className="h-full bg-white" style={{ width: `${[82, 64, 41][i]}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Capacity {[82, 64, 41][i]}%
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: "sup",
          label: "Suppliers",
          render: () => (
            <TableCard
              title={`Suppliers (${suppliers.length})`}
              columns={[
                { key: "name", label: "Supplier" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "lead_time", label: "Lead time", align: "right" },
              ]}
              rows={suppliers.map((s) => ({ ...s, lead_time: `${s.lead_time} days` }))}
            />
          ),
        },
      ]}
    />
  );
}
