import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TBody, Td, Th, THead, Tr } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, FileSpreadsheet, Trash2, Save, Loader2, AlertCircle, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ColumnInfo {
  name: string
  type: 'string' | 'number' | 'date' | 'boolean'
  sample: any[]
  nullable: boolean
}

interface Dataset {
  id: string
  name: string
  original_filename: string | null
  columns: any[]
  rows: any[]
  row_count: number
  status: string
  mapped_table: string | null
  created_at: string
}

interface Mapping {
  id: string
  name: string
  source_columns: any[]
  target_table: string
  column_mapping: Record<string, string>
  transform_rules: Record<string, any>
  dataset_id?: string
  created_at: string
}

const TARGET_TABLES = [
  { value: 'finance_invoices', label: 'Finance: Invoices' },
  { value: 'finance_budgets', label: 'Finance: Budgets' },
  { value: 'finance_transactions', label: 'Finance: Transactions' },
  { value: 'crm_customers', label: 'CRM: Customers' },
  { value: 'crm_leads', label: 'CRM: Leads' },
  { value: 'crm_deals', label: 'CRM: Deals' },
  { value: 'crm_activities', label: 'CRM: Activities' },
  { value: 'sales_orders', label: 'Sales: Orders' },
  { value: 'sales_products', label: 'Sales: Products' },
  { value: 'hr_employees', label: 'HR: Employees' },
  { value: 'hr_departments', label: 'HR: Departments' },
  { value: 'hr_payroll', label: 'HR: Payroll' },
  { value: 'projects_projects', label: 'Projects: Projects' },
  { value: 'projects_tasks', label: 'Projects: Tasks' },
  { value: 'inventory_products', label: 'Inventory: Products' },
  { value: 'inventory_warehouses', label: 'Inventory: Warehouses' },
  { value: 'inventory_suppliers', label: 'Inventory: Suppliers' },
  { value: 'documents', label: 'Documents' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'dashboards', label: 'Dashboards' },
  { value: 'data_sources', label: 'Data Sources' },
  { value: 'imported_datasets', label: 'Imported Datasets (raw)' },
]

function detectType(values: any[]): 'string' | 'number' | 'date' | 'boolean' {
  const nonNull = values.filter(v => v != null && v !== '')
  if (nonNull.length === 0) return 'string'
  
  const numCount = nonNull.filter(v => !isNaN(Number(v)) && v !== '').length
  const dateCount = nonNull.filter(v => !isNaN(Date.parse(String(v)))).length
  const boolCount = nonNull.filter(v => String(v).toLowerCase() === 'true' || String(v).toLowerCase() === 'false' || v === true || v === false).length
  
  if (boolCount / nonNull.length > 0.8) return 'boolean'
  if (dateCount / nonNull.length > 0.6) return 'date'
  if (numCount / nonNull.length > 0.8) return 'number'
  return 'string'
}

export function DataImportPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'datasets' | 'mappings'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ headers: string[]; rows: any[][]; columns: ColumnInfo[] } | null>(null)
  const [datasetName, setDatasetName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [ds, mp] = await Promise.all([db.getDatasets(), db.getMappings()])
    setDatasets(ds)
    setMappings(mp)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setError(null)
    parseFile(f)
  }

  const parseFile = async (f: File) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null })
          
          if (json.length === 0) {
            setError('File is empty')
            resolve()
            return
          }

          const headers = json[0] as string[]
          const rows = json.slice(1) as any[][]
          
          const columns: ColumnInfo[] = headers.map((h, i) => {
            const colValues = rows.map(r => r[i])
            return {
              name: h || `Column ${i + 1}`,
              type: detectType(colValues),
              sample: colValues.slice(0, 5),
              nullable: colValues.some(v => v == null || v === '')
            }
          })

          setPreview({ headers, rows, columns })
          if (!datasetName) setDatasetName(f.name.replace(/\.[^/.]+$/, ''))
        } catch (err) {
          setError('Failed to parse file: ' + (err as Error).message)
        }
        resolve()
      }
      reader.readAsArrayBuffer(f)
    })
  }

  const saveDataset = async () => {
    if (!preview || !datasetName.trim()) {
      setError('Enter a dataset name')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const dataset = await db.createDataset({
        name: datasetName,
        original_filename: file?.name,
        columns: preview.columns,
        rows: preview.rows,
        row_count: preview.rows.length,
        status: 'draft',
      })
      if (dataset) {
        setDatasets([dataset, ...datasets])
        setActiveTab('datasets')
        setFile(null)
        setPreview(null)
        setDatasetName('')
      }
    } catch (err) {
      setError('Failed to save dataset')
    }
    setSaving(false)
  }

  const deleteDataset = async (id: string) => {
    await db.deleteDataset(id)
    setDatasets(datasets.filter(d => d.id !== id))
  }

  const renderTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      string: 'bg-gray-100 text-gray-700',
      number: 'bg-blue-100 text-blue-700',
      date: 'bg-green-100 text-green-700',
      boolean: 'bg-purple-100 text-purple-700',
    }
    return <Badge className={colors[type] || colors.string} variant="default">{type}</Badge>
  }

  const renderStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'> = {
      draft: 'default',
      mapped: 'success',
      imported: 'info',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Import</h1>
        <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as any)} className="hidden sm:flex">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="mappings">Mappings</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* UPLOAD TAB */}
      {activeTab === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Upload Excel / CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileSpreadsheet className="h-12 w-12 text-green-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">Drag & drop Excel or CSV file, or click to browse</p>
                  <p className="text-sm text-gray-500">Supports .xlsx, .xls, .csv</p>
                </div>
              )}
            </div>

            {preview && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="Dataset name"
                    className="w-64"
                  />
                  <Button onClick={saveDataset} disabled={saving} className="ml-2">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Dataset'}
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <THead>
                      <Tr>
                        {preview.headers.map((h, i) => (
                          <Th key={i} className="w-40">
                            <div className="flex items-center gap-1">
                              <span>{h || `Column ${i + 1}`}</span>
                              {preview.columns[i] && renderTypeBadge(preview.columns[i].type)}
                            </div>
                          </Th>
                        ))}
                      </Tr>
                    </THead>
                    <TBody>
                      {preview.rows.slice(0, 10).map((row, ri) => (
                        <Tr key={ri}>
                          {row.map((cell, ci) => (
                            <Td key={ci} className="text-sm max-w-40 truncate">
                              {cell ?? <span className="text-gray-400">—</span>}
                            </Td>
                          ))}
                        </Tr>
                      ))}
                    </TBody>
                  </Table>
                </div>
                {preview.rows.length > 10 && (
                  <p className="text-sm text-gray-500">Showing 10 of {preview.rows.length} rows</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* DATASETS TAB */}
      {activeTab === 'datasets' && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            {datasets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No datasets saved yet. Upload a file to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {datasets.map(ds => (
                  <div key={ds.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{ds.name}</p>
                        <p className="text-sm text-gray-500">
                          {ds.row_count} rows • {ds.columns?.length || 0} columns • {new Date(ds.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(ds.status)}
                      <Button variant="ghost" size="icon" disabled>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteDataset(ds.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MAPPINGS TAB */}
      {activeTab === 'mappings' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Source Dataset</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dataset" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasets.map(ds => (
                        <SelectItem key={ds.id} value={ds.id}>{ds.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Table</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_TABLES.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">Column mapping UI would go here. Select a dataset and target table to configure field mappings.</p>
            </CardContent>
          </Card>

          {mappings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Mappings</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Source</Th>
                      <Th>Target Table</Th>
                      <Th>Created</Th>
                      <Th></Th>
                    </Tr>
                  </THead>
                  <TBody>
                    {mappings.map(m => (
                      <Tr key={m.id}>
                        <Td className="font-medium">{m.name}</Td>
                        <Td>{m.dataset_id || '—'}</Td>
                        <Td>{m.target_table}</Td>
                        <Td>{new Date(m.created_at).toLocaleDateString()}</Td>
                        <Td>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}