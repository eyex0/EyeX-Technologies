import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DataSourcesPage() {
  const [sources, setSources] = useState<any[]>([])

  useEffect(() => { db.getDataSources().then(setSources) }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Data Sources</h1>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{sources.length} data source{sources.length !== 1 ? 's' : ''} configured</p>
        <Button><Upload className="h-4 w-4 mr-2" />Upload File</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sources.map((s: any) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{s.name}</p>
                    <Badge variant={s.enabled ? 'success' : 'default'}>{s.enabled ? 'Enabled' : 'Disabled'}</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Type: {s.type}</p>
                  {s.last_synced_at && <p className="text-xs text-gray-400 mt-1">Last synced: {new Date(s.last_synced_at).toLocaleString()}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
