import { useState, type ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Kpi,
  Card,
  DataTable,
  Tabs,
  Badge,
  BarChart,
  Sparkline,
} from "@/components/common/primitives";
import * as mock from "@/lib/mock";
import { useQuery } from "@tanstack/react-query";
import { DatabaseService } from "@/services/database.service";
import { DynamicDashboard } from "@/components/dashboard/DynamicDashboard";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0, filter: "blur(8px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 16,
    },
  },
};

export function DashboardPage() {
  const { data: dashboards, isLoading: dashboardsLoading } = useQuery({
    queryKey: ["dashboards"],
    queryFn: () => DatabaseService.getDashboards(),
  });

  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);

  const selectedDashboard = dashboards?.find((d) => d.id === selectedDashboardId);

  return (
    <AppShell title="Dashboard" subtitle="Status: Synchronized">
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dynamic Dashboard View if selected */}
        {selectedDashboard ? (
          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-display text-white">{selectedDashboard.title}</h2>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">
                  Generated Dynamic OS Workspace
                </p>
              </div>
              <button
                onClick={() => setSelectedDashboardId(null)}
                className="text-xs text-muted-foreground hover:text-white border border-border px-3 py-1.5 rounded hover:bg-secondary/40 transition cursor-pointer"
              >
                Back to Default Overview
              </button>
            </div>
            <DynamicDashboard config={selectedDashboard.layout as any} />
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Kpi label="Revenue (MTD)" value="$4.82M" delta="+12.4%" icon="payments" />
              </motion.div>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Kpi label="Profit Margin" value="28.6%" delta="+2.1%" icon="trending_up" />
              </motion.div>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Kpi label="Customers" value="8,412" delta="+184" icon="groups" />
              </motion.div>
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Kpi label="Growth (YoY)" value="34%" delta="+4.8%" icon="rocket_launch" />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Revenue trend — 12w" icon="show_chart" className="lg:col-span-2">
                <div className="p-5">
                  <BarChart
                    data={[
                      { label: "W1", value: 32 },
                      { label: "W2", value: 41 },
                      { label: "W3", value: 38 },
                      { label: "W4", value: 52 },
                      { label: "W5", value: 47 },
                      { label: "W6", value: 61 },
                      { label: "W7", value: 58 },
                      { label: "W8", value: 72 },
                      { label: "W9", value: 68 },
                      { label: "W10", value: 84 },
                      { label: "W11", value: 79 },
                      { label: "W12", value: 92 },
                    ]}
                  />
                </div>
              </Card>
              <Card title="AI Insights" icon="auto_awesome">
                <div className="p-5 space-y-4">
                  <Insight
                    tone="success"
                    title="Revenue accelerating"
                    body="MoM growth up 4.8pp. Enterprise expansion is the primary driver."
                  />
                  <Insight
                    tone="warn"
                    title="Churn risk cluster"
                    body="3 SaaS accounts showing usage decline > 30% this week."
                  />
                  <Insight
                    tone="info"
                    title="Forecast"
                    body="Q4 tracking to $14.2M — 7% above plan."
                  />
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="Recent Activity" icon="history" className="lg:col-span-2">
                <ActivityFeed />
              </Card>
              <Card title="Quick Actions" icon="bolt">
                <div className="p-5 grid grid-cols-2 gap-2">
                  {[
                    "Deploy Agent",
                    "New Report",
                    "Import Data",
                    "Invite User",
                    "Run Forecast",
                    "Open Copilot",
                  ].map((a) => (
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.03)" }}
                      whileTap={{ scale: 0.98 }}
                      key={a}
                      className="bento-card rounded-md px-3 py-3 text-xs text-white text-left cursor-pointer border border-white/[0.04]"
                    >
                      {a}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </>
        )}

        {/* Dashboard Gallery selection list */}
        {dashboards && dashboards.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card title="Generated AI Workspaces" icon="dashboard">
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboards.map((db) => (
                  <motion.button
                    whileHover={{ y: -2, scale: 1.01, borderColor: "rgba(56, 189, 248, 0.4)" }}
                    whileTap={{ scale: 0.99 }}
                    key={db.id}
                    onClick={() => setSelectedDashboardId(db.id)}
                    className={`bento-card rounded-lg p-5 flex flex-col gap-2 items-start text-left hover:bg-secondary/20 transition-all cursor-pointer ${
                      selectedDashboardId === db.id
                        ? "border border-primary bg-primary/5"
                        : "border border-border"
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-[20px]">
                      space_dashboard
                    </span>
                    <span className="text-sm text-white font-medium">{db.title}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      Created {new Date(db.created_at || "").toLocaleDateString()}
                    </span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Pinned Dashboards" icon="push_pin">
            <div className="p-5 space-y-3">
              {["Sales — Executive", "Finance — P&L", "Marketing — ROAS", "Ops — SLA"].map(
                (d, i) => (
                  <div
                    key={d}
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <div className="text-sm text-white">{d}</div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase">
                        Owner · Live
                      </div>
                    </div>
                    <Sparkline points={[10 + i, 14, 12, 20, 18, 26, 24, 32, 30, 40]} positive />
                  </div>
                ),
              )}
            </div>
          </Card>
          <Card title="Recent Reports" icon="description">
            <DataTable
              columns={[
                { key: "name", label: "Report" },
                { key: "cat", label: "Category" },
                { key: "updated", label: "Updated", align: "right" },
              ]}
              rows={mock.reportsList.slice(0, 5)}
            />
          </Card>
        </div>

        <Card title="AI Copilot" icon="auto_awesome">
          <div className="p-5">
            <div className="text-sm text-white mb-3">Ask anything about your business.</div>
            <div className="flex gap-2 flex-wrap mb-4">
              {[
                "Why did revenue drop?",
                "Forecast next month",
                "Compare MoM",
                "Show customer growth",
              ].map((p) => (
                <button
                  key={p}
                  className="text-[11px] px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-secondary/40"
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 border border-border rounded-md px-4 py-3 bg-background">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                chat
              </span>
              <input
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground"
                placeholder="Ask Copilot..."
              />
              <button className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">
                Send
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AppShell>
  );
}

function Insight({
  tone,
  title,
  body,
}: {
  tone: "success" | "warn" | "info" | "danger";
  title: string;
  body: string;
}) {
  const dot: Record<string, string> = {
    success: "bg-emerald-400",
    warn: "bg-amber-400",
    info: "bg-sky-400",
    danger: "bg-rose-400",
  };
  return (
    <div className="flex gap-3">
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${dot[tone]}`} />
      <div>
        <div className="text-sm text-white">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{body}</div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const rows = [
    {
      agent: "DataExtractor-v2",
      status: "Success",
      action: "Processed 14 RAG chunks",
      time: "10:42:15",
    },
    {
      agent: "SupportBot_Prod",
      status: "Running",
      action: "Handling ticket #4821",
      time: "10:41:58",
    },
    {
      agent: "CodeReviewer_Alpha",
      status: "Success",
      action: "Generated PR summary",
      time: "10:41:03",
    },
    { agent: "ForecastEngine", status: "Success", action: "Refreshed Q4 model", time: "10:38:12" },
    {
      agent: "BillingSync",
      status: "Warning",
      action: "Retrying Stripe webhook",
      time: "10:35:41",
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        <div className="col-span-3">Agent</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-4">Action</div>
        <div className="col-span-3 text-right">Timestamp</div>
      </div>
      {rows.map((r) => (
        <div
          key={r.time}
          className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border items-center hover:bg-secondary/40"
        >
          <div className="col-span-3 text-white text-xs flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            {r.agent}
          </div>
          <div className="col-span-2">
            <Badge
              tone={r.status === "Success" ? "success" : r.status === "Warning" ? "warn" : "info"}
            >
              {r.status}
            </Badge>
          </div>
          <div className="col-span-4 text-xs text-muted-foreground truncate">{r.action}</div>
          <div className="col-span-3 text-right font-mono text-[11px] text-muted-foreground">
            {r.time}Z
          </div>
        </div>
      ))}
    </div>
  );
}
