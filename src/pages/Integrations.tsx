import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function IntegrationsPage() {
  return (
    <AppShell title="Integrations" subtitle="Connect your stack">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {m.integrationsCatalog.map((i) => (
          <div key={i.name} className="bento-card rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">{i.icon}</span>
              </div>
              <Badge tone={i.status==="Connected"?"success":"info"}>{i.status}</Badge>
            </div>
            <div>
              <div className="text-white font-medium text-sm">{i.name}</div>
              <div className="text-muted-foreground text-xs mt-1">{i.desc}</div>
            </div>
            <button className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded ${i.status==="Connected"?"border border-border text-white hover:bg-secondary/40":"bg-white text-black"}`}>
              {i.status==="Connected"?"Manage":"Connect"}
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

