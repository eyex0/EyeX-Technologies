export function AnalyticsPage() {
  return (
    <>
{/* Ambient Orbs */}
<div className="ambient-glow-orb top-[-10%] left-[-10%]"></div>
<div className="ambient-glow-orb bottom-[-20%] right-[-10%]"></div>
{/* TopNavBar */}

<main className="pt-32 pb-section-padding px-gutter max-w-container-max mx-auto min-h-screen">
{/* Header Section */}
<header className="mb-stack-lg">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<span className="font-label-mono text-label-mono text-primary uppercase mb-2 block tracking-widest">Global Analytics Console</span>
<h1 className="font-display-lg text-display-lg-mobile md:text-headline-md text-on-surface">Intelligence Overview</h1>
</div>
<div className="flex items-center gap-2 bg-eye-surface border border-eye-border p-1 rounded">
<button className="px-4 py-1.5 font-label-mono text-[10px] bg-surface-container-highest text-on-surface rounded">24H</button>
<button className="px-4 py-1.5 font-label-mono text-[10px] text-eye-text hover:text-on-surface">7D</button>
<button className="px-4 py-1.5 font-label-mono text-[10px] text-eye-text hover:text-on-surface">30D</button>
</div>
</div>
</header>
{/* Bento Grid Dashboard */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
{/* Large Callout: Cost Estimation (1x2) */}
<div className="bento-card md:col-span-1 md:row-span-2 p-8 flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-6">
<span className="font-label-mono text-label-mono text-eye-text uppercase">Projected OpEx</span>
<span className="material-symbols-outlined text-primary">payments</span>
</div>
<div className="space-y-1">
<span className="font-display-lg text-display-lg-mobile text-on-surface block">$14,204</span>
<span className="font-label-mono text-label-mono text-primary">+12.4% vs prev period</span>
</div>
</div>
<div className="mt-8 space-y-4">
<div className="flex justify-between items-center text-label-mono font-label-mono">
<span className="text-eye-text">API Compute</span>
<span className="text-on-surface">$8,400</span>
</div>
<div className="w-full bg-eye-border h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[60%]"></div>
</div>
<div className="flex justify-between items-center text-label-mono font-label-mono">
<span className="text-eye-text">Vector Storage</span>
<span className="text-on-surface">$5,804</span>
</div>
<div className="w-full bg-eye-border h-1.5 rounded-full overflow-hidden">
<div className="bg-primary/50 h-full w-[40%]"></div>
</div>
</div>
<div className="mt-auto pt-6 border-t border-eye-border">
<p className="font-body-sm text-body-sm text-eye-text leading-relaxed">
                        Operational efficiency is trending within the 95th percentile. Optimized routing enabled.
                    </p>
</div>
</div>
{/* Token Usage Chart (2x1) */}
<div className="bento-card md:col-span-2 p-6 flex flex-col">
<div className="flex justify-between items-center mb-8">
<div>
<h2 className="font-label-mono text-label-mono text-on-surface uppercase">Token Consumption</h2>
<p className="text-[10px] text-eye-text font-label-mono mt-1">Distributed across 12 node clusters</p>
</div>
<span className="material-symbols-outlined text-eye-text">bar_chart</span>
</div>
<div className="flex-grow flex items-end justify-between gap-2 px-2">
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary/20 hover:bg-primary/40 border-t border-primary/40 w-full rounded-t-sm bar-chart-rect" style={{height: '45%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-eye-text">MON</span>
</div>
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary/20 hover:bg-primary/40 border-t border-primary/40 w-full rounded-t-sm bar-chart-rect" style={{height: '65%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-eye-text">TUE</span>
</div>
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary w-full rounded-t-sm bar-chart-rect" style={{height: '85%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-on-surface">WED</span>
</div>
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary/20 hover:bg-primary/40 border-t border-primary/40 w-full rounded-t-sm bar-chart-rect" style={{height: '55%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-eye-text">THU</span>
</div>
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary/20 hover:bg-primary/40 border-t border-primary/40 w-full rounded-t-sm bar-chart-rect" style={{height: '75%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-eye-text">FRI</span>
</div>
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary/20 hover:bg-primary/40 border-t border-primary/40 w-full rounded-t-sm bar-chart-rect" style={{height: '40%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-eye-text">SAT</span>
</div>
<div className="flex flex-col items-center gap-3 w-full">
<div className="bg-primary/20 hover:bg-primary/40 border-t border-primary/40 w-full rounded-t-sm bar-chart-rect" style={{height: '30%', opacity: '1'}}></div>
<span className="font-label-mono text-[9px] text-eye-text">SUN</span>
</div>
</div>
</div>
{/* Latency Metrics (2x1) */}
<div className="bento-card md:col-span-2 p-6 flex flex-col overflow-visible">
<div className="flex justify-between items-center mb-4">
<div>
<h2 className="font-label-mono text-label-mono text-on-surface uppercase">System Latency</h2>
<div className="flex items-center gap-4 mt-1">
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
<span className="text-[10px] text-eye-text font-label-mono">Inference (ms)</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-1.5 h-1.5 rounded-full bg-eye-border-hover"></div>
<span className="text-[10px] text-eye-text font-label-mono">Database (ms)</span>
</div>
</div>
</div>
<div className="text-right">
<span className="font-label-mono text-headline-md text-on-surface">42<span className="text-body-sm font-body-sm text-eye-text ml-1">ms</span></span>
<p className="text-[9px] text-primary font-label-mono">Optimized</p>
</div>
</div>
<div className="flex-grow relative mt-4">
<svg className="w-full h-full min-h-[120px]" preserveAspectRatio="none" viewBox="0 0 400 100">
<path d="M0,80 Q50,75 100,50 T200,60 T300,20 T400,30" fill="none" stroke="#1A1A1C" stroke-width="2"></path>
<path className="line-graph-path" d="M0,90 Q50,85 100,60 T200,70 T300,30 T400,40" fill="none" stroke="#90d7ff" stroke-width="2.5"></path>
{/* Tooltip anchor */}
<circle className="animate-pulse" cx="300" cy="30" fill="#90d7ff" r="4"></circle>
</svg>
</div>
</div>
</div>
{/* System Architecture Visualization (Full Width Section) */}
<section className="mt-stack-lg">
<div className="bento-card p-12 overflow-hidden min-h-[400px] flex items-center justify-center relative">
<div className="absolute inset-0 opacity-20">
<div className="w-full h-full bg-cover bg-center" data-alt="Ultra-modern server farm interior at night with neon blue fiber optic cables flowing between sleek black server racks. Scientific researchers in minimalist white lab coats are monitoring holographic data displays. The lighting is low and atmospheric with sharp cinematic contrasts." style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC3jfpdDCCN0akq4SZcVLwizdNJ8sBxGCvYPRctwah7i1xMcsnK5JDE35MKNRGqX9lIW5i2FcPrOxUUWPWvqo0MUMQmP6NU1v-acGbER5aWX_utGp5J_R7AwypEKDcSQF2kDmZ_AvlFOfhf9OxJ4xG2KFYt5Sx1zPv5FkO2_0K0fot_Izn77pvz1Ye-nGg3iRmfCaK0yN2soFGC7vRdvBgc9UoaIxoqfE3ofvbo2FTLzOSRg04OuNQF-bCWSVJ0qbKEWxbVP5bSlPs')"}}></div>
</div>
<div className="relative z-10 text-center max-w-2xl">
<span className="font-label-mono text-label-mono text-primary mb-4 block">Infrastructure Health</span>
<h2 className="font-headline-md text-on-surface mb-6">Omni-Channel Intelligence Network</h2>
<p className="font-body-lg text-body-lg text-eye-text mb-8">
                        Our distributed infrastructure utilizes shard-based processing to deliver sub-millisecond response times across all global regions.
                    </p>
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
<div>
<p className="font-label-mono text-headline-md text-on-surface">99.99<span className="text-body-sm">%</span></p>
<p className="font-label-mono text-[10px] text-eye-text">UPTIME</p>
</div>
<div>
<p className="font-label-mono text-headline-md text-on-surface">1.2<span className="text-body-sm">PB</span></p>
<p className="font-label-mono text-[10px] text-eye-text">DATA SWAP</p>
</div>
<div>
<p className="font-label-mono text-headline-md text-on-surface">842</p>
<p className="font-label-mono text-[10px] text-eye-text">ACTIVE NODES</p>
</div>
<div>
<p className="font-label-mono text-headline-md text-on-surface">4.2<span className="text-body-sm">k</span></p>
<p className="font-label-mono text-[10px] text-eye-text">SEC OPS</p>
</div>
</div>
</div>
</div>
</section>
</main>
    </>
  );
}
