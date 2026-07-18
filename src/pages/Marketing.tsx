import { AppShell } from "@/components/layout/AppShell";
import { ModulePage, KpiRow, TableCard } from "@/components/common/SharedBlocks";
import { Card, BarChart, Badge } from "@/components/common/primitives";
import * as m from "@/lib/mock";

export function MarketingPage() {
  return <ModulePage title="Marketing" subtitle="Campaigns · ROAS · CAC" tabs={[
    { key: "camp", label: "Campaigns", render: () => (
      <TableCard title="Active campaigns" columns={[
        { key: "name", label: "Campaign" },{ key: "channel", label: "Channel" },{ key: "spend", label: "Spend" },
        { key: "roas", label: "ROAS" },{ key: "ctr", label: "CTR" },{ key: "conv", label: "Conv", align: "right" },
      ]} rows={m.campaigns} />
    )},
    { key: "chan", label: "Channels", render: () => (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[["Google Ads","$24.1K","4.2x"],["Meta","$12.8K","3.1x"],["Email","$0.9K","12.4x"],["DV360","$41.0K","1.8x"]].map(([c,s,r]) => (
          <div key={c} className="bento-card rounded-lg p-5">
            <div className="text-[10px] font-mono uppercase text-muted-foreground">{c}</div>
            <div className="text-xl text-white font-semibold mt-2">{s}</div>
            <div className="text-xs text-muted-foreground mt-1">ROAS <span className="text-emerald-400 font-mono">{r}</span></div>
          </div>
        ))}
      </div>
    )},
    { key: "perf", label: "Performance", render: () => (
      <Card title="Performance — 12w"><BarChart data={Array.from({length:12},(_,i)=>({label:`W${i+1}`,value:20+Math.random()*80}))}/></Card>
    )},
    { key: "metrics", label: "Metrics", render: () => (
      <KpiRow items={[
        { label: "ROAS", value: "4.2x", delta: "+0.4x", icon: "trending_up" },
        { label: "CAC", value: "$142", delta: "-$8", icon: "person_add" },
        { label: "CTR", value: "3.8%", delta: "+0.2%", icon: "ads_click" },
        { label: "Conversion", value: "2.1%", delta: "+0.1%", icon: "conversion_path" },
      ]}/>
    )},
  ]}/>;
}

