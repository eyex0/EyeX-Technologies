import { createClient, type Database } from '../../src/lib/supabase/client';

interface ValidationResult {
  valid: boolean;
  errors: Array<{ type: string; message: string; table?: string; column?: string }>;
  warnings: string[];
  ast: unknown;
}

export class SQLValidator {
  private db = createClient<Database>();

  async validate(sql: string, orgId: string, targetTables?: string[]): Promise<ValidationResult> {
    const errors: Array<{ type: string; message: string; table?: string; column?: string }> = [];
    const warnings: string[] = [];

    // 1. Basic syntax check
    if (!sql.trim().toUpperCase().startsWith('SELECT') && !sql.trim().toUpperCase().startsWith('WITH')) {
      errors.push({ type: 'SYNTAX', message: 'Only SELECT/WITH queries allowed' });
    }

    // 2. Check for dangerous operations
    const dangerousPatterns = [
      /\bDROP\s+(TABLE|VIEW|INDEX|SCHEMA|DATABASE)\b/i,
      /\bTRUNCATE\s+TABLE\b/i,
      /\bALTER\s+(TABLE|VIEW|SCHEMA)\b/i,
      /\bDELETE\s+FROM\b/i,
      /\bINSERT\s+INTO\b/i,
      /\bUPDATE\s+\w+\s+SET\b/i,
      /\bCREATE\s+(TABLE|VIEW|INDEX|SCHEMA|DATABASE)\b/i,
      /\bGRANT\s+\w+\b/i,
      /\bREVOKE\s+\w+\b/i,
      /\bCOPY\s+\w+\b/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(sql)) {
        errors.push({ type: 'DANGEROUS_OPERATION', message: `Dangerous operation detected: ${pattern.source}` });
      }
    }

    // 3. Check for organization_id filter (via current_org_id())
    const hasOrgFilter = /\bcurrent_org_id\(\)\b/.test(sql) || /\borganization_id\s*=\s*\$1\b/.test(sql);
    if (!hasOrgFilter) {
      errors.push({ type: 'MISSING_ORG_FILTER', message: 'Query must include organization_id filter (use current_org_id())' });
    }

    // 4. Check for LIMIT clause (or enforce default)
    if (!/LIMIT\s+\d+/i.test(sql)) {
      warnings.push('No LIMIT clause found - default limit of 1000 will be applied');
    }

    // 5. Check for dangerous functions
    const dangerousFunctions = [
      /pg_sleep/i,
      /pg_read_file/i,
      /pg_write_file/i,
      /pg_ls_dir/i,
      /copy\s*\(/i,
      /lo_import/i,
      /lo_export/i,
    ];

    for (const func of dangerousFunctions) {
      if (func.test(sql)) {
        errors.push({ type: 'DANGEROUS_FUNCTION', message: `Dangerous function detected` });
      }
    }

    // 5. Complexity checks
    const joinCount = (sql.match(/\bJOIN\b/gi) || []).length;
    if (joinCount > 10) {
      warnings.push(`High join count (${joinCount}) - consider materialized view`);
    }

    const subqueryCount = (sql.match(/\(\s*SELECT/gi) || []).length;
    if (subqueryCount > 5) {
      warnings.push(`High subquery count (${subqueryCount}) - consider CTEs`);
    }

    // 6. Check for semantic layer metric references
    const metricRefs = sql.match(/\{\{(\w+)\}\}/g) || [];
    // In production, validate against semantic layer

    return {
      valid: errors.length === 0,
      errors: errors.map(e => ({ type: e.name?.toUpperCase() || 'VALIDATION_ERROR', message: e.message })),
      warnings: [],
      ast: null,
    };
  }
}

export function getSqlValidator() {
  return new SQLValidator();
}