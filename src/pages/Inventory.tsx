import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function InventoryPage() {
  return <ModulePage title="Inventory" subtitle="Stock · Warehouses · Suppliers" tabs={[
    { key: "prod", label: "Products", render: () => (
      <TableCard title="Products" columns={[
        { key: "sku", label: "SKU" },{ key: "name", label: "Product" },{ key: "category", label: "Category" },{ key: "stock", label: "Stock" },{ key: "price", label: "Price", align: "right" },
      ]} rows={m.products}/>
    )},
    { key: "stock", label: "Stock", render: () => (
      <>
        <KpiRow items={[
          { label: "SKUs", value: "1,284", icon: "inventory_2" },
          { label: "In stock", value: "1,142", delta: "+18", icon: "check_circle" },
          { label: "Low stock", value: "42", delta: "+8", icon: "warning" },
          { label: "Out of stock", value: "12", icon: "block" },
        ]}/>
        <TableCard title="Low stock" columns={[
          { key: "sku", label: "SKU" },{ key: "name", label: "Product" },{ key: "stock", label: "Stock", align: "right" },
        ]} rows={m.products.filter(p=>p.stock<50)}/>
      </>
    )},
    { key: "ware", label: "Warehouses", render: () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[["SF-01","San Francisco","82%"],["NYC-02","New York","64%"],["AMS-03","Amsterdam","41%"]].map(([id,loc,cap]) => (
          <div key={id} className="bento-card rounded-lg p-5">
            <div className="text-white text-sm">{loc}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">{id}</div>
            <div className="mt-4 h-1 bg-border rounded"><div className="h-full bg-white" style={{width:cap as string}}/></div>
            <div className="text-xs text-muted-foreground mt-2">Capacity {cap}</div>
          </div>
        ))}
      </div>
    )},
    { key: "sup", label: "Suppliers", render: () => (
      <TableCard title="Suppliers" columns={[
        { key: "name", label: "Supplier" },{ key: "country", label: "Country" },{ key: "lead", label: "Lead time" },{ key: "rating", label: "Rating", align: "right" },
      ]} rows={[
        { name: "Nexus Components", country: "Taiwan", lead: "14 days", rating: "A+" },
        { name: "Orion Logistics", country: "USA", lead: "3 days", rating: "A" },
        { name: "Meridian Parts", country: "Germany", lead: "10 days", rating: "B+" },
      ]}/>
    )},
    { key: "po", label: "Purchase orders", render: () => (
      <TableCard title="Purchase orders" columns={[
        { key: "po", label: "PO" },{ key: "supplier", label: "Supplier" },{ key: "amount", label: "Amount" },{ key: "status", label: "Status", align: "right" },
      ]} rows={[
        { po: "PO-2841", supplier: "Nexus", amount: "$48,200", status: "Received" },
        { po: "PO-2842", supplier: "Orion", amount: "$12,900", status: "In Transit" },
        { po: "PO-2843", supplier: "Meridian", amount: "$92,400", status: "Ordered" },
      ]}/>
    )},
    { key: "an", label: "Analytics", render: () => (
      <Card title="Turnover — 12w"><BarChart data={Array.from({length:12},(_,i)=>({label:`W${i+1}`,value:30+Math.random()*70}))}/></Card>
    )},
  ]}/>;
}

