import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/common/primitives";
import * as m from "@/lib/mock";
import {
  Table, Database, DollarSign, ShoppingBag, Share2, Cloud,
  BarChart3, Target, MessageSquare, FileText, Lightbulb, Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  table_chart: Table, table_view: Table, database: Database,
  payments: DollarSign, storefront: ShoppingBag, hub: Share2,
  cloud: Cloud, analytics: BarChart3, ads_click: Target,
  chat: MessageSquare, sticky_note_2: FileText, receipt_long: FileText,
  insights: Lightbulb,
};

export function IntegrationsPage() {
  return (
    <AppShell title="Integrations" subtitle="Connect your stack">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {m.integrationsCatalog.map((i) => (
          <div key={i.name} className="bento-card rounded-lg p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center">
                {(() => { const Icon = ICON_MAP[i.icon] ?? Package; return <Icon className="h-5 w-5 text-white" />; })()}
              </div>
              <Badge tone={i.status==="Connected"?"success":"info"}>{i.status}</Badge>
            </div>
            <div>
              <div className="text-white font-medium text-sm">{i.name}</div>
              <div className="text-muted-foreground text-xs mt-1">{i.desc}</div>
            </div>
            <button className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded ${i.status==="Connected"?"border border-border text-white hover:bg-secondary/40":"bg-white text-black"}`}>
              {i.status==="Connected"?"Manage":"Connect"}
            </button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

