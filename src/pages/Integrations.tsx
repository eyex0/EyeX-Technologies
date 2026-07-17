import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Puzzle } from 'lucide-react'

const integrations = [
  { id: 1, name: 'Stripe', description: 'Payment processing and invoicing', category: 'Finance', status: 'connected' },
  { id: 2, name: 'Google Analytics', description: 'Website and marketing analytics', category: 'Analytics', status: 'connected' },
  { id: 3, name: 'Slack', description: 'Team communication and alerts', category: 'Communication', status: 'connected' },
  { id: 4, name: 'GitHub', description: 'Code repository and CI/CD', category: 'Development', status: 'disconnected' },
  { id: 5, name: 'HubSpot', description: 'CRM and marketing automation', category: 'CRM', status: 'disconnected' },
  { id: 6, name: 'QuickBooks', description: 'Accounting and bookkeeping', category: 'Finance', status: 'disconnected' },
]

export function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Integrations</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Puzzle className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.name}</p>
                    <Badge variant={item.status === 'connected' ? 'success' : 'default'}>{item.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
