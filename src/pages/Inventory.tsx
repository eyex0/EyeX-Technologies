import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'

export function InventoryPage() {
  const [products, setProducts] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [tab, setTab] = useState('products')

  useEffect(() => {
    db.getInventoryProducts().then(setProducts)
    db.getWarehouses().then(setWarehouses)
    db.getSuppliers().then(setSuppliers)
  }, [])

  const lowStock = products.filter((p: any) => p.quantity <= p.reorder_level)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{products.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Warehouses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{warehouses.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Low Stock Alerts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{lowStock.length}</div></CardContent></Card>
      </div>

      {lowStock.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader><CardTitle className="text-red-700">Low Stock Alerts</CardTitle></CardHeader>
          <CardContent>
            {lowStock.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-1">
                <span className="font-medium">{p.name}</span>
                <Badge variant="danger">{p.quantity} remaining (reorder at {p.reorder_level})</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>SKU</Th><Th>Price</Th><Th>Quantity</Th><Th>Reorder Level</Th><Th>Status</Th></Tr></THead>
            <TBody>{products.map((p: any) => (
              <Tr key={p.id}><Td className="font-medium">{p.name}</Td><Td>{p.sku}</Td><Td>${Number(p.unit_price).toFixed(2)}</Td><Td>{p.quantity}</Td><Td>{p.reorder_level}</Td><Td>{p.quantity <= p.reorder_level ? <Badge variant="danger">Low Stock</Badge> : <Badge variant="success">In Stock</Badge>}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="warehouses">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Location</Th><Th>Capacity</Th></Tr></THead>
            <TBody>{warehouses.map((w: any) => (
              <Tr key={w.id}><Td className="font-medium">{w.name}</Td><Td>{w.location}</Td><Td>{w.capacity?.toLocaleString() || '-'}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="suppliers">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Contact</Th><Th>Email</Th><Th>Phone</Th></Tr></THead>
            <TBody>{suppliers.map((s: any) => (
              <Tr key={s.id}><Td className="font-medium">{s.name}</Td><Td>{s.contact_name}</Td><Td>{s.email}</Td><Td>{s.phone}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
