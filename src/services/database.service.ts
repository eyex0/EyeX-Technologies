import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Organization = Database["public"]["Tables"]["organizations"]["Row"];
type Dashboard = Database["public"]["Tables"]["dashboards"]["Row"];
type ImportedDataset = Database["public"]["Tables"]["imported_datasets"]["Row"];

export const DatabaseService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

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

  async getOrganization(orgId: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error) {
      console.error("Error fetching organization", error);
      return null;
    }
    return data;
  },

  async getDashboards(organizationId: string): Promise<Dashboard[]> {
    const { data, error } = await supabase
      .from("dashboards")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveDashboard(name: string, config: Database["public"]["Tables"]["dashboards"]["Insert"]["config"], organizationId: string): Promise<Dashboard> {
    const { data, error } = await supabase
      .from("dashboards")
      .insert({ name, config, organization_id: organizationId })
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

  async getImportedDatasets(organizationId: string): Promise<ImportedDataset[]> {
    const { data, error } = await supabase
      .from("imported_datasets")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createImportedDataset(dataset: Database["public"]["Tables"]["imported_datasets"]["Insert"]): Promise<ImportedDataset> {
    const { data, error } = await supabase
      .from("imported_datasets")
      .insert(dataset)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteImportedDataset(id: string) {
    const { error } = await supabase.from("imported_datasets").delete().eq("id", id);
    if (error) throw error;
  },
};
