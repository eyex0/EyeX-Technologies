import { useEffect, useState } from "react";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, Badge, BarChart } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";

export function HrPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      DatabaseService.getEmployees(),
      DatabaseService.getDepartments(),
    ]).then(([emp, dept]) => {
      setEmployees(emp);
      setDepartments(dept);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const activeEmployees = employees.filter(e => e.status === "active").length;
  const totalPayroll = employees.reduce((s, e) => s + Number(e.salary || 0), 0);

  return (
    <ModulePage
      title="HR"
      subtitle="People · Payroll · Performance"
      tabs={[
        {
          key: "emp",
          label: "Employees",
          render: () => (
            <>
              <KpiRow
                items={[
                  { label: "Headcount", value: employees.length.toString(), delta: `+${employees.length}`, icon: "groups" },
                  { label: "Active", value: activeEmployees.toString(), icon: "check_circle" },
                  { label: "Departments", value: departments.length.toString(), icon: "business" },
                  { label: "Payroll", value: `$${(totalPayroll / 1000).toFixed(0)}K`, icon: "payments" },
                ]}
              />
              <TableCard
                title={`Employees (${employees.length})`}
                columns={[
                  { key: "name", label: "Name" },
                  { key: "position", label: "Position" },
                  { key: "dept_name", label: "Department", render: (r: any) => r.departments?.name || "-" },
                  { key: "email", label: "Email" },
                  { key: "status", label: "Status", render: (r: any) => (
                    <Badge tone={r.status === "active" ? "success" : r.status === "on_leave" ? "warn" : "danger"}>{r.status}</Badge>
                  )},
                ]}
                rows={employees}
              />
            </>
          ),
        },
        {
          key: "departments",
          label: "Departments",
          render: () => (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(departments.length > 0 ? departments : [
                { name: "Engineering", head_count: 42, budget: 1200000 },
                { name: "Sales", head_count: 24, budget: 800000 },
                { name: "Marketing", head_count: 16, budget: 400000 },
                { name: "Operations", head_count: 12, budget: 200000 },
              ]).map((d: any) => (
                <div key={d.name || d.id} className="bento-card rounded-lg p-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-white text-sm">{d.name}</span>
                    <span className="text-muted-foreground text-xs font-mono">{d.head_count} people</span>
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">Budget: ${(d.budget / 1000).toFixed(0)}K</div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: "pay",
          label: "Payroll",
          render: () => (
            <TableCard
              title={`Payroll (${employees.length} employees)`}
              columns={[
                { key: "name", label: "Employee" },
                { key: "position", label: "Position" },
                { key: "salary", label: "Salary", align: "right" },
                { key: "status", label: "Status", render: (r: any) => (
                  <Badge tone={r.status === "active" ? "success" : "warn"}>{r.status}</Badge>
                )},
              ]}
              rows={employees.map(e => ({ ...e, salary: `$${Number(e.salary).toLocaleString()}/yr` }))}
            />
          ),
        },
        {
          key: "att",
          label: "Attendance",
          render: () => (
            <Card title="Attendance overview">
              <BarChart data={["Mon", "Tue", "Wed", "Thu", "Fri"].map((l) => ({ label: l, value: Math.round(activeEmployees * 0.9 + Math.random() * activeEmployees * 0.1) }))} />
            </Card>
          ),
        },
      ]}
    />
  );
}
