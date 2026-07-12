import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function SettingsPage() {
  return <ModulePage title="Settings" subtitle="Workspace & account" tabs={[
    { key: "profile", label: "Profile", render: () => (
      <Card title="Profile">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value="Admin User"/>
          <Field label="Email" value="admin@eyex.io"/>
          <Field label="Role" value="Workspace Admin"/>
          <Field label="Timezone" value="America/Los_Angeles"/>
        </div>
      </Card>
    )},
    { key: "org", label: "Organization", render: () => (
      <Card title="Organization"><div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Company" value="EyeX Technologies"/><Field label="Plan" value="Enterprise"/><Field label="Seats" value="184 of 250"/><Field label="Region" value="US-West"/></div></Card>
    )},
    { key: "users", label: "Users", render: () => (
      <TableCard title="Users" columns={[
        { key: "name", label: "Name" },{ key: "email", label: "Email" },{ key: "role", label: "Role" },{ key: "status", label: "Status", align: "right" },
      ]} rows={m.employees.slice(0,5).map((e) => ({...e, email: e.name.toLowerCase().replace(" ",".")+"@eyex.io"}))}/>
    )},
    { key: "roles", label: "Roles", render: () => (
      <TableCard title="Roles" columns={[
        { key: "role", label: "Role" },{ key: "members", label: "Members" },{ key: "desc", label: "Description", align: "right" },
      ]} rows={[
        { role: "Admin", members: 4, desc: "Full workspace control" },
        { role: "Manager", members: 18, desc: "Team & module management" },
        { role: "Analyst", members: 42, desc: "Read + reports" },
        { role: "Viewer", members: 120, desc: "Read-only" },
      ]}/>
    )},
    { key: "perms", label: "Permissions", render: () => (
      <Card title="Permissions matrix"><div className="p-5 text-sm text-muted-foreground">Configure module-level access per role. Fine-grained record permissions available on the Enterprise plan.</div></Card>
    )},
    { key: "billing", label: "Billing", render: () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Kpi label="Plan" value="Enterprise" icon="workspace_premium"/>
        <Kpi label="MRR" value="$18,400" icon="payments"/>
        <Kpi label="Next invoice" value="Dec 15" icon="event"/>
      </div>
    )},
    { key: "api", label: "API Keys", render: () => (
      <TableCard title="API keys" columns={[
        { key: "name", label: "Name" },{ key: "key", label: "Key" },{ key: "created", label: "Created" },{ key: "status", label: "Status", align: "right" },
      ]} rows={[
        { name: "Production", key: "ex_live_••••8241", created: "Nov 12", status: "Active" },
        { name: "Staging", key: "ex_test_••••2941", created: "Oct 08", status: "Active" },
      ]}/>
    )},
    { key: "notif", label: "Notifications", render: () => (
      <Card title="Preferences"><div className="p-5 space-y-3 text-sm">
        {["Email digests","Slack alerts","Overdue invoices","Deal updates","System status"].map((s) => (
          <div key={s} className="flex justify-between border-b border-border pb-3 last:border-0"><span className="text-white">{s}</span><span className="text-muted-foreground text-xs">On</span></div>
        ))}
      </div></Card>
    )},
    { key: "sec", label: "Security", render: () => (
      <Card title="Security"><div className="p-5 space-y-3 text-sm">
        {["Two-factor authentication","SSO (SAML)","Session timeout","IP allowlist","Audit log"].map((s) => (
          <div key={s} className="flex justify-between border-b border-border pb-3 last:border-0"><span className="text-white">{s}</span><span className="text-muted-foreground text-xs">Configured</span></div>
        ))}
      </div></Card>
    )},
  ]}/>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-1">{label}</div>
      <div className="border border-border rounded-md px-3 py-2 text-sm text-white bg-background">{value}</div>
    </div>
  );
}
