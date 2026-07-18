import { useQuery } from "@tanstack/react-query";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge } from "@/components/common/primitives";
import { CrmService } from "@/services/data";
import { Calendar } from "lucide-react";

const SKELETON = <div className="h-4 w-full animate-pulse rounded bg-[#1A1A1C]" />;

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-[#A1A1AA]">No data available</p>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function CrmPage() {
  const summary = useQuery({
    queryKey: ["crm-summary"],
    queryFn: () => CrmService.getSummary(),
  });

  const customers = useQuery({
    queryKey: ["crm-customers"],
    queryFn: () => CrmService.getCustomers(),
  });

  const leads = useQuery({
    queryKey: ["crm-leads"],
    queryFn: () => CrmService.getLeads(),
  });

  const deals = useQuery({
    queryKey: ["crm-deals"],
    queryFn: () => CrmService.getDeals(),
  });

  const activities = useQuery({
    queryKey: ["crm-activities"],
    queryFn: () => CrmService.getActivities(),
  });

  const s = summary.data;

  const customerRows = (customers.data ?? []).map((c) => ({
    name: c.name,
    email: c.email ?? "—",
    company: c.company ?? "—",
    lifetime_value: formatCurrency(c.lifetime_value ?? 0),
    status: c.status ?? "active",
  }));

  const leadRows = (leads.data ?? []).map((l) => ({
    name: l.name,
    email: l.email ?? "—",
    source: l.source ?? "—",
    status: l.status ?? "new",
  }));

  const dealRows = (deals.data ?? []).map((d) => ({
    name: d.name,
    stage: d.stage ?? "new",
    value: formatCurrency(d.value ?? 0),
    probability: `${d.probability ?? 0}%`,
    close_date: formatDate(d.close_date),
  }));

  const dealsByStage = (deals.data ?? []).reduce<Record<string, typeof dealRows>>((acc, d) => {
    const stage = d.stage ?? "new";
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push({
      name: d.name,
      stage,
      value: formatCurrency(d.value ?? 0),
      probability: `${d.probability ?? 0}%`,
      close_date: formatDate(d.close_date),
    });
    return acc;
  }, {});

  const statusTone = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active" || s === "vip" || s === "closed_won" || s === "qualified" || s === "completed") return "success";
    if (s === "new" || s === "prospect" || s === "lead" || s === "demo") return "info";
    return "warn";
  };

  return <ModulePage title="CRM" subtitle="Customers · Deals · Pipeline" tabs={[
    { key: "customers", label: "Customers", render: () => (
      <>
        <KpiRow items={[
          { label: "Customers", value: summary.isLoading ? "—" : String(s?.totalCustomers ?? 0), delta: `${s?.activeCustomers ?? 0} active`, icon: "groups" },
          { label: "Active", value: summary.isLoading ? "—" : String(s?.activeCustomers ?? 0), icon: "check_circle" },
          { label: "Pipeline", value: summary.isLoading ? "—" : formatCurrency(s?.pipelineValue ?? 0), icon: "trending_up" },
          { label: "Conversion", value: summary.isLoading ? "—" : `${(s?.conversionRate ?? 0).toFixed(1)}%`, icon: "emoji_events" },
        ]}/>
        {customers.isLoading ? (
          <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
        ) : customerRows.length === 0 ? <EmptyState /> : (
          <TableCard title="All customers" columns={[
            { key: "name", label: "Customer" },{ key: "email", label: "Email" },{ key: "company", label: "Company" },
            { key: "lifetime_value", label: "LTV", align: "right" },
            { key: "status", label: "Status", render: (r: typeof customerRows[number]) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
          ]} rows={customerRows} />
        )}
      </>
    )},
    { key: "companies", label: "Companies", render: () => (
      customers.isLoading ? (
        <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
      ) : customerRows.length === 0 ? <EmptyState /> : (
        <TableCard title="Companies" columns={[
          { key: "name", label: "Company" },{ key: "company", label: "Industry" },{ key: "email", label: "Primary" },{ key: "lifetime_value", label: "ACV", align: "right" },
        ]} rows={customerRows} />
      )
    )},
    { key: "leads", label: "Leads", render: () => (
      leads.isLoading ? (
        <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
      ) : leadRows.length === 0 ? <EmptyState /> : (
        <TableCard title="Leads" columns={[
          { key: "name", label: "Lead" },{ key: "email", label: "Email" },{ key: "source", label: "Source" },
          { key: "status", label: "Status", render: (r: typeof leadRows[number]) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
        ]} rows={leadRows} />
      )
    )},
    { key: "deals", label: "Deals", render: () => (
      deals.isLoading ? (
        <div className="space-y-3 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)}</div>
      ) : dealRows.length === 0 ? <EmptyState /> : (
        <TableCard title="Deals" columns={[
          { key: "name", label: "Deal" },{ key: "stage", label: "Stage" },{ key: "value", label: "Value" },{ key: "probability", label: "Probability" },{ key: "close_date", label: "Close", align: "right" },
        ]} rows={dealRows} />
      )
    )},
    { key: "pipeline", label: "Pipeline", render: () => (
      deals.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="bento-card rounded-lg p-4 space-y-3">{Array.from({ length: 3 }).map((_, j) => <div key={j}>{SKELETON}</div>)}</div>)}</div>
      ) : Object.keys(dealsByStage).length === 0 ? <EmptyState /> : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {["new", "qualified", "proposal", "negotiation"].map((stage) => (
            <div key={stage} className="bento-card rounded-lg p-4">
              <div className="text-[10px] font-mono uppercase text-muted-foreground mb-3">{stage}</div>
              <div className="space-y-2">
                {(dealsByStage[stage] ?? []).map((d) => (
                  <div key={d.name+stage} className="border border-border rounded p-3 hover:bg-secondary/40">
                    <div className="text-xs text-white">{d.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">{d.value} · {d.close_date}</div>
                  </div>
                ))}
                {(!dealsByStage[stage] || dealsByStage[stage].length === 0) && (
                  <p className="text-[10px] text-[#A1A1AA]">No deals</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    )},
    { key: "activities", label: "Activities", render: () => (
      <Card title="Recent activities" icon="history">
        <div className="p-5 space-y-3">
          {activities.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i}>{SKELETON}</div>)
          ) : (activities.data ?? []).length === 0 ? (
            <EmptyState />
          ) : (
            (activities.data ?? []).slice(0, 10).map((a) => (
              <div key={a.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
                <Calendar className="h-[18px] w-[18px] text-muted-foreground" />
                <div className="flex-1 text-sm text-white">
                  <span className="font-mono text-[10px] text-muted-foreground mr-2">{a.type?.toUpperCase()}</span>
                  {a.subject}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    )},
  ]}/>;
}
