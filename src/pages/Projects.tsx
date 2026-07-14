import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function ProjectsPage() {
  return (
    <ModulePage
      title="Projects"
      subtitle="Tasks · Teams · Timeline"
      tabs={[
        {
          key: "proj",
          label: "Projects",
          render: () => (
            <TableCard
              title="All projects"
              columns={[
                { key: "name", label: "Project" },
                { key: "lead", label: "Lead" },
                {
                  key: "status",
                  label: "Status",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === "On Track"
                          ? "success"
                          : r.status === "At Risk"
                            ? "warn"
                            : r.status === "Complete"
                              ? "info"
                              : "neutral"
                      }
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                {
                  key: "progress",
                  label: "Progress",
                  render: (r: any) => (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-border rounded">
                        <div className="h-full bg-white" style={{ width: `${r.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {r.progress}%
                      </span>
                    </div>
                  ),
                },
                { key: "due", label: "Due", align: "right" },
              ]}
              rows={m.projects}
            />
          ),
        },
        {
          key: "tasks",
          label: "Tasks",
          render: () => (
            <TableCard
              title="Tasks"
              columns={[
                { key: "task", label: "Task" },
                { key: "assignee", label: "Assignee" },
                { key: "priority", label: "Priority" },
                { key: "due", label: "Due", align: "right" },
              ]}
              rows={[
                { task: "Migrate auth service", assignee: "Priya", priority: "High", due: "Dec 3" },
                { task: "Redesign onboarding", assignee: "James", priority: "Med", due: "Dec 8" },
                { task: "Vector v2 QA", assignee: "Sarah", priority: "High", due: "Dec 5" },
                { task: "SOC2 evidence pack", assignee: "Lila", priority: "Low", due: "Dec 15" },
              ]}
            />
          ),
        },
        {
          key: "time",
          label: "Timeline",
          render: () => (
            <Card title="Timeline">
              <div className="p-5 space-y-4">
                {m.projects.map((p) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white">{p.name}</span>
                      <span className="font-mono text-muted-foreground">{p.due}</span>
                    </div>
                    <div className="h-1 bg-border rounded">
                      <div className="h-full bg-white" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ),
        },
        {
          key: "teams",
          label: "Teams",
          render: () => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Engineering", "Design", "Ops"].map((t) => (
                <div key={t} className="bento-card rounded-lg p-5">
                  <div className="text-white text-sm">{t}</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    12 members · 4 projects
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: "kanban",
          label: "Kanban",
          render: () => (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {["Backlog", "In Progress", "Review", "Done"].map((col) => (
                <div key={col} className="bento-card rounded-lg p-4">
                  <div className="text-[10px] font-mono uppercase text-muted-foreground mb-3">
                    {col}
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="border border-border rounded p-3 text-xs text-white hover:bg-secondary/40"
                      >
                        Task {col.slice(0, 3).toUpperCase()}-{i}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: "an",
          label: "Analytics",
          render: () => (
            <Card title="Velocity">
              <BarChart
                data={Array.from({ length: 8 }, (_, i) => ({
                  label: `S${i + 1}`,
                  value: 20 + Math.random() * 40,
                }))}
              />
            </Card>
          ),
        },
      ]}
    />
  );
}
