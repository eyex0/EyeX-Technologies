import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, DataTable } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function CrmPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DatabaseService.getCustomers(),
      DatabaseService.getLeads(),
      DatabaseService.getDeals(),
      DatabaseService.getActivities(),
    ])
      .then(([cust, l, d, acts]) => {
        setCustomers(cust);
        setLeads(l);
        setDeals(d);
        setActivities(acts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalValue = deals
    .filter((d) => d.stage !== "closed_lost")
    .reduce((s, d) => s + Number(d.value), 0);
  const pipelineValue = deals
    .filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
    .reduce((s, d) => s + Number(d.value), 0);
  const avgLtv =
    customers.length > 0
      ? customers.reduce((s, c) => s + Number(c.lifetime_value || 0), 0) / customers.length
      : 0;

  return (
    <ModulePage
      title="CRM"
      subtitle="Customers · Deals · Pipeline"
      tabs={[
        {
          key: "customers",
          label: "Customers",
          render: () => (
            <>
              <KpiRow
                items={[
                  {
                    label: "Customers",
                    value: customers.length.toString(),
                    delta: `+${customers.length}`,
                    icon: "groups",
                  },
                  { label: "Active", value: activeCustomers.toString(), icon: "check_circle" },
                  {
                    label: "Pipeline Value",
                    value: `$${(pipelineValue / 1000).toFixed(0)}K`,
                    icon: "trending_up",
                  },
                  { label: "Avg LTV", value: `$${avgLtv.toFixed(0)}`, icon: "diamond" },
                ]}
              />
              <TableCard
                title={`Customers (${customers.length})`}
                columns={[
                  { key: "name", label: "Customer" },
                  { key: "email", label: "Email" },
                  { key: "company", label: "Company" },
                  { key: "lifetime_value", label: "LTV", align: "right" },
                  {
                    key: "status",
                    label: "Status",
                    render: (r: any) => (
                      <Badge
                        tone={
                          r.status === "active" ? "success" : r.status === "lead" ? "info" : "warn"
                        }
                      >
                        {r.status}
                      </Badge>
                    ),
                  },
                ]}
                rows={customers.map((c) => ({
                  ...c,
                  lifetime_value: `$${Number(c.lifetime_value).toLocaleString()}`,
                }))}
              />
            </>
          ),
        },
        {
          key: "leads",
          label: "Leads",
          render: () => (
            <TableCard
              title={`Leads (${leads.length})`}
              columns={[
                { key: "name", label: "Lead" },
                {
                  key: "assigned_to",
                  label: "Owner",
                  render: (r: any) => r.profiles?.full_name || r.assigned_to?.slice(0, 8) || "-",
                },
                {
                  key: "status",
                  label: "Status",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.status === "won"
                          ? "success"
                          : r.status === "lost"
                            ? "danger"
                            : r.status === "qualified"
                              ? "info"
                              : "warn"
                      }
                    >
                      {r.status}
                    </Badge>
                  ),
                },
                {
                  key: "score",
                  label: "Score",
                  render: (r: any) => (
                    <Badge tone={r.score > 80 ? "success" : r.score > 60 ? "info" : "warn"}>
                      {r.score}
                    </Badge>
                  ),
                },
              ]}
              rows={leads}
            />
          ),
        },
        {
          key: "deals",
          label: "Deals",
          render: () => (
            <TableCard
              title={`Deals (${deals.length})`}
              columns={[
                { key: "title", label: "Deal" },
                {
                  key: "stage",
                  label: "Stage",
                  render: (r: any) => (
                    <Badge
                      tone={
                        r.stage === "closed_won"
                          ? "success"
                          : r.stage === "closed_lost"
                            ? "danger"
                            : r.stage === "negotiation"
                              ? "info"
                              : "warn"
                      }
                    >
                      {r.stage}
                    </Badge>
                  ),
                },
                { key: "value", label: "Value", align: "right" },
                { key: "probability", label: "Prob" },
                { key: "expected_close_date", label: "Close", align: "right" },
              ]}
              rows={deals.map((d) => ({
                ...d,
                value: `$${Number(d.value).toLocaleString()}`,
                probability: `${d.probability}%`,
                expected_close_date: d.expected_close_date
                  ? new Date(d.expected_close_date).toLocaleDateString()
                  : "-",
                customers: undefined,
                profiles: undefined,
              }))}
            />
          ),
        },
        {
          key: "pipeline",
          label: "Pipeline",
          render: () => {
            const stages = [
              { key: "qualified", label: "Qualified" },
              { key: "proposal", label: "Proposal" },
              { key: "negotiation", label: "Negotiation" },
              { key: "closed_won", label: "Closed Won" },
            ];
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stages.map((stage) => (
                  <div key={stage.key} className="bento-card rounded-lg p-4">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground mb-3">
                      {stage.label}
                    </div>
                    <div className="space-y-2">
                      {deals
                        .filter((d) => d.stage === stage.key)
                        .slice(0, 5)
                        .map((d) => (
                          <div
                            key={d.id || d.title}
                            className="border border-border rounded p-3 hover:bg-secondary/40"
                          >
                            <div className="text-xs text-white">{d.title}</div>
                            <div className="text-[10px] font-mono text-muted-foreground mt-1">
                              ${Number(d.value).toLocaleString()} · {d.probability}%
                            </div>
                          </div>
                        ))}
                      {deals.filter((d) => d.stage === stage.key).length === 0 && (
                        <div className="text-[10px] text-muted-foreground text-center py-4">
                          No deals
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          },
        },
        {
          key: "activities",
          label: "Activities",
          render: () => (
            <Card title="Recent activities" icon="history">
              <div className="p-5 space-y-3">
                {activities.length > 0 ? (
                  activities.map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 border-b border-border pb-3 last:border-0"
                    >
                      <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                        event
                      </span>
                      <div className="flex-1 text-sm text-white">{a.subject}</div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    {loading
                      ? "Loading..."
                      : "No activities yet. Log calls, emails, or meetings to track engagement."}
                  </div>
                )}
              </div>
            </Card>
          ),
        },
      ]}
    />
  );
}
