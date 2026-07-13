import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, DataTable, Badge, BarChart, Sparkline, Kpi } from "@/components/common/primitives";
import * as m from "@/lib/mock";
import { UploadService } from "@/services/upload.service";
import { DynamicDashboard, DashboardConfig } from "@/components/dashboard/DynamicDashboard";

export function DataSourcesPage() {
  // Workflow states: idle, uploading, processing, completed, failed
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedDashboard, setGeneratedDashboard] = useState<DashboardConfig | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

        setStatus('uploading');
    setError(null);
    setGeneratedDashboard(null);

      try {
        // Upload file and create dataset + metadata
        const result = await UploadService.processUpload(file, file.name);
        // After successful upload, move to processing state for analysis
        setStatus('processing');
        // The analysis service already ran inside processUpload and returned a dashboard
        // The dashboard layout returned from the backend is typed as generic JSON.
        // Cast it to the expected DashboardConfig shape for the UI.
        const layout = result.dashboard.layout as unknown as DashboardConfig;
        setGeneratedDashboard(layout);
        setStatus('completed');
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to process upload");
        setStatus('failed');
      } finally {
        // Reset file input regardless of outcome
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

        {status === 'uploading' && (
          <div className="mb-6 p-4 border border-eye-border bg-surface rounded flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-primary">sync</span>
            <span className="text-sm text-eye-white">Uploading file...</span>
          </div>
        )}
        {status === 'processing' && (
          <div className="mb-6 p-4 border border-eye-border bg-surface rounded flex items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-primary">sync</span>
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
            <span className="material-symbols-outlined text-white text-[22px]">upload_file</span>
            <span className="text-sm text-white font-medium">Upload File</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">CSV / Excel</span>
          </button>
          {[
            { icon: "database", label: "Connect Database" },
            { icon: "api", label: "Connect API" },
          ].map((a) => (
            <button key={a.label} className="bento-card rounded-lg p-5 flex flex-col gap-3 items-start hover:bg-secondary/20 transition">
              <span className="material-symbols-outlined text-white text-[22px]">{a.icon}</span>
              <span className="text-sm text-white font-medium">{a.label}</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Configure</span>
            </button>
          ))}
        </div>
      )}

      <Card title="Connected Sources" icon="hub" action={
        <div className="flex gap-2">
          <button className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-white">Refresh</button>
          <button className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded">Connect</button>
        </div>
      }>
        <DataTable
          columns={[
            { key: "name", label: "Source" },
            { key: "type", label: "Type" },
            { key: "owner", label: "Owner" },
            { key: "status", label: "Status", render: (r:any) => <Badge tone={r.status==="Synced"?"success":r.status==="Failed"?"danger":"info"}>{r.status}</Badge> },
            { key: "lastSync", label: "Last Sync", align: "right" },
          ] as any}
          rows={m.sourcesConnected}
        />
      </Card>
    </AppShell>
  );
}

