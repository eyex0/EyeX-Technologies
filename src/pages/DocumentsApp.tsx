import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function DocumentsAppPage() {
  const [tag, setTag] = useState("All");
  const tags = ["All", "Contract", "Invoice", "Report", "Policy"];
  const rows = tag === "All" ? m.documents : m.documents.filter((d) => d.type === tag);
  return (
    <AppShell title="Documents" subtitle="Contracts · Invoices · Reports · Policies">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card title="Folders" icon="folder">
            <div className="p-4 space-y-1 text-xs">
              {[
                "All Documents",
                "Contracts",
                "Invoices",
                "Reports",
                "Policies",
                "Shared with me",
                "Trash",
              ].map((f) => (
                <div
                  key={f}
                  className="px-3 py-2 rounded hover:bg-secondary/40 text-white cursor-pointer"
                >
                  {f}
                </div>
              ))}
            </div>
          </Card>
          <Card title="Tags" icon="sell">
            <div className="p-4 flex flex-wrap gap-2">
              {["Signed", "Draft", "Final", "Review", "Paid"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-background flex-1">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                search
              </span>
              <input
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground"
                placeholder="Search documents..."
              />
            </div>
            <div className="flex gap-1">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`text-xs px-3 py-1.5 rounded-md border ${tag === t ? "bg-white text-black border-white" : "border-border text-muted-foreground hover:text-white"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Card title="Files" icon="description">
            <DataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "owner", label: "Owner" },
                { key: "tag", label: "Tag", render: (r: any) => <Badge>{r.tag}</Badge> },
                { key: "updated", label: "Updated", align: "right" },
              ]}
              rows={rows}
            />
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
