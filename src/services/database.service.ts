import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Dataset = Database["public"]["Tables"]["datasets"]["Row"];
type UploadedFile = Database["public"]["Tables"]["uploaded_files"]["Row"];
type Dashboard = Database["public"]["Tables"]["dashboards"]["Row"];
type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

async function getActiveOrgId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const profile = await supabase.from("profiles").select("active_org_id").eq("id", session.user.id).single();
  return profile.data?.active_org_id ?? null;
}

export const DatabaseService = {
  // Profiles
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

    if (error) {
      console.error("Error fetching profile", error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Datasets
  async getDatasets(): Promise<Dataset[]> {
    const { data, error } = await supabase
      .from("datasets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createDataset(name: string, description?: string): Promise<Dataset> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in to create a dataset");

    const orgId = await getActiveOrgId();

    const { data, error } = await supabase
      .from("datasets")
      .insert({
        name,
        description,
        user_id: session.user.id,
        organization_id: orgId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDataset(id: string) {
    const { error } = await supabase.from("datasets").delete().eq("id", id);
    if (error) throw error;
  },

  // Uploaded Files
  async getFilesByDataset(datasetId: string): Promise<UploadedFile[]> {
    const { data, error } = await supabase
      .from("uploaded_files")
      .select("*")
      .eq("dataset_id", datasetId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllUploadedFiles(): Promise<any[]> {
    const { data, error } = await supabase
      .from("uploaded_files")
      .select("*, datasets(name)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Records file metadata, including the uploading user.
  // The previous implementation omitted the `user_id` column, which is required by the
  // MVP specification. We now accept the full Insert type so the caller can provide the
  // user identifier.
  async recordFileMetadata(
    fileData: Database["public"]["Tables"]["uploaded_files"]["Insert"],
  ): Promise<UploadedFile> {
    const { data, error } = await supabase
      .from("uploaded_files")
      .insert(fileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Dashboards
  async getDashboards(): Promise<Dashboard[]> {
    const { data, error } = await supabase
      .from("dashboards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveDashboard(title: string, layout: Record<string, unknown>): Promise<Dashboard> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("Must be logged in to save a dashboard");

    const orgId = await getActiveOrgId();

    const { data, error } = await supabase
      .from("dashboards")
      .insert({
        title,
        layout,
        user_id: session.user.id,
        organization_id: orgId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    const { data, error } = await supabase
      .from("dashboards")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Chat Messages
  async getChatHistory(sessionId?: string): Promise<ChatMessage[]> {
    let query = supabase.from("chat_messages").select("*").order("created_at", { ascending: true });

    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async saveChatMessage(
    role: "user" | "assistant" | "system",
    content: string,
    sessionId?: string,
  ): Promise<ChatMessage> {
    const { data: { session } } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ role, content, session_id: sessionId, user_id: session?.user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Organization Members
  async getOrganizationMembers(): Promise<any[]> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return [];

    const profile = await DatabaseService.getProfile(session.user.id);
    if (!profile || !profile.active_org_id) return [];

    const { data, error } = await supabase
      .from("organization_members")
      .select("*, profiles(full_name, email, avatar_url)")
      .eq("organization_id", profile.active_org_id);

    if (error) throw error;
    return data || [];
  },

  async getOrganization(orgId: string): Promise<any> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) throw error;
    return data;
  },
};
