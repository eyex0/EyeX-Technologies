import { createClient, type Database } from '../lib/supabase/client';
import { BaseAgent, type AgentContext, type AgentOutput } from '../agents/orchestrator';

interface SchemaInfo {
  tables: Map<string, TableInfo>;
}

interface TableInfo {
  name: string;
  columns: Map<string, ColumnInfo>;
  primaryKeys: string[];
  foreignKeys: ForeignKeyInfo[];
  indexes: IndexInfo[];
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

interface ForeignKeyInfo {
  column: string;
  referencesTable: string;
  referencesColumn: string;
}

interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
}

export class SchemaCache {
  private db = createClient<Database>();
  private cache = new Map<string, { schema: SchemaInfo; expires: number }>();
  private readonly TTL = 10 * 60 * 1000; // 10 minutes

  async getSchema(orgId: string, targetTables?: string[]): Promise<SchemaInfo> {
    const cacheKey = `${orgId}:${targetTables?.join(',') ?? 'all'}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expires > Date.now()) {
      return cached.schema;
    }

    const schema = await this.fetchSchema(orgId, targetTables);
    this.cache.set(cacheKey, { schema, expires: Date.now() + this.TTL });
    return schema;
  }

  private async fetchSchema(orgId: string, targetTables?: string[]): Promise<SchemaInfo> {
    // In production, this would query information_schema
    // For now, return a basic schema based on our migrations
    const tables = new Map<string, TableInfo>();

    // Core tables from migration 001
    const coreTables = [
      'organizations', 'users', 'teams', 'team_members', 'api_keys', 'audit_logs',
      'metrics', 'metric_versions', 'metric_cache',
      'dashboards_v2', 'dashboard_versions', 'dashboard_permissions',
      'alert_rules', 'alert_incidents', 'alert_notifications', 'notification_channels',
      'agent_runs', 'agent_run_steps', 'agent_evaluations', 'model_usage',
      'data_contracts', 'data_sources_v2', 'data_quality_checks', 'data_quality_results',
      'data_incidents', 'data_lineage',
      'imported_datasets', 'import_mappings', 'import_jobs',
      'embedded_dashboards', 'embed_usage',
      'finance_invoices', 'finance_budgets', 'finance_transactions',
      'crm_customers', 'crm_leads', 'crm_deals', 'crm_activities',
      'sales_orders', 'sales_products',
      'hr_employees', 'hr_departments', 'hr_payroll',
      'projects_projects', 'projects_tasks',
      'inventory_products', 'inventory_warehouses', 'inventory_suppliers',
      'documents', 'notifications', 'dashboards', 'data_sources',
    ];

    for (const tableName of coreTables) {
      if (targetTables && !targetTables.includes(tableName)) continue;
      
      tables.set(tableName, await this.getTableInfo(tableName));
    }

    return { tables };
  }

  private async getTableInfo(tableName: string): Promise<TableInfo> {
    // In production, query information_schema.columns, information_schema.table_constraints, etc.
    // For now, return mock data based on our known schema
    const knownColumns: Record<string, Array<{ name: string; type: string; nullable: boolean }>> = {
      organizations: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'name', type: 'text', nullable: false },
        { name: 'slug', type: 'text', nullable: false },
        { name: 'logo_url', type: 'text', nullable: true },
        { name: 'plan', type: 'text', nullable: false },
        { name: 'created_at', type: 'timestamptz', nullable: false },
        { name: 'updated_at', type: 'timestamptz', nullable: false },
      ],
      finance_transactions: [
        { name: 'id', type: 'uuid', nullable: false },
        { name: 'organization_id', type: 'uuid', nullable: false },
        { name: 'type', type: 'text', nullable: false },
        { name: 'category', type: 'text', nullable: false },
        { name: 'amount', type: 'numeric', nullable: false },
        { name: 'description', type: 'text', nullable: true },
        { name: 'transaction_date', type: 'date', nullable: false },
        { name: 'created_at', type: 'timestamptz', nullable: false },
      ],
      // ... other tables
    };

    const columns = new Map<string, ColumnInfo>();
    for (const col of knownColumns[tableName] || []) {
      columns.set(col.name, {
        name: col.name,
        type: col.type,
        nullable: col.nullable,
        default: null,
        isPrimaryKey: col.name === 'id',
        isForeignKey: col.name.endsWith('_id') && col.name !== 'id',
      });
    }

    return {
      name: tableName,
      columns,
      primaryKeys: ['id'],
      foreignKeys: Array.from(columns.values())
        .filter(c => c.isForeignKey)
        .map(c => ({
          column: c.name,
          referencesTable: c.name.replace('_id', ''),
          referencesColumn: 'id',
        })),
      indexes: [],
    };
  }

  invalidate(orgId: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(orgId)) {
        this.cache.delete(key);
      }
    }
  }
}

export function getSchemaCache(): SchemaCache {
  return new SchemaCache();
}