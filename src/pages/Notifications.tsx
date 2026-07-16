import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function NotificationsPage() {
  return (
    <AppShell title="Notifications" subtitle="Alerts & activity">
      <Card title="Recent" icon="notifications">
        <div className="p-2">
          {m.notifications.map((n, i) => (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-3 border-b border-border last:border-0 hover:bg-secondary/40 rounded"
            >
              <div className="mt-0.5">
                <Badge tone={n.tone}>·</Badge>
              </div>
              <div className="flex-1">
                <div className="text-sm text-white">{n.title}</div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                  {n.meta}
                </div>
              </div>
              <button className="text-[10px] font-mono uppercase text-muted-foreground hover:text-white">
                Dismiss
              </button>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
