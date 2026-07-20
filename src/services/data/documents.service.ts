import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

export type Document = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];

export interface DocumentsSummary {
  totalDocuments: number;
  recentUploads: number;
  typeBreakdown: { type: string; count: number }[];
}

export const DocumentsService = {
  async getDocuments(organizationId?: string): Promise<Document[]> {
    let query = supabase.from("documents").select("*").order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase.from("documents").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async createDocument(document: DocumentInsert): Promise<Document> {
    const { data, error } = await supabase.from("documents").insert(document).select().single();

    if (error) throw error;
    return data;
  },

  async updateDocument(id: string, updates: DocumentUpdate): Promise<Document> {
    const { data, error } = await supabase
      .from("documents")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDocument(id: string): Promise<void> {
    const { error } = await supabase.from("documents").delete().eq("id", id);

    if (error) throw error;
  },

  async getSummary(organizationId?: string): Promise<DocumentsSummary> {
    const documents = await this.getDocuments(organizationId);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = documents.filter((d) => new Date(d.created_at) >= thirtyDaysAgo).length;

    const typeMap = new Map<string, number>();
    for (const doc of documents) {
      const type = doc.file_type || "unknown";
      typeMap.set(type, (typeMap.get(type) || 0) + 1);
    }
    const typeBreakdown = Array.from(typeMap.entries()).map(([type, count]) => ({
      type,
      count,
    }));

    return {
      totalDocuments: documents.length,
      recentUploads,
      typeBreakdown,
    };
  },
};
