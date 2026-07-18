import { createClient, type Database } from '../../src/lib/supabase/client';
import * as XLSX from 'xlsx';

const db = createClient<Database>();

interface ParseResult {
  headers: string[];
  rows: unknown[][];
  totalRows: number;
  columns: Array<{ name: string; type: string; sample: unknown[]; nullable: boolean }>;
}

export class DataImportService {
  private db = createClient<Database>();

  async initiateUpload(input: {
    orgId: string;
    userId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    storageKey: string;
  }): Promise<{ uploadId: string }> {
    const { data, error } = await db
      .from('imported_datasets')
      .insert({
        organization_id: input.orgId,
        name: input.fileName,
        original_filename: input.fileName,
        columns: [],
        rows: [],
        row_count: 0,
        status: 'parsing',
        created_by: input.userId,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to initiate upload: ${error.message}`);
    return { uploadId: data.id };
  }

  async parseFile(uploadId: string, sheetName?: string, chunkSize = 5000): Promise<ParseResult> {
    const { data: dataset, error: fetchError } = await db
      .from('imported_datasets')
      .select('storage_key, file_size, mime_type')
      .eq('id', uploadId)
      .single();

    if (fetchError || !dataset) throw new Error('Dataset not found');

    // In production, fetch from Supabase Storage
    // For now, simulate parsing
    const buffer = await this.fetchFromStorage(dataset.storage_key);
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    const targetSheet = sheetName || workbook.SheetNames[0];
    const sheet = workbook.Sheets[targetSheet];
    if (!sheet) throw new Error(`Sheet "${targetSheet}" not found`);

    // Convert to JSON with header row
    const json = XLSX.utils.sheet_to_json(sheet, { 
      header: 1, 
      defval: null,
      raw: false,
    }) as unknown[][];

    if (json.length === 0) {
      throw new Error('File is empty');
    }

    const headers = json[0] as string[];
    const rows = json.slice(1);
    
    // Detect column types
    const columns = headers.map((h, i) => {
      const colValues = rows.map(r => r[i]);
      return {
        name: h || `Column ${i + 1}`,
        type: this.detectType(colValues),
        sample: colValues.slice(0, 5),
        nullable: colValues.some(v => v == null || v === ''),
      };
    });

    // Update dataset with preview
    await db
      .from('imported_datasets')
      .update({
        columns,
        rows: rows.slice(0, 100), // Store preview
        row_count: rows.length,
        status: 'parsed',
      })
      .eq('id', uploadId);

    return {
      headers,
      rows: rows.slice(0, 10),
      totalRows: rows.length,
      columns,
    };
  }

  private async fetchFromStorage(key: string): Promise<ArrayBuffer> {
    // In production, use Supabase Storage API
    // For now, return empty buffer
    return new ArrayBuffer(0);
  }

  private detectType(values: unknown[]): string {
    const nonNull = values.filter(v => v != null && v !== '');
    if (nonNull.length === 0) return 'string';
    
    const numCount = nonNull.filter(v => !isNaN(Number(v)) && v !== '').length;
    const dateCount = nonNull.filter(v => !isNaN(Date.parse(String(v)))).length;
    const boolCount = nonNull.filter(v => 
      String(v).toLowerCase() === 'true' || 
      String(v).toLowerCase() === 'false' ||
      v === true || v === false
    ).length;

    if (boolCount / nonNull.length > 0.8) return 'boolean';
    if (dateCount / nonNull.length > 0.6) return 'date';
    if (numCount / nonNull.length > 0.8) return 'number';
    return 'string';
  }

  async getPreview(uploadId: string): Promise<ParseResult | null> {
    const { data, error } = await db
      .from('imported_datasets')
      .select('columns, rows, row_count, headers')
      .eq('id', uploadId)
      .single();

    if (error || !data) return null;

    return {
      headers: data.columns?.map((c: any) => c.name) || [],
      rows: data.rows || [],
      totalRows: data.row_count,
      columns: data.columns || [],
    };
  }

  async saveDataset(uploadId: string, name: string): Promise<{ id: string }> {
    const { data, error } = await db
      .from('imported_datasets')
      .update({ name, status: 'draft' })
      .eq('id', uploadId)
      .select('id')
      .single();

    if (error) throw new Error(`Failed to save dataset: ${error.message}`);
    return { id: data.id };
  }

  async listDatasets(orgId: string): Promise<Array<{ id: string; name: string; row_count: number; status: string; created_at: string }>> {
    const { data, error } = await db
      .from('imported_datasets')
      .select('id, name, row_count, status, created_at')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to list datasets: ${error.message}`);
    return data || [];
  }

  async deleteDataset(id: string, orgId: string): Promise<void> {
    const { error } = await db
      .from('imported_datasets')
      .delete()
      .eq('id', id)
      .eq('organization_id', orgId);

    if (error) throw new Error(`Failed to delete dataset: ${error.message}`);
  }

  async createMapping(input: {
    datasetId: string;
    name: string;
    targetTable: string;
    columnMapping: Record<string, string>;
    transformRules?: Record<string, string>;
    orgId: string;
    userId: string;
  }): Promise<{ id: string }> {
    const { data, error } = await db
      .from('import_mappings')
      .insert({
        organization_id: input.orgId,
        dataset_id: input.datasetId,
        name: input.name,
        target_table: input.targetTable,
        column_mapping: input.columnMapping,
        transform_rules: input.transformRules || {},
        created_by: input.userId,
      })
      .select('id')
      .single();

    if (error) throw new Error(`Failed to create mapping: ${error.message}`);
    return { id: data.id };
  }

  async executeMapping(mappingId: string, batchSize = 1000): Promise<{ jobId: string }> {
    const { data: mapping, error: mappingError } = await db
      .from('import_mappings')
      .select('*, dataset:imported_datasets(*)')
      .eq('id', mappingId)
      .single();

    if (mappingError || !mapping) throw new Error('Mapping not found');

    // Create import job
    const { data: job, error: jobError } = await db
      .from('import_jobs')
      .insert({
        organization_id: mapping.organization_id,
        mapping_id: mappingId,
        dataset_id: mapping.dataset_id,
        status: 'running',
        total_rows: mapping.dataset.row_count,
        processed_rows: 0,
        failed_rows: 0,
        started_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (jobError) throw new Error(`Failed to create job: ${jobError.message}`);

    // Process in background (in production, use queue)
    this.processImport(job.id, mapping, 1000).catch(console.error);

    return { jobId: job.id };
  }

  private async processImport(jobId: string, mapping: any, batchSize: number): Promise<void> {
    try {
      const dataset = mapping.dataset;
      const rows = dataset.rows as unknown[][];
      const columns = dataset.columns as Array<{ name: string; type: string }>;
      const columnMapping = mapping.column_mapping;
      const transformRules = mapping.transform_rules || {};

      let processed = 0;
      let failed = 0;
      const errors: Array<{ row: number; error: string }> = [];

      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        
        for (let j = 0; j < batch.length; j++) {
          const row = batch[j];
          const rowIndex = i + j;
          
          try {
            const record = this.transformRow(row, columns, columnMapping, transformRules);
            
            // Insert into target table
            const { error } = await db.from('finance_transactions').insert({
              ...record,
              organization_id: 'current-org-id', // Would come from context
            });

            if (error) {
              failed++;
              errors.push({ row: rowIndex, error: error.message });
            } else {
              processed++;
            }
          } catch (error) {
            failed++;
            errors.push({ row: rowIndex, error: error instanceof Error ? error.message : 'Unknown error' });
          }
        }

        // Update progress
        await db
          .from('import_jobs')
          .update({ 
            processed_rows: processed, 
            failed_rows: failed,
            error_details: errors.length > 0 ? errors : null,
          })
          .eq('id', jobId);

        // Yield to event loop
        await new Promise(r => setTimeout(r, 0));
      }

      // Complete job
      await db
        .from('import_jobs')
        .update({
          status: failed > 0 && processed === 0 ? 'failed' : 'completed',
          processed_rows: processed,
          failed_rows: failed,
          completed_at: new Date().toISOString(),
          error_details: errors.length > 0 ? errors : null,
        })
        .eq('id', jobId);

      // Update dataset status
      await db
        .from('imported_datasets')
        .update({ status: 'imported', mapped_table: 'finance_transactions' })
        .eq('id', rows[0]?.dataset_id); // Would need actual dataset ID
    } catch (error) {
      await db
        .from('import_jobs')
        .update({ 
          status: 'failed', 
          error_details: [{ error: error instanceof Error ? error.message : 'Unknown error' }],
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);
    }
  }

  private transformRow(
    row: unknown[], 
    columns: Array<{ name: string; type: string }>, 
    mapping: Record<string, string>,
    transforms: Record<string, string>
  ): Record<string, unknown> {
    const record: Record<string, unknown> = {};

    for (const [sourceCol, targetCol] of Object.entries(mapping)) {
      const colIndex = columns.findIndex(c => c.name === sourceCol);
      if (colIndex === -1) continue;

      let value = row[colIndex];
      
      // Apply type conversion
      const colType = columns[colIndex]?.type;
      if (colType === 'number') value = Number(value);
      else if (colType === 'date') value = value ? new Date(String(value)).toISOString() : null;
      else if (colType === 'boolean') value = String(value).toLowerCase() === 'true';

      // Apply transform
      if (transforms[targetCol]) {
        try {
          // In production, use a safe expression evaluator
          value = eval(transforms[targetCol].replace(/\{value\}/g, JSON.stringify(value)));
        } catch {
          // Keep original value on transform error
        }
      }

      record[targetCol] = value;
    }

    return record;
  }
}

export function getDataImportService(): DataImportService {
  return new DataImportService();
}