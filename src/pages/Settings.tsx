import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'

export function SettingsPage() {
  const [org, setOrg] = useState<any>(null)
  const [profiles, setProfiles] = useState<any[]>([])
  const [tab, setTab] = useState('organization')

  useEffect(() => {
    db.getOrganization().then(setOrg)
    db.getProfiles().then(setProfiles)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
        <TabsContent value="organization">
          <Card>
            <CardHeader><CardTitle>Organization Details</CardTitle></CardHeader>
            <CardContent>
              {org ? (
                <div className="space-y-3">
                  <div><span className="text-sm text-gray-500">Name:</span><p className="font-medium">{org.name}</p></div>
                  <div><span className="text-sm text-gray-500">Slug:</span><p className="font-medium">{org.slug}</p></div>
                  <div><span className="text-sm text-gray-500">Plan:</span><Badge>{org.plan}</Badge></div>
                  <div><span className="text-sm text-gray-500">Created:</span><p className="font-medium">{new Date(org.created_at).toLocaleDateString()}</p></div>
                </div>
              ) : <p className="text-gray-500">Loading...</p>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card><CardContent className="p-6"><p className="text-gray-500">Profile settings are managed through your authentication provider.</p></CardContent></Card>
        </TabsContent>
        <TabsContent value="team">
          <Card><CardContent className="p-0">
            <Table><THead><Tr><Th>Email</Th><Th>Role</Th><Th>Joined</Th></Tr></THead><TBody>
              {profiles.map((p: any) => (
                <Tr key={p.id}><Td className="font-medium">{p.email}</Td><Td><Badge>{p.role}</Badge></Td><Td>{new Date(p.created_at).toLocaleDateString()}</Td></Tr>
              ))}
            </TBody></Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
