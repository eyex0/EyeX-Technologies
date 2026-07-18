import { supabase } from "@/lib/supabase/client";
import { DatabaseService } from "./database.service";
import { AnalysisService } from "./analysis.service";

export const UploadService = {
  /**
   * Orchestrates the upload workflow:
   * 1. Store file in Supabase Storage
   * 2. Create dataset record
   * 3. Save file metadata
   * 4. Analyze data to generate dashboard JSON
   * 5. Save dashboard JSON
   */
  async processUpload(file: File, datasetName: string, description?: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in");

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const storagePath = `${userId}/${fileName}`;

    // 1. Store file in Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    // 2. Create dataset record
    const dataset = await DatabaseService.createDataset(datasetName, description);

    // 3. Save file metadata
    const uploadedFile = await DatabaseService.recordFileMetadata({
      dataset_id: dataset.id,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: storagePath,
    });

    // 4. Analyze data to generate dashboard JSON
    const dashboardJson = await AnalysisService.processAndAnalyze(file);

    // 5. Save generated dashboard
    const dashboard = await DatabaseService.saveDashboard(
      `Dashboard for ${datasetName}`, 
      dashboardJson
    );

    return { dataset, file: uploadedFile, dashboard };
  }
};

