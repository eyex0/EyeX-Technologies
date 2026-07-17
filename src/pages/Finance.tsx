import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [budgets, setBudgets] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [tab, setTab] = useState('invoices')

  useEffect(() => {
    db.getInvoices().then(setInvoices)
    db.getBudgets().then(setBudgets)
    db.getTransactions().then(setTransactions)
  }, [])

  const revenue = transactions.filter((t: any) => t.type === 'revenue').reduce((s: number, t: any) => s + Number(t.amount), 0)
  const expenses = transactions.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2026, i).toLocaleString('default', { month: 'short' })
    const rev = transactions.filter((t: any) => t.type === 'revenue' && new Date(t.transaction_date).getMonth() === i).reduce((s: number, t: any) => s + Number(t.amount), 0)
    const exp = transactions.filter((t: any) => t.type === 'expense' && new Date(t.transaction_date).getMonth() === i).reduce((s: number, t: any) => s + Number(t.amount), 0)
    return { month, revenue: rev, expenses: exp }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finance</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">${revenue.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">${expenses.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Net Profit</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${(revenue - expenses).toLocaleString()}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Cash Flow (12 months)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <THead>
                  <Tr><Th>Invoice</Th><Th>Customer</Th><Th>Amount</Th><Th>Status</Th><Th>Due Date</Th></Tr>
                </THead>
                <TBody>
                  {invoices.map((inv: any) => (
                    <Tr key={inv.id}>
                      <Td className="font-medium">{inv.invoice_number}</Td>
                      <Td>{inv.customer_name}</Td>
                      <Td>${Number(inv.amount).toLocaleString()}</Td>
                      <Td><Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : inv.status === 'sent' ? 'info' : 'warning'}>{inv.status}</Badge></Td>
                      <Td>{new Date(inv.due_date).toLocaleDateString()}</Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budgets">
          <Card><CardContent className="p-0">
            <Table><THead><Tr><Th>Department</Th><Th>Category</Th><Th>Allocated</Th><Th>Spent</Th><Th>Remaining</Th></Tr></THead><TBody>
              {budgets.map((b: any) => (
                <Tr key={b.id}>
                  <Td>{b.department}</Td><Td>{b.category}</Td>
                  <Td>${Number(b.allocated).toLocaleString()}</Td>
                  <Td>${Number(b.spent).toLocaleString()}</Td>
                  <Td>${(Number(b.allocated) - Number(b.spent)).toLocaleString()}</Td>
                </Tr>
              ))}
            </TBody></Table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card><CardContent className="p-0">
            <Table><THead><Tr><Th>Date</Th><Th>Type</Th><Th>Category</Th><Th>Amount</Th><Th>Description</Th></Tr></THead><TBody>
              {transactions.map((t: any) => (
                <Tr key={t.id}>
                  <Td>{new Date(t.transaction_date).toLocaleDateString()}</Td>
                  <Td><Badge variant={t.type === 'revenue' ? 'success' : 'danger'}>{t.type}</Badge></Td>
                  <Td>{t.category}</Td>
                  <Td className={t.type === 'revenue' ? 'text-green-600' : 'text-red-600'}>${Number(t.amount).toLocaleString()}</Td>
                  <Td>{t.description}</Td>
                </Tr>
              ))}
            </TBody></Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
