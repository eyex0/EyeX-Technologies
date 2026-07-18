import { Search, Upload, FileText, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, DataTable, Badge } from "@/components/common/primitives";
import { AppShell } from "@/components/layout/AppShell";
import { DocumentsService } from "@/services/data";
import { useState } from "react";

export function DocumentsAppPage() {
  const [tag, setTag] = useState("All");
  const tags = ["All", "Contract", "Invoice", "Report", "Policy"];

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: () => DocumentsService.getDocuments(),
  });

  const rows = tag === "All" ? documents : documents.filter((d) => {
    const fileType = (d.file_type ?? "").toLowerCase();
    return fileType.includes(tag.toLowerCase());
  });

  return (
    <AppShell title="Documents" subtitle="Contracts · Invoices · Reports · Policies">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card title="Folders" icon="folder">
            <div className="p-4 space-y-1 text-xs">
              {["All Documents", "Contracts", "Invoices", "Reports", "Policies", "Shared with me"].map((f) => (
                <div key={f} className="px-3 py-2 rounded hover:bg-secondary/40 text-white cursor-pointer">{f}</div>
              ))}
            </div>
          </Card>
          <Card title="Tags" icon="sell">
            <div className="p-4 flex flex-wrap gap-2">
              {["Signed", "Draft", "Final", "Review", "Paid"].map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 border border-border rounded-md px-4 py-2 bg-background flex-1">
              <Search size={18} className="text-muted-foreground" />
              <input className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground" placeholder="Search documents..." />
            </div>
            <div className="flex gap-1">
              {tags.map((t) => (
                <button key={t} onClick={() => setTag(t)} className={`text-xs px-3 py-1.5 rounded-md border ${tag === t ? "bg-white text-black border-white" : "border-border text-muted-foreground hover:text-white"}`}>{t}</button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded">
              <Upload size={14} />
              Upload
            </button>
          </div>
          <Card title="Files" icon="description">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading documents...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <FileText className="h-8 w-8" />
                <span className="text-sm">No documents yet</span>
                <span className="text-xs">Upload your first document to get started</span>
              </div>
            ) : (
              <DataTable
                columns={[
                  { key: "name", label: "Name" },
                  { key: "file_type", label: "Type" },
                  { key: "uploaded_by", label: "Owner", render: (r: any) => <span className="text-muted-foreground">{r.uploaded_by ? r.uploaded_by.slice(0, 8) + "..." : "—"}</span> },
                  { key: "tags", label: "Tags", render: (r: any) => <div className="flex gap-1 flex-wrap">{(r.tags ?? []).map((t: string) => <Badge key={t}>{t}</Badge>)}</div> },
                  { key: "created_at", label: "Updated", align: "right", render: (r: any) => <span className="font-mono text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span> },
                ]}
                rows={rows}
              />
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
