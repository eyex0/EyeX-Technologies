import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function ReportsPage() {
  const cats = ["All", "Business", "Financial", "Marketing", "Sales", "HR"];
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? m.reportsList : m.reportsList.filter((r) => r.cat === cat);
  return (
    <AppShell title="Reports" subtitle="Reporting center">
      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-md border ${cat === c ? "bg-white text-black border-white" : "border-border text-muted-foreground hover:text-white"}`}
          >
            {c}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2">
          {["PDF", "Excel", "CSV"].map((f) => (
            <button
              key={f}
              className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border border-border text-white hover:bg-secondary/40"
            >
              Export {f}
            </button>
          ))}
        </div>
      </div>
      <Card title="Available reports" icon="description">
        <DataTable
          columns={
            [
              { key: "name", label: "Report" },
              { key: "cat", label: "Category" },
              { key: "owner", label: "Owner" },
              { key: "updated", label: "Updated", align: "right" },
            ] as any
          }
          rows={filtered}
        />
      </Card>
    </AppShell>
  );
}
