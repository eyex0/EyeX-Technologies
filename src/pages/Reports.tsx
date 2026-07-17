import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Download } from 'lucide-react'

const reports = [
  { id: 1, name: 'Monthly Financial Summary', type: 'Finance', date: '2026-06-30', status: 'ready' },
  { id: 2, name: 'Sales Pipeline Report', type: 'Sales', date: '2026-06-28', status: 'ready' },
  { id: 3, name: 'HR Headcount Report', type: 'HR', date: '2026-06-25', status: 'generating' },
  { id: 4, name: 'Customer Activity Report', type: 'CRM', date: '2026-06-20', status: 'ready' },
  { id: 5, name: 'Inventory Valuation', type: 'Inventory', date: '2026-06-15', status: 'ready' },
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 text-gray-400 shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{r.type} - {new Date(r.date).toLocaleDateString()}</p>
                    <Badge variant={r.status === 'ready' ? 'success' : 'warning'} className="mt-2">{r.status}</Badge>
                  </div>
                </div>
                {r.status === 'ready' && <Download className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
