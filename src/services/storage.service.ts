import { supabase } from "@/lib/supabase/client";

export const StorageService = {
  /**
   * Uploads a file (CSV, Excel) to Supabase Storage and returns the path.
   */
  async uploadFile(file: File, folder?: string): Promise<string> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) throw new Error("User must be authenticated to upload files.");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${userId}/${folder}/${fileName}` : `${userId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return data.path;
  },

  /**
   * Generates a signed URL for a file in storage.
   */
  async getFileUrl(path: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from('files')
      .createSignedUrl(path, expiresIn);

    if (error) {
      throw error;
    }
    
    return data.signedUrl;
  },

  /**
   * Deletes a file from storage.
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from('files')
      .remove([path]);

    if (error) {
      throw error;
    }
  }
};
