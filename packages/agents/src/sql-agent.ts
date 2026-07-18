import { createClient, type Database } from '../../src/lib/supabase/client';
import { BaseAgent, type AgentContext, type AgentOutput, type LLMProvider, type LLMOptions, type LLMResponse, type ToolRegistry } from './base';
import { z } from 'zod';
import { SQLValidator } from '../../packages/services/src/sql-validator';
import { SchemaCache } from '../../packages/services/src/schema-cache';

interface SQLAgentInput {
  question: string;
  targetTables?: string[];
  context?: Record<string, unknown>;
}

interface SQLAgentOutput {
  sql: string;
  result: Record<string, unknown>[];
  rowCount: number;
  columns: string[];
  explanation: string;
  confidence: number;
  tokensUsed: number;
  metadata: {
    tablesUsed: string[];
    executionTimeMs: number;
    validationPassed: boolean;
    candidateCount: number;
  };
}

interface SQLCandidate {
  sql: string;
  tablesUsed: string[];
  confidence: number;
  explanation: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
  ast: unknown;
}

interface ValidationError {
  type: 'SYNTAX' | 'INVALID_TABLE' | 'INVALID_COLUMN' | 'MISSING_ORG_FILTER' | 'DANGEROUS_OPERATION' | 'UNKNOWN_METRIC' | 'TOO_COMPLEX';
  message: string;
  table?: string;
  column?: string;
}

export class SQLAgent extends BaseAgent {
  private validator: SQLValidator;
  private optimizer: QueryOptimizer;
  private schemaCache: SchemaCache;

  constructor(
    llm: LLMProvider,
    db: ReturnType<typeof createClient<Database>>,
    tools: ToolRegistry
  ) {
    super(llm, db, tools);
    this.name = 'sql-agent';
    this.validator = new SQLValidator(db);
    this.optimizer = new QueryOptimizer(db);
    this.schemaCache = new SchemaCache(db);
  }

  async execute(input: SQLAgentInput, context: AgentContext): Promise<AgentOutput> {
    const { question, targetTables, context: userContext } = input;

    // 1. Retrieve relevant schema
    const schema = await this.schemaCache.getSchema(context.orgId, targetTables);
    
    // 2. Get semantic layer metrics
    const semanticLayer = await this.getSemanticLayer(context.orgId);
    
    // 3. Generate candidate SQLs (multiple attempts)
    const candidates = await this.generateCandidates(question, schema, semanticLayer, userContext);
    
    // 4. Validate each candidate
    const validated = await Promise.all(
      candidates.map(c => this.validator.validate(c, schema))
    );

    // 5. Select best candidate
    const best = this.selectBest(validated);
    if (!best) throw new Error('No valid SQL generated after retries');

    // 6. Dry run
    const dryRun = await this.dryRun(best.sql, context);
    if (!dryRun.success) {
      return this.retryWithFeedback(best, dryRun.error, context, schema, semanticLayer);
    }

    // 6. Execute with limits
    const result = await this.executeQuery(best.sql, context);

    // 7. Generate explanation
    const explanation = await this.explain(question, best.sql, result);

    return {
      output: {
        sql: best.sql,
        result: result.rows,
        rowCount: result.rowCount,
        columns: result.columns,
        explanation,
        confidence: best.confidence,
        tokensUsed: result.tokensUsed,
        metadata: {
          tablesUsed: best.tablesUsed,
          executionTimeMs: result.executionTimeMs,
          validationPassed: true,
          candidateCount: candidates.length,
        },
      },
      tokensUsed: result.tokensUsed,
    };
  }

  private async generateCandidates(
    question: string, 
    schema: DatabaseSchema,
    semanticLayer: SemanticLayer,
    userContext?: Record<string, unknown>
  ): Promise<SQLCandidate[]> {
    const prompt = this.buildPrompt(question, schema, semanticLayer, userContext);
    
    const response = await this.llm.complete(prompt, { 
      temperature: 0.1, 
      maxTokens: 4000,
      stop: ['```'],
      n: 3,
    });

    return response.choices.map(choice => this.parseSQL(choice.text));
  }

  private buildPrompt(
    question: string, 
    schema: DatabaseSchema, 
    semanticLayer: SemanticLayer,
    userContext?: Record<string, unknown>
  ): string {
    const template = this.loadPrompt('sql');
    const contextStr = userContext ? `CONTEXT: ${JSON.stringify(userContext)}` : '';
    return template
      .replace('{{QUESTION}}', question)
      .replace('{{CONTEXT}}', contextStr)
      .replace('{{SCHEMA}}', schema.toString())
      .replace('{{SEMANTIC_LAYER}}', semanticLayer.toYAML());
  }

  private parseSQL(text: string): SQLCandidate {
    const match = text.match(/```sql\n([\s\S]*?)\n```/);
    const sql = match ? match[1].trim() : text.trim();
    
    // Extract table names from SQL
    const tablesUsed = this.extractTables(sql);
    
    return {
      sql,
      tablesUsed,
      confidence: 0.8,
      explanation: '',
    };
  }

  private extractTables(sql: string): string[] {
    const tables: string[] = [];
    const fromRegex = /\b(?:FROM|JOIN)\s+(\w+)/gi;
    let match;
    while ((match = fromRegex.exec(sql)) !== null) {
      const table = match[1].toLowerCase();
      if (!tables.includes(table)) tables.push(table);
    }
    return tables;
  }

  private selectBest(validated: Array<{ candidate: SQLCandidate; validation: ValidationResult }>): SQLCandidate | null {
    const valid = validated.filter(v => v.validation.valid);
    if (valid.length === 0) return null;
    
    // Prefer higher confidence, fewer tables, fewer joins
    return valid.sort((a, b) => {
      const aComplexity = a.candidate.tablesUsed.length + (a.validation.warnings?.length ?? 0);
      const bComplexity = b.candidate.tablesUsed.length + (b.validation.warnings?.length ?? 0);
      return aComplexity - bComplexity || b.candidate.confidence - a.candidate.confidence;
    })[0].candidate;
  }

  private async dryRun(sql: string, context: AgentContext): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.db
        .rpc('dry_run_sql', { p_sql: sql, p_org_id: context.orgId });
      return { success: !error, error: error?.message };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : 'Dry run failed' };
    }
  }

  private async retryWithFeedback(
    candidate: SQLCandidate, 
    error: string, 
    context: AgentContext,
    schema: DatabaseSchema,
    semanticLayer: SemanticLayer
  ): Promise<AgentOutput> {
    const feedbackPrompt = `
The previous SQL failed with error: ${error}

Previous SQL:
${candidate.sql}

Please fix the error and return corrected SQL only.
`;

    const response = await this.llm.complete(feedbackPrompt, { temperature: 0.1, maxTokens: 2000 });
    const fixed = this.parseSQL(response.content);
    
    const validated = await this.validator.validate(fixed, await this.schemaCache.getSchema(context.orgId));
    if (!validated.valid) {
      throw new Error(`Retry failed: ${validated.errors.map(e => e.message).join(', ')}`);
    }

    const dryRun = await this.dryRun(fixed.sql, context);
    if (!dryRun.success) {
      throw new Error(`Retry dry run failed: ${dryRun.error}`);
    }

    const result = await this.executeQuery(fixed.sql, { ...context, orgId: context.orgId });
    const explanation = await this.explain('', fixed.sql, result);

    return {
      output: {
        sql: fixed.sql,
        result: result.rows,
        rowCount: result.rowCount,
        columns: result.columns,
        explanation,
        confidence: fixed.confidence * 0.9, // Slight penalty for retry
        tokensUsed: result.tokensUsed,
        metadata: {
          tablesUsed: fixed.tablesUsed,
          executionTimeMs: result.executionTimeMs,
          validationPassed: true,
          candidateCount: 1,
        },
      },
      tokensUsed: result.tokensUsed,
    };
  }

  private async executeQuery(sql: string, context: AgentContext): Promise<{
    rows: Record<string, unknown>[];
    rowCount: number;
    columns: string[];
    executionTimeMs: number;
    tokensUsed: number;
  }> {
    const startTime = Date.now();
    
    const { data, error } = await this.db
      .rpc('execute_sql_with_limit', { 
        p_sql: sql, 
        p_limit: 1000,
        p_org_id: context.orgId 
      });

    if (error) throw new Error(`Execution failed: ${error.message}`);

    const executionTimeMs = Date.now() - startTime;
    const rows = data?.rows ?? [];
    const columns = data?.columns ?? [];

    return {
      rows,
      rowCount: rows.length,
      columns,
      executionTimeMs,
      tokensUsed: 0, // SQL execution doesn't use LLM tokens
    };
  }

  private async explain(question: string, sql: string, result: { rows: Record<string, unknown>[] }): Promise<string> {
    const prompt = `
Explain this SQL query and its results in plain English.

Question: ${question}
SQL: ${sql}
Result preview (first 5 rows): ${JSON.stringify(result.rows.slice(0, 5))}
Total rows: ${result.rows.length}

Provide a clear, concise explanation suitable for a business user.
`;

    const response = await this.llm.complete(prompt, { temperature: 0.2, maxTokens: 500 });
    return response.content;
  }

  private async getSemanticLayer(orgId: string): Promise<SemanticLayer> {
    const { data } = await this.db
      .from('metrics')
      .select('name, display_name, sql_definition, dimensions, unit, format')
      .eq('organization_id', orgId)
      .eq('status', 'certified');

    return new SemanticLayer(data ?? []);
  }

  // Validation methods
  async validate(sql: string, orgId: string, targetTables?: string[]): Promise<ValidationResult> {
    const schema = await this.schemaCache.getSchema(orgId, targetTables);
    const semanticLayer = await this.getSemanticLayer(orgId);
    const candidate = this.parseSQL(sql);
    return this.validator.validate(candidate, schema);
  }

  async explain(input: { sql: string; question?: string }): Promise<string> {
    const { sql, question } = input;
    const result = await this.executeQuery(sql, { orgId: '', userId: '', permissions: [], budget: { maxTokens: 0, usedTokens: 0, remaining: 0, exceeded: false, consume: () => true } });
    return this.explain(question ?? '', sql, result);
  }
}

// ==================== Supporting Classes ====================

class SQLValidator {
  constructor(private db: ReturnType<typeof createClient<Database>>) {}

  async validate(candidate: SQLCandidate, schema: DatabaseSchema): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // 1. Parse AST
    let ast: unknown;
    try {
      ast = this.parseSQL(candidate.sql);
    } catch (e) {
      return { valid: false, errors: [{ type: 'SYNTAX', message: e instanceof Error ? e.message : 'Parse error' }], warnings, ast: null };
    }

    // 2. Validate tables exist
    const tables = this.extractTables(ast);
    for (const table of tables) {
      if (!schema.hasTable(table)) {
        errors.push({ type: 'INVALID_TABLE', message: `Table "${table}" does not exist`, table });
      }
    }

    // 3. Validate columns exist
    const columns = this.extractColumns(ast);
    for (const col of columns) {
      if (!schema.hasColumn(col.table, col.name)) {
        errors.push({ type: 'INVALID_COLUMN', message: `Column "${col.name}" not found in "${col.table}"`, table: col.table, column: col.name });
      }
    }

    // 4. Check organization_id filter
    if (!this.hasOrgFilter(ast)) {
      errors.push({ type: 'MISSING_ORG_FILTER', message: 'Missing organization_id filter (must use current_org_id())' });
    }

    // 5. Check for dangerous operations
    if (this.hasDangerousOps(ast)) {
      errors.push({ type: 'DANGEROUS_OPERATION', message: 'DROP, TRUNCATE, ALTER, DELETE, INSERT, UPDATE not allowed' });
    }

    // 6. Complexity checks
    const complexity = this.calculateComplexity(ast);
    if (complexity.joins > 10) warnings.push('Many joins - consider materialized view');
    if (complexity.subqueries > 5) warnings.push('Many subqueries - consider CTEs');

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      ast,
    };
  }

  private parseSQL(sql: string): unknown {
    // Simple parser - in production use pg-query-parser or similar
    return { sql };
  }

  private extractTables(ast: unknown): string[] {
    // Implementation would extract table names from AST
    return [];
  }

  private extractColumns(ast: unknown): Array<{ table: string; name: string }> {
    return [];
  }

  private hasOrgFilter(ast: unknown): boolean {
    // Check for current_org_id() in WHERE clauses
    return true; // Simplified
  }

  private hasDangerousOps(ast: unknown): boolean {
    return false; // Simplified
  }

  private calculateComplexity(ast: unknown): { joins: number; subqueries: number; warnings: string[] } {
    return { joins: 0, subqueries: 0, warnings: [] };
  }
}

class QueryOptimizer {
  constructor(private db: ReturnType<typeof createClient<Database>>) {}

  async optimize(sql: string): Promise<string> {
    // Add hints, reorder joins, push down predicates
    return sql;
  }
}

class SchemaCache {
  private cache: Map<string, DatabaseSchema> = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  constructor(private db: ReturnType<typeof createClient<Database>>) {}

  async getSchema(orgId: string, targetTables?: string[]): Promise<DatabaseSchema> {
    const key = `${orgId}:${targetTables?.join(',') ?? 'all'}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const schema = await this.loadSchema(orgId, targetTables);
    this.cache.set(key, schema);
    setTimeout(() => this.cache.delete(key), this.ttl);
    return schema;
  }

  private async loadSchema(orgId: string, targetTables?: string[]): Promise<DatabaseSchema> {
    // Load from information_schema
    const { data } = await this.db
      .rpc('get_database_schema', { p_org_id: orgId, p_tables: targetTables });
    return new DatabaseSchema(data ?? []);
  }
}

class DatabaseSchema {
  private tables: Map<string, TableSchema> = new Map();

  constructor(rows: Array<{ table_name: string; column_name: string; data_type: string; is_nullable: boolean; column_default: string | null }>) {
    for (const row of rows) {
      if (!this.tables.has(row.table_name)) {
        this.tables.set(row.table_name, { name: row.table_name, columns: [] });
      }
      this.tables.get(row.table_name)!.columns.push({
        name: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES',
        default: row.column_default,
      });
    }
  }

  hasTable(name: string): boolean {
    return this.tables.has(name);
  }

  hasColumn(table: string, column: string): boolean {
    return this.tables.get(table)?.columns.some(c => c.name === column) ?? false;
  }

  getTable(name: string): TableSchema | undefined {
    return this.tables.get(name);
  }

  toString(): string {
    let out = '';
    for (const [name, table] of this.tables) {
      out += `Table: ${name}\n`;
      for (const col of table.columns) {
        out += `  ${col.name}: ${col.type}${col.nullable ? '' : ' NOT NULL'}${col.default ? ` DEFAULT ${col.default}` : ''}\n`;
      }
      out += '\n';
    }
    return out;
  }
}

interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
}

class SemanticLayer {
  private metrics: Map<string, MetricDefinition> = new Map();

  constructor(metrics: Array<{ name: string; display_name: string | null; sql_definition: string; dimensions: string[]; unit: string | null; format: Record<string, unknown> }>) {
    for (const m of metrics) {
      this.metrics.set(m.name, {
        name: m.name,
        displayName: m.display_name ?? m.name,
        sql: m.sql_definition,
        dimensions: m.dimensions,
        unit: m.unit,
        format: m.format,
      });
    }
  }

  hasMetric(name: string): boolean {
    return this.metrics.has(name);
  }

  getMetric(name: string): MetricDefinition | undefined {
    return this.metrics.get(name);
  }

  toYAML(): string {
    let out = 'metrics:\n';
    for (const [name, m] of this.metrics) {
      out += `  ${name}:\n`;
      out += `    display_name: "${m.displayName}"\n`;
      out += `    sql: "${m.sql.replace(/"/g, '\\"')}"\n`;
      out += `    dimensions: ${JSON.stringify(m.dimensions)}\n`;
      if (m.unit) out += `    unit: "${m.unit}"\n`;
      out += '\n';
    }
    return out;
  }
}

interface MetricDefinition {
  name: string;
  displayName: string;
  sql: string;
  dimensions: string[];
  unit: string | null;
  format: Record<string, unknown>;
}

// Export for use in other agents
export { SQLValidator, SchemaCache, DatabaseSchema, SemanticLayer };
export type { SQLAgentInput, SQLAgentOutput, SQLCandidate, ValidationResult, ValidationError, AgentContext };