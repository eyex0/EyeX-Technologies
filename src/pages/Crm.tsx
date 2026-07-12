import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function CrmPage() {
  return <ModulePage title="CRM" subtitle="Customers · Deals · Pipeline" tabs={[
    { key: "customers", label: "Customers", render: () => (
      <>
        <KpiRow items={[
          { label: "Customers", value: "8,412", delta: "+184", icon: "groups" },
          { label: "Active", value: "7,912", delta: "+2.1%", icon: "check_circle" },
          { label: "Churn Risk", value: "142", delta: "+12", icon: "warning" },
          { label: "LTV", value: "$18.4K", delta: "+3.4%", icon: "diamond" },
        ]}/>
        <TableCard title="All customers" columns={[
          { key: "name", label: "Customer" },{ key: "contact", label: "Contact" },{ key: "industry", label: "Industry" },
          { key: "value", label: "Value", align: "right" },
          { key: "status", label: "Status", render: (r:any) => <Badge tone={r.status==="Active"?"success":r.status==="Prospect"?"info":"warn"}>{r.status}</Badge> },
        ]} rows={m.customers} />
      </>
    )},
    { key: "companies", label: "Companies", render: () => (
      <TableCard title="Companies" columns={[
        { key: "name", label: "Company" },{ key: "industry", label: "Industry" },{ key: "contact", label: "Primary" },{ key: "value", label: "ACV", align: "right" },
      ]} rows={m.customers} />
    )},
    { key: "leads", label: "Leads", render: () => (
      <TableCard title="Leads" columns={[
        { key: "name", label: "Lead" },{ key: "owner", label: "Owner" },{ key: "stage", label: "Stage" },
        { key: "score", label: "Score", render: (r:any) => <Badge tone={r.score>80?"success":r.score>60?"info":"warn"}>{r.score}</Badge> },
        { key: "value", label: "Value", align: "right" },
      ]} rows={m.leads} />
    )},
    { key: "deals", label: "Deals", render: () => (
      <TableCard title="Deals" columns={[
        { key: "name", label: "Deal" },{ key: "stage", label: "Stage" },{ key: "value", label: "Value" },{ key: "prob", label: "Probability" },{ key: "close", label: "Close", align: "right" },
      ]} rows={m.deals} />
    )},
    { key: "pipeline", label: "Pipeline", render: () => (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["New","Qualified","Proposal","Negotiation"].map((stage, i) => (
          <div key={stage} className="bento-card rounded-lg p-4">
            <div className="text-[10px] font-mono uppercase text-muted-foreground mb-3">{stage}</div>
            <div className="space-y-2">
              {m.deals.slice(0,2+i%3).map((d) => (
                <div key={d.name+stage} className="border border-border rounded p-3 hover:bg-secondary/40">
                  <div className="text-xs text-white">{d.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-1">{d.value} · {d.close}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )},
    { key: "activities", label: "Activities", render: () => (
      <Card title="Recent activities" icon="history">
        <div className="p-5 space-y-3">
          {["Call with Sarah Chen (Acme)","Sent proposal to Adventure Works","Demo scheduled — Contoso","Email opened by Wayne Enterprises","Meeting notes: Globex QBR"].map((a,i) => (
            <div key={a} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">event</span>
              <div className="flex-1 text-sm text-white">{a}</div>
              <span className="text-[10px] font-mono text-muted-foreground">{i+1}h ago</span>
            </div>
          ))}
        </div>
      </Card>
    )},
  ]}/>;
}

