import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function HrPage() {
  return <ModulePage title="HR" subtitle="People · Payroll · Performance" tabs={[
    { key: "emp", label: "Employees", render: () => (
      <>
        <KpiRow items={[
          { label: "Headcount", value: "184", delta: "+6", icon: "groups" },
          { label: "Retention", value: "94%", delta: "+1.2%", icon: "workspace_premium" },
          { label: "Open roles", value: "12", icon: "work" },
          { label: "eNPS", value: "62", delta: "+4", icon: "sentiment_satisfied" },
        ]}/>
        <TableCard title="All employees" columns={[
          { key: "name", label: "Name" },{ key: "role", label: "Role" },{ key: "dept", label: "Department" },{ key: "location", label: "Location" },
          { key: "status", label: "Status", render: (r:any) => <Badge tone={r.status==="Active"?"success":"warn"}>{r.status}</Badge> },
        ]} rows={m.employees}/>
      </>
    )},
    { key: "att", label: "Attendance", render: () => (
      <Card title="Attendance — this week"><BarChart data={["Mon","Tue","Wed","Thu","Fri"].map((l)=>({label:l,value:170+Math.random()*14}))}/></Card>
    )},
    { key: "pay", label: "Payroll", render: () => (
      <TableCard title="Payroll runs" columns={[
        { key: "period", label: "Period" },{ key: "total", label: "Total" },{ key: "employees", label: "Employees" },{ key: "status", label: "Status", align: "right" },
      ]} rows={[
        { period: "Nov 2025", total: "$1.28M", employees: 184, status: "Processed" },
        { period: "Oct 2025", total: "$1.24M", employees: 182, status: "Processed" },
        { period: "Sep 2025", total: "$1.19M", employees: 178, status: "Processed" },
      ]}/>
    )},
    { key: "leave", label: "Leave", render: () => (
      <TableCard title="Leave requests" columns={[
        { key: "name", label: "Employee" },{ key: "type", label: "Type" },{ key: "days", label: "Days" },{ key: "status", label: "Status", align: "right" },
      ]} rows={[
        { name: "Marco Silva", type: "PTO", days: 5, status: "Approved" },
        { name: "James Park", type: "Sick", days: 1, status: "Approved" },
        { name: "Priya Rao", type: "PTO", days: 3, status: "Pending" },
      ]}/>
    )},
    { key: "perf", label: "Performance", render: () => (
      <Card title="Review cycles">
        <div className="p-5 space-y-3">
          {["Q4 2025 — In Progress (72% complete)","Q3 2025 — Complete","Q2 2025 — Complete"].map((r) => (
            <div key={r} className="text-sm text-white border-b border-border pb-3 last:border-0">{r}</div>
          ))}
        </div>
      </Card>
    )},
    { key: "rec", label: "Recruitment", render: () => (
      <TableCard title="Open roles" columns={[
        { key: "role", label: "Role" },{ key: "dept", label: "Dept" },{ key: "applicants", label: "Applicants" },{ key: "stage", label: "Stage", align: "right" },
      ]} rows={[
        { role: "Sr. ML Engineer", dept: "Engineering", applicants: 42, stage: "Interviewing" },
        { role: "Product Designer", dept: "Design", applicants: 84, stage: "Screening" },
        { role: "Enterprise AE", dept: "Sales", applicants: 21, stage: "Offer" },
      ]}/>
    )},
  ]}/>;
}

