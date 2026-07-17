import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'

export function SalesPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    db.getOrders().then(setOrders)
    db.getSalesProducts().then(setProducts)
    db.getInvoices().then(setInvoices)
  }, [])

  const totalRevenue = invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + Number(i.amount), 0)
  const totalOrders = orders.reduce((s: number, o: any) => s + Number(o.total), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sales</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Orders Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalOrders.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Order #</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th></Tr></THead>
            <TBody>{orders.map((o: any) => (
              <Tr key={o.id}><Td className="font-medium">{o.order_number}</Td><Td>${Number(o.total).toLocaleString()}</Td><Td><Badge variant={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'}>{o.status}</Badge></Td><Td>{new Date(o.order_date).toLocaleDateString()}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="products">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>SKU</Th><Th>Price</Th><Th>Cost</Th><Th>Category</Th></Tr></THead>
            <TBody>{products.map((p: any) => (
              <Tr key={p.id}><Td className="font-medium">{p.name}</Td><Td>{p.sku}</Td><Td>${Number(p.price).toLocaleString()}</Td><Td>{p.cost ? `$${Number(p.cost).toLocaleString()}` : '-'}</Td><Td>{p.category}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Invoice</Th><Th>Customer</Th><Th>Amount</Th><Th>Status</Th></Tr></THead>
            <TBody>{invoices.map((i: any) => (
              <Tr key={i.id}><Td className="font-medium">{i.invoice_number}</Td><Td>{i.customer_name}</Td><Td>${Number(i.amount).toLocaleString()}</Td><Td><Badge variant={i.status === 'paid' ? 'success' : i.status === 'overdue' ? 'danger' : 'warning'}>{i.status}</Badge></Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
