import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  todo: 'bg-gray-100', in_progress: 'bg-blue-50', review: 'bg-yellow-50', done: 'bg-green-50',
}

const kanbanColumns = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'review', label: 'Review' },
  { key: 'done', label: 'Done' },
]

export function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [tab, setTab] = useState('list')

  useEffect(() => {
    db.getProjects().then(setProjects)
    db.getTasks().then(setTasks)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-sm">Projects</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{projects.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Tasks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{tasks.length}</div></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list">Projects</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Status</Th><Th>Priority</Th><Th>Budget</Th><Th>Timeline</Th></Tr></THead>
            <TBody>{projects.map((p: any) => (
              <Tr key={p.id}><Td className="font-medium">{p.name}</Td><Td><Badge variant={p.status === 'completed' ? 'success' : p.status === 'in_progress' ? 'info' : 'default'}>{p.status}</Badge></Td><Td><Badge variant={p.priority === 'high' ? 'danger' : p.priority === 'medium' ? 'warning' : 'default'}>{p.priority}</Badge></Td><Td>{p.budget ? `$${Number(p.budget).toLocaleString()}` : '-'}</Td><Td>{p.start_date ? `${new Date(p.start_date).toLocaleDateString()} - ${p.end_date ? new Date(p.end_date).toLocaleDateString() : ''}` : '-'}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="kanban">
          <div className="grid grid-cols-4 gap-4">
            {kanbanColumns.map((col) => (
              <div key={col.key} className={cn('rounded-lg p-4 min-h-[400px]', statusColors[col.key])}>
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-600">{col.label} ({tasks.filter((t: any) => t.status === col.key).length})</h3>
                <div className="space-y-3">
                  {tasks.filter((t: any) => t.status === col.key).map((task: any) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'} className="text-xs">{task.priority}</Badge>
                          {task.due_date && <span className="text-xs text-gray-500">{new Date(task.due_date).toLocaleDateString()}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="space-y-4">
            {projects.map((p: any) => {
              const projectTasks = tasks.filter((t: any) => t.project_id === p.id)
              const done = projectTasks.filter((t: any) => t.status === 'done').length
              const pct = projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0
              return (
                <Card key={p.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <Badge variant={p.status === 'completed' ? 'success' : p.status === 'in_progress' ? 'info' : 'default'}>{p.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{pct}% ({done}/{projectTasks.length} tasks)</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
