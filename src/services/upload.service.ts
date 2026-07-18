import { supabase } from "@/lib/supabase/client";

export const UploadService = {
  async processUpload(file: File, datasetName: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in");

    const userId = session.user.id;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const storagePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(storagePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data: dataset, error: datasetError } = await supabase
      .from("imported_datasets")
      .insert({
        name: datasetName,
        original_filename: file.name,
        status: "uploaded",
      })
      .select()
      .single();

    if (datasetError) throw datasetError;

    return { dataset };
  }
};

