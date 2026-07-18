import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, BarChart } from "@/components/common/primitives";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

export function MarketingPage() {
  return <ModulePage title="Marketing" subtitle="Campaigns · ROAS · CAC" tabs={[
    { key: "camp", label: "Campaigns", render: () => (
      <>
        <div className="mb-4 p-4 bg-sky-500/10 border border-sky-500/20 rounded flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-sky-400 shrink-0" />
          <span className="text-sm text-sky-200">Connect your marketing data source to see real analytics.</span>
          <Link to="/data-sources" className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-white text-black px-3 py-1.5 rounded hover:bg-white/90 transition">
            Go to Data Sources
          </Link>
        </div>
        <TableCard title="Active campaigns" columns={[
          { key: "name", label: "Campaign" },{ key: "channel", label: "Channel" },{ key: "spend", label: "Spend" },
          { key: "roas", label: "ROAS" },{ key: "ctr", label: "CTR" },{ key: "conv", label: "Conv", align: "right" },
        ]} rows={[]} />
      </>
    )},
    { key: "chan", label: "Channels", render: () => (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[["Google Ads","$0","0x"],["Meta","$0","0x"],["Email","$0","0x"],["DV360","$0","0x"]].map(([c,s,r]) => (
          <div key={c} className="bento-card rounded-lg p-5">
            <div className="text-[10px] font-mono uppercase text-muted-foreground">{c}</div>
            <div className="text-xl text-white font-semibold mt-2">{s}</div>
            <div className="text-xs text-muted-foreground mt-1">ROAS <span className="text-muted-foreground font-mono">{r}</span></div>
          </div>
        ))}
      </div>
    )},
    { key: "perf", label: "Performance", render: () => (
      <Card title="Performance — 12w"><BarChart data={Array.from({length:12},(_,i)=>({label:`W${i+1}`,value:0}))}/></Card>
    )},
    { key: "metrics", label: "Metrics", render: () => (
      <KpiRow items={[
        { label: "ROAS", value: "—", icon: "trending_up" },
        { label: "CAC", value: "—", icon: "person_add" },
        { label: "CTR", value: "—", icon: "ads_click" },
        { label: "Conversion", value: "—", icon: "conversion_path" },
      ]}/>
    )},
  ]}/>;
}
