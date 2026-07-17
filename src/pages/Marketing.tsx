import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const campaigns = [
  { id: 1, name: 'Summer Sale 2026', status: 'active', budget: 50000, spent: 32000, impressions: 450000, clicks: 12000 },
  { id: 2, name: 'Product Launch Q3', status: 'planned', budget: 75000, spent: 0, impressions: 0, clicks: 0 },
  { id: 3, name: 'Brand Awareness', status: 'active', budget: 30000, spent: 18000, impressions: 280000, clicks: 8500 },
  { id: 4, name: 'Retargeting Campaign', status: 'paused', budget: 20000, spent: 15000, impressions: 190000, clicks: 5200 },
]

export function MarketingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Marketing</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm">Active Campaigns</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Budget</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${campaigns.reduce((s, c) => s + c.budget, 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Spent</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${campaigns.reduce((s, c) => s + c.spent, 0).toLocaleString()}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Impressions</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{campaigns.reduce((s, c) => s + c.impressions, 0).toLocaleString()}</div></CardContent></Card>
      </div>
      <Card><CardContent className="p-0">
        <table className="w-full text-sm"><thead><tr className="border-b"><th className="h-12 px-4 text-left font-medium text-gray-500">Name</th><th className="h-12 px-4 text-left font-medium text-gray-500">Status</th><th className="h-12 px-4 text-left font-medium text-gray-500">Budget</th><th className="h-12 px-4 text-left font-medium text-gray-500">Spent</th><th className="h-12 px-4 text-left font-medium text-gray-500">Impressions</th><th className="h-12 px-4 text-left font-medium text-gray-500">Clicks</th></tr></thead><tbody>
          {campaigns.map(c => (
            <tr key={c.id} className="border-b hover:bg-gray-50"><td className="p-4 font-medium">{c.name}</td><td className="p-4"><Badge variant={c.status === 'active' ? 'success' : c.status === 'planned' ? 'info' : 'warning'}>{c.status}</Badge></td><td className="p-4">${c.budget.toLocaleString()}</td><td className="p-4">${c.spent.toLocaleString()}</td><td className="p-4">{c.impressions.toLocaleString()}</td><td className="p-4">{c.clicks.toLocaleString()}</td></tr>
          ))}
        </tbody></table>
      </CardContent></Card>
    </div>
  )
}
