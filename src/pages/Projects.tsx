import { useEffect, useState } from "react";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DatabaseService.getProjects(),
      DatabaseService.getProjectTasks(),
    ]).then(([proj, t]) => {
      setProjects(proj);
      setTasks(t);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const activeProjects = projects.filter(p => p.status === "active").length;
  const completedTasks = tasks.filter(t => t.status === "done").length;

  return (
    <ModulePage
      title="Projects"
      subtitle="Tasks · Teams · Timeline"
      tabs={[
        {
          key: "proj",
          label: "Projects",
          render: () => (
            <>
              <KpiRow
                items={[
                  { label: "Projects", value: projects.length.toString(), icon: "folder" },
                  { label: "Active", value: activeProjects.toString(), icon: "play_circle" },
                  { label: "Tasks", value: tasks.length.toString(), icon: "checklist" },
                  { label: "Completed", value: completedTasks.toString(), icon: "check_circle" },
                ]}
              />
              <TableCard
                title={`Projects (${projects.length})`}
                columns={[
                  { key: "name", label: "Project" },
                  { key: "status", label: "Status", render: (r: any) => (
                    <Badge tone={r.status === "completed" ? "success" : r.status === "active" ? "info" : r.status === "on_hold" ? "warn" : "danger"}>{r.status}</Badge>
                  )},
                  { key: "priority", label: "Priority", render: (r: any) => (
                    <Badge tone={r.priority === "critical" ? "danger" : r.priority === "high" ? "warn" : "neutral"}>{r.priority}</Badge>
                  )},
                  { key: "budget", label: "Budget", align: "right" },
                  { key: "created_at", label: "Created", align: "right" },
                ]}
                rows={projects.map(p => ({ ...p, budget: p.budget ? `$${Number(p.budget).toLocaleString()}` : "-", created_at: new Date(p.created_at).toLocaleDateString() }))}
              />
            </>
          ),
        },
        {
          key: "tasks",
          label: "Tasks",
          render: () => (
            <TableCard
              title={`Tasks (${tasks.length})`}
              columns={[
                { key: "title", label: "Task" },
                { key: "assignee_name", label: "Assignee", render: (r: any) => r.profiles?.full_name || "-" },
                { key: "status", label: "Status", render: (r: any) => (
                  <Badge tone={r.status === "done" ? "success" : r.status === "in_progress" ? "info" : r.status === "review" ? "warn" : "neutral"}>{r.status}</Badge>
                )},
                { key: "priority", label: "Priority", render: (r: any) => (
                  <Badge tone={r.priority === "high" || r.priority === "critical" ? "danger" : r.priority === "medium" ? "warn" : "neutral"}>{r.priority}</Badge>
                )},
                { key: "due_date", label: "Due", align: "right" },
              ]}
              rows={tasks.map(t => ({ ...t, due_date: t.due_date ? new Date(t.due_date).toLocaleDateString() : "-" }))}
            />
          ),
        },
        {
          key: "kanban",
          label: "Kanban",
          render: () => {
            const cols = [
              { key: "todo", label: "To Do" },
              { key: "in_progress", label: "In Progress" },
              { key: "review", label: "Review" },
              { key: "done", label: "Done" },
            ];
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cols.map(col => (
                  <div key={col.key} className="bento-card rounded-lg p-4">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground mb-3">{col.label}</div>
                    <div className="space-y-2">
                      {tasks.filter(t => t.status === col.key).slice(0, 5).map(t => (
                        <div key={t.id} className="border border-border rounded p-3 text-xs text-white hover:bg-secondary/40">
                          <div>{t.title}</div>
                          <div className="text-[10px] font-mono text-muted-foreground mt-1">{t.profiles?.full_name || "-"} · {t.priority}</div>
                        </div>
                      ))}
                      {tasks.filter(t => t.status === col.key).length === 0 && (
                        <div className="text-[10px] text-muted-foreground text-center py-4">No tasks</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          },
        },
        {
          key: "time",
          label: "Timeline",
          render: () => (
            <Card title="Project progress">
              <div className="p-5 space-y-4">
                {projects.slice(0, 10).map(p => (
                  <div key={p.id}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white">{p.name}</span>
                      <span className="font-mono text-muted-foreground">{p.status}</span>
                    </div>
                    <div className="h-1 bg-border rounded">
                      <div className="h-full bg-white" style={{ width: `${Math.min(100, Math.round(Math.random() * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ),
        },
      ]}
    />
  );
}
