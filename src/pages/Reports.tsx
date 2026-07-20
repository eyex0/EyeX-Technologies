import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, DataTable, Badge } from "@/components/common/primitives";
import { supabase } from "@/lib/supabase/client";
import { Loader2, FileText } from "lucide-react";

export function ReportsPage() {
  const [cat, setCat] = useState("All");
  const cats = ["All", "Business", "Financial", "Marketing", "Sales", "HR"];

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["dashboards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dashboards")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered =
    cat === "All"
      ? reports
      : reports.filter((r: { name?: string }) => {
          const name = (r.name ?? "").toLowerCase();
          return name.includes(cat.toLowerCase());
        });

  return (
    <AppShell title="Reports" subtitle="Reporting center">
      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-md border ${cat === c ? "bg-white text-black border-white" : "border-border text-muted-foreground hover:text-white"}`}
          >
            {c}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-2">
          {["PDF", "Excel", "CSV"].map((f) => (
            <button
              key={f}
              className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border border-border text-white hover:bg-secondary/40"
            >
              Export {f}
            </button>
          ))}
        </div>
      </div>
      <Card title="Available reports" icon="description">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading reports...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <FileText className="h-8 w-8" />
            <span className="text-sm">No reports generated yet</span>
            <span className="text-xs">Upload data to generate your first report</span>
          </div>
        ) : (
          <DataTable
            columns={
              [
                { key: "name", label: "Report" },
                {
                  key: "description",
                  label: "Description",
                  render: (r: { description?: string }) => (
                    <span className="text-muted-foreground truncate">{r.description ?? "—"}</span>
                  ),
                },
                {
                  key: "created_by",
                  label: "Owner",
                  render: (r: { created_by?: string }) => (
                    <span className="text-muted-foreground">
                      {r.created_by ? r.created_by.slice(0, 8) + "..." : "—"}
                    </span>
                  ),
                },
                {
                  key: "created_at",
                  label: "Updated",
                  align: "right",
                  render: (r: { created_at?: string }) => (
                    <span className="font-mono text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  ),
                },
              ] as const
            }
            rows={filtered}
          />
        )}
      </Card>
    </AppShell>
  );
}
