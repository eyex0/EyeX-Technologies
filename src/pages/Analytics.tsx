import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="Cross-module intelligence">
      <KpiRow
        items={[
          { label: "Sessions", value: "182K", delta: "+8.4%", icon: "visibility" },
          { label: "Active Users", value: "24.1K", delta: "+3.2%", icon: "person" },
          { label: "Avg Session", value: "6m 42s", delta: "+0.8%", icon: "schedule" },
          { label: "Bounce", value: "31%", delta: "-1.4%", icon: "call_missed" },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Traffic — 12w" className="lg:col-span-2">
          <BarChart
            data={Array.from({ length: 12 }, (_, i) => ({
              label: `W${i + 1}`,
              value: 20 + Math.floor(Math.random() * 80),
            }))}
          />
        </Card>
        <Card title="Top Channels">
          <div className="p-5 space-y-3">
            {[
              ["Organic", "42%"],
              ["Direct", "28%"],
              ["Paid", "18%"],
              ["Referral", "8%"],
              ["Social", "4%"],
            ].map(([n, v]) => (
              <div key={n} className="flex justify-between text-xs">
                <span className="text-white">{n}</span>
                <span className="font-mono text-muted-foreground">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
