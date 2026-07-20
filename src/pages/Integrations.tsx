import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/common/primitives";
import {
  Table,
  Database,
  DollarSign,
  ShoppingBag,
  Share2,
  Cloud,
  BarChart3,
  Target,
  MessageSquare,
  FileText,
  Lightbulb,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  table_chart: Table,
  table_view: Table,
  database: Database,
  payments: DollarSign,
  storefront: ShoppingBag,
  hub: Share2,
  cloud: Cloud,
  analytics: BarChart3,
  ads_click: Target,
  chat: MessageSquare,
  sticky_note_2: FileText,
  receipt_long: FileText,
  insights: Lightbulb,
};

interface IntegrationItem {
  name: string;
  icon: string;
  desc: string;
  category: string;
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    name: "Salesforce",
    icon: "cloud",
    desc: "Sync CRM contacts, deals, and activities",
    category: "CRM",
  },
  {
    name: "HubSpot",
    icon: "hub",
    desc: "Import marketing contacts and campaign data",
    category: "CRM",
  },
  {
    name: "Slack",
    icon: "chat",
    desc: "Send alerts and notifications to channels",
    category: "Communication",
  },
  {
    name: "Microsoft Teams",
    icon: "chat",
    desc: "Collaborate on reports and dashboards",
    category: "Communication",
  },
  {
    name: "Google Drive",
    icon: "cloud",
    desc: "Store and sync document exports",
    category: "Storage",
  },
  { name: "Dropbox", icon: "cloud", desc: "Backup files and share reports", category: "Storage" },
];

const CATEGORIES = ["All", "CRM", "Communication", "Storage"];

export function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [cat, setCat] = useState("All");

  const toggle = (name: string) => {
    setConnected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const filtered = cat === "All" ? INTEGRATIONS : INTEGRATIONS.filter((i) => i.category === cat);

  return (
    <AppShell title="Integrations" subtitle="Connect your stack">
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-xs px-3 py-1.5 rounded-md border ${cat === c ? "bg-white text-black border-white" : "border-border text-muted-foreground hover:text-white"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((i) => {
          const isConnected = !!connected[i.name];
          return (
            <div key={i.name} className="bento-card rounded-lg p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md border border-border flex items-center justify-center">
                  {(() => {
                    const Icon = ICON_MAP[i.icon] ?? Package;
                    return <Icon className="h-5 w-5 text-white" />;
                  })()}
                </div>
                <Badge tone={isConnected ? "success" : "info"}>
                  {isConnected ? "Connected" : "Available"}
                </Badge>
              </div>
              <div>
                <div className="text-white font-medium text-sm">{i.name}</div>
                <div className="text-muted-foreground text-xs mt-1">{i.desc}</div>
              </div>
              <button
                onClick={() => toggle(i.name)}
                className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded ${isConnected ? "border border-border text-white hover:bg-secondary/40" : "bg-white text-black"}`}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
