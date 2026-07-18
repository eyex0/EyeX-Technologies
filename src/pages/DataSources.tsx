import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, DataTable, Badge } from "@/components/common/primitives";
import { UploadService } from "@/services/upload.service";
import { DynamicDashboard, DashboardConfig } from "@/components/dashboard/DynamicDashboard";
import { RefreshCw, Upload, Database, Globe, Package, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function DataSourcesPage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDashboard, setGeneratedDashboard] = useState<DashboardConfig | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: sources = [], isLoading: sourcesLoading } = useQuery({
    queryKey: ["data_sources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("data_sources")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setGeneratedDashboard(null);

    try {
      const result = await UploadService.processUpload(file, file.name);
      setGeneratedDashboard((result.dashboard as any).config ?? (result.dashboard as any).layout);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to process upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <AppShell title="Data Sources" subtitle="Connected inputs · pipelines">
      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded">
          {error}
        </div>
      )}

      {uploading && (
        <div className="mb-6 p-4 border border-eye-border bg-surface rounded flex items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-eye-white">Processing and analyzing data...</span>
        </div>
      )}

      {generatedDashboard ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-white">Generated Dashboard</h2>
            <button
              onClick={() => setGeneratedDashboard(null)}
              className="text-xs text-muted-foreground hover:text-white"
            >
              Clear
            </button>
          </div>
          <DynamicDashboard config={generatedDashboard} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bento-card rounded-lg p-5 flex flex-col gap-3 items-start hover:bg-secondary/20 transition"
          >
            <Upload className="h-[22px] w-[22px] text-white" />
            <span className="text-sm text-white font-medium">Upload File</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">CSV / Excel</span>
          </button>
          {[
            { icon: "database", label: "Connect Database" },
            { icon: "api", label: "Connect API" },
          ].map((a) => {
            const iconMap: Record<string, typeof Database> = { database: Database, api: Globe };
            const Icon = iconMap[a.icon] ?? Package;
            return (
              <button key={a.label} className="bento-card rounded-lg p-5 flex flex-col gap-3 items-start hover:bg-secondary/20 transition">
                <Icon className="h-[22px] w-[22px] text-white" />
                <span className="text-sm text-white font-medium">{a.label}</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Configure</span>
              </button>
            );
          })}
        </div>
      )}

      <Card title="Connected Sources" icon="hub" action={
        <div className="flex gap-2">
          <button className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-white">Refresh</button>
          <button className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">Connect</button>
        </div>
      }>
        {sourcesLoading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading sources...</span>
          </div>
        ) : sources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <Database className="h-8 w-8" />
            <span className="text-sm">No data sources connected</span>
            <span className="text-xs">Upload a file or connect a database to get started</span>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Source" },
              { key: "type", label: "Type" },
              { key: "enabled", label: "Status", render: (r: any) => <Badge tone={r.enabled ? "success" : "danger"}>{r.enabled ? "Active" : "Disabled"}</Badge> },
              { key: "last_synced_at", label: "Last Sync", align: "right", render: (r: any) => <span className="font-mono text-muted-foreground">{r.last_synced_at ? new Date(r.last_synced_at).toLocaleDateString() : "Never"}</span> },
            ] as any}
            rows={sources}
          />
        )}
      </Card>
    </AppShell>
  );
}
