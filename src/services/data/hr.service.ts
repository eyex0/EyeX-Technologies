import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Employee = Database["public"]["Tables"]["hr_employees"]["Row"];
type EmployeeInsert = Database["public"]["Tables"]["hr_employees"]["Insert"];
type EmployeeUpdate = Database["public"]["Tables"]["hr_employees"]["Update"];
type Department = Database["public"]["Tables"]["hr_departments"]["Row"];
type DepartmentInsert = Database["public"]["Tables"]["hr_departments"]["Insert"];
type Payroll = Database["public"]["Tables"]["hr_payroll"]["Row"];
type PayrollInsert = Database["public"]["Tables"]["hr_payroll"]["Insert"];

export interface HrSummary {
  totalEmployees: number;
  activeEmployees: number;
  averageSalary: number;
  totalPayrollCost: number;
  departmentDistribution: { department: string; count: number }[];
}

export const HrService = {
  async getEmployees(organizationId?: string): Promise<Employee[]> {
    let query = supabase
      .from("hr_employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getEmployee(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("hr_employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createEmployee(employee: EmployeeInsert): Promise<Employee> {
    const { data, error } = await supabase
      .from("hr_employees")
      .insert(employee)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEmployee(id: string, updates: EmployeeUpdate): Promise<Employee> {
    const { data, error } = await supabase
      .from("hr_employees")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from("hr_employees")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getDepartments(organizationId?: string): Promise<Department[]> {
    let query = supabase
      .from("hr_departments")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createDepartment(department: DepartmentInsert): Promise<Department> {
    const { data, error } = await supabase
      .from("hr_departments")
      .insert(department)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPayroll(organizationId?: string): Promise<Payroll[]> {
    let query = supabase
      .from("hr_payroll")
      .select("*")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async createPayroll(payroll: PayrollInsert): Promise<Payroll> {
    const { data, error } = await supabase
      .from("hr_payroll")
      .insert(payroll)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSummary(organizationId?: string): Promise<HrSummary> {
    const employees = await this.getEmployees(organizationId);
    const departments = await this.getDepartments(organizationId);
    const payroll = await this.getPayroll(organizationId);

    const activeEmployees = employees.filter((e) => e.status === "active");
    const totalSalary = employees.reduce((sum, e) => sum + Number(e.salary), 0);
    const averageSalary = employees.length > 0 ? totalSalary / employees.length : 0;

    const totalPayrollCost = payroll.reduce(
      (sum, p) => sum + Number(p.salary) + Number(p.bonuses) - Number(p.deductions),
      0
    );

    const deptMap = new Map<string, number>();
    for (const dept of departments) {
      deptMap.set(dept.name, 0);
    }
    for (const emp of activeEmployees) {
      if (emp.department_id) {
        const dept = departments.find((d) => d.id === emp.department_id);
        if (dept) {
          deptMap.set(dept.name, (deptMap.get(dept.name) || 0) + 1);
        }
      }
    }

    const departmentDistribution = Array.from(deptMap.entries()).map(
      ([department, count]) => ({ department, count })
    );

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      averageSalary,
      totalPayrollCost,
      departmentDistribution,
    };
  },
};
