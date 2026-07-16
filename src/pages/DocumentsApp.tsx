import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Badge, DataTable } from "@/components/common/primitives";
import { DatabaseService } from "@/services/database.service";
import { supabase } from "@/lib/supabase/client";

export function DocumentsAppPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState("All");
  const tags = ["All", "Contract", "Invoice", "Report", "Policy"];

  useEffect(() => {
    const load = async () => {
      const orgId = await (async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return null;
        const profile = await supabase.from("profiles").select("active_org_id").eq("id", session.user.id).single();
        return profile.data?.active_org_id;
      })();
      if (!orgId) { setLoading(false); return; }
      const { data } = await supabase.from("documents").select("*").eq("organization_id", orgId).order("created_at", { ascending: false });
      setDocuments(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const rows = tag === "All" ? documents : documents.filter(d => d.type === tag);
  const displayRows = rows.map(d => ({
    name: d.name,
    type: d.type,
    owner: "Workspace",
    tag: d.type,
    updated: new Date(d.created_at).toLocaleDateString(),
  }));

  return (
    <AppShell title="Documents" subtitle="Contracts · Invoices · Reports · Policies">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card title="Folders" icon="folder">
            <div className="p-4 space-y-1 text-xs">
              {["All Documents", "Contracts", "Invoices", "Reports", "Policies", "Shared with me", "Trash"].map(f => (
                <div key={f} className="px-3 py-2 rounded hover:bg-secondary/40 text-white cursor-pointer">{f}</div>
              ))}
            </div>
          </Card>
          <Card title="Tags" icon="sell">
            <div className="p-4 flex flex-wrap gap-2">
              {["Signed", "Draft", "Final", "Review", "Paid"].map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-background flex-1">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">search</span>
              <input className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground" placeholder="Search documents..." />
            </div>
            <div className="flex gap-1">
              {tags.map(t => (
                <button key={t} onClick={() => setTag(t)}
                  className={`text-xs px-3 py-1.5 rounded-md border ${tag === t ? "bg-white text-black border-white" : "border-border text-muted-foreground hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Card title={`Files (${documents.length})`} icon="description">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No documents uploaded yet</div>
            ) : (
              <DataTable columns={[
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "owner", label: "Owner" },
                { key: "tag", label: "Tag", render: (r: any) => <Badge>{r.tag}</Badge> },
                { key: "updated", label: "Updated", align: "right" },
              ]} rows={displayRows} />
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
