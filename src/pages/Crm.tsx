import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'

const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  active: 'success', at_risk: 'danger', vip: 'info', new: 'info', contacted: 'warning', qualified: 'success', lost: 'default',
  prospecting: 'default', proposal: 'warning', negotiation: 'info', closed_won: 'success', closed_lost: 'danger',
}

export function CrmPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [deals, setDeals] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [tab, setTab] = useState('customers')

  useEffect(() => {
    db.getCustomers().then(setCustomers)
    db.getLeads().then(setLeads)
    db.getDeals().then(setDeals)
    db.getActivities().then(setActivities)
  }, [])

  const pipelineValue = deals.reduce((s: number, d: any) => s + Number(d.value), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">CRM</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm">Customers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{customers.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Leads</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{leads.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Pipeline Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${pipelineValue.toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Activities</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{activities.length}</div></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Company</Th><Th>Status</Th><Th>LTV</Th><Th>Last Contacted</Th></Tr></THead>
            <TBody>{customers.map((c: any) => (
              <Tr key={c.id}><Td className="font-medium">{c.name}</Td><Td>{c.company}</Td><Td><Badge variant={statusVariant[c.status] || 'default'}>{c.status}</Badge></Td><Td>${Number(c.lifetime_value).toLocaleString()}</Td><Td>{c.last_contacted ? new Date(c.last_contacted).toLocaleDateString() : '-'}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="leads">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Email</Th><Th>Source</Th><Th>Status</Th></Tr></THead>
            <TBody>{leads.map((l: any) => (
              <Tr key={l.id}><Td className="font-medium">{l.name}</Td><Td>{l.email}</Td><Td>{l.source}</Td><Td><Badge variant={statusVariant[l.status] || 'default'}>{l.status}</Badge></Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="deals">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Value</Th><Th>Stage</Th><Th>Probability</Th><Th>Close Date</Th></Tr></THead>
            <TBody>{deals.map((d: any) => (
              <Tr key={d.id}><Td className="font-medium">{d.name}</Td><Td>${Number(d.value).toLocaleString()}</Td><Td><Badge variant={statusVariant[d.stage] || 'default'}>{d.stage}</Badge></Td><Td>{d.probability}%</Td><Td>{d.close_date ? new Date(d.close_date).toLocaleDateString() : '-'}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="activities">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Type</Th><Th>Subject</Th><Th>Description</Th><Th>Date</Th></Tr></THead>
            <TBody>{activities.map((a: any) => (
              <Tr key={a.id}><Td><Badge>{a.type}</Badge></Td><Td className="font-medium">{a.subject}</Td><Td>{a.description}</Td><Td>{new Date(a.created_at).toLocaleDateString()}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
