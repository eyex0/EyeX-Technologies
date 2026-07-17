import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'

export function HrPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [payroll, setPayroll] = useState<any[]>([])
  const [tab, setTab] = useState('employees')

  useEffect(() => {
    db.getEmployees().then(setEmployees)
    db.getDepartments().then(setDepartments)
    db.getPayroll().then(setPayroll)
  }, [])

  const totalSalary = employees.reduce((s: number, e: any) => s + Number(e.salary), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">HR</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Employees</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{employees.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Departments</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{departments.length}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Salary</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${totalSalary.toLocaleString()}</div></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        <TabsContent value="employees">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Position</Th><Th>Department</Th><Th>Salary</Th><Th>Status</Th></Tr></THead>
            <TBody>{employees.map((e: any) => {
              const dept = departments.find((d: any) => d.id === e.department_id)
              return (
                <Tr key={e.id}><Td className="font-medium">{e.first_name} {e.last_name}</Td><Td>{e.position}</Td><Td>{dept?.name || '-'}</Td><Td>${Number(e.salary).toLocaleString()}</Td><Td><Badge variant={e.status === 'active' ? 'success' : 'warning'}>{e.status}</Badge></Td></Tr>
              )
            })}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="departments">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Name</Th><Th>Description</Th></Tr></THead>
            <TBody>{departments.map((d: any) => (
              <Tr key={d.id}><Td className="font-medium">{d.name}</Td><Td>{d.description}</Td></Tr>
            ))}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
        <TabsContent value="payroll">
          <Card><CardContent className="p-0"><Table>
            <THead><Tr><Th>Employee</Th><Th>Salary</Th><Th>Bonuses</Th><Th>Deductions</Th><Th>Net</Th><Th>Status</Th></Tr></THead>
            <TBody>{payroll.map((p: any) => {
              const emp = employees.find((e: any) => e.id === p.employee_id)
              return (
                <Tr key={p.id}><Td className="font-medium">{emp ? `${emp.first_name} ${emp.last_name}` : '-'}</Td><Td>${Number(p.salary).toLocaleString()}</Td><Td>${Number(p.bonuses).toLocaleString()}</Td><Td>${Number(p.deductions).toLocaleString()}</Td><Td>${(Number(p.salary) + Number(p.bonuses) - Number(p.deductions)).toLocaleString()}</Td><Td><Badge variant={p.status === 'paid' ? 'success' : 'warning'}>{p.status}</Badge></Td></Tr>
              )
            })}</TBody>
          </Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
