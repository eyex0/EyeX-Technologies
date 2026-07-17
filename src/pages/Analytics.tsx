import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AnalyticsPage() {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    Promise.all([
      db.getCustomers(), db.getInvoices(), db.getDeals(), db.getProjects(), db.getEmployees(), db.getTransactions(),
    ]).then(([customers, invoices, deals, projects, employees, transactions]) => {
      const revenue = transactions.filter((t: any) => t.type === 'revenue').reduce((s: number, t: any) => s + Number(t.amount), 0)
      const expenses = transactions.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
      setData({ customers: customers.length, invoices: invoices.length, deals: deals.length, projects: projects.length, employees: employees.length, revenue, expenses })
    })
  }, [])

  const chartData = [
    { name: 'Customers', value: data.customers || 0, fill: '#3b82f6' },
    { name: 'Invoices', value: data.invoices || 0, fill: '#22c55e' },
    { name: 'Deals', value: data.deals || 0, fill: '#f59e0b' },
    { name: 'Projects', value: data.projects || 0, fill: '#8b5cf6' },
    { name: 'Employees', value: data.employees || 0, fill: '#ec4899' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">${(data.revenue || 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">${(data.expenses || 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Net Profit</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${((data.revenue || 0) - (data.expenses || 0)).toLocaleString()}</div></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {chartData.map((d) => (
          <Card key={d.name}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{d.name}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold" style={{ color: d.fill }}>{d.value.toLocaleString()}</div></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Cross-Module KPIs</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
