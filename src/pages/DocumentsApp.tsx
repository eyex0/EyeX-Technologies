import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FileText } from 'lucide-react'

export function DocumentsAppPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => { db.getDocuments().then(setDocuments) }, [])

  const allTags = [...new Set(documents.flatMap((d: any) => d.tags || []))].sort()
  const filtered = documents.filter((d: any) =>
    !filter || (d.tags || []).includes(filter) || d.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Documents</h1>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Search documents..." className="w-64" value={filter} onChange={(e) => setFilter(e.target.value)} />
        {allTags.map((tag) => (
          <button key={tag} onClick={() => setFilter(filter === tag ? '' : tag)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filter === tag ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{tag}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc: any) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-start gap-3">
              <FileText className="h-8 w-8 text-blue-600 shrink-0 mt-1" />
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs text-gray-500 mt-1">{doc.file_type || 'Unknown type'}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {(doc.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="default" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
