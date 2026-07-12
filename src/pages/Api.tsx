export function ApiPage() {
  return (
    <>
{/* TopNavBar */}
<header className="fixed top-0 w-full h-16 bg-[#050505]/60 backdrop-blur-xl border-b border-eye-border z-50">
<div className="flex justify-between items-center px-gutter max-w-container-max mx-auto h-full">
<div className="flex items-center gap-8">
<span className="font-display-lg text-display-lg-mobile md:text-headline-md tracking-tighter text-on-surface">EyeX</span>
<nav className="hidden md:flex gap-6 items-center">
<a className="text-eye-text hover:text-on-surface transition-colors duration-300" href="#">Network</a>
<a className="text-eye-text hover:text-on-surface transition-colors duration-300" href="#">Infrastructure</a>
<a className="text-eye-text hover:text-on-surface transition-colors duration-300" href="#">Security</a>
<a className="text-on-surface font-medium" href="#">Intelligence</a>
<a className="text-eye-text hover:text-on-surface transition-colors duration-300" href="#">Enterprise</a>
</nav>
</div>
<div className="flex items-center gap-4">
<button className="bg-[#FAFAFA] text-[#050505] px-5 py-2 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all active:scale-95">
                    Deploy Now
                </button>
</div>
</div>
</header>
{/* Background Atmospheric Orbs */}
<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
<div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary opacity-10 blur-[120px] rounded-full"></div>
<div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-primary opacity-5 blur-[120px] rounded-full"></div>
</div>
<main className="relative z-10 pt-24 pb-section-padding max-w-container-max mx-auto px-gutter">
{/* Header */}
<div className="mb-stack-lg">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<div className="flex items-center gap-2 mb-2">
<span className="font-label-mono text-label-mono text-primary uppercase tracking-widest">Developer Console</span>
<div className="h-[1px] w-12 bg-eye-border"></div>
</div>
<h1 className="font-headline-md text-headline-md text-on-surface mb-2">API Infrastructure</h1>
<p className="text-eye-text max-w-2xl">Manage your computational endpoints, monitor live traffic, and secure your enclave with enterprise-grade key management.</p>
</div>
<div className="flex items-center gap-3">
<div className="flex bg-eye-surface border border-eye-border rounded-lg p-1">
<button className="px-4 py-1.5 rounded text-on-surface bg-surface-container-highest transition-all font-medium text-xs">Production</button>
<button className="px-4 py-1.5 rounded text-eye-text hover:text-on-surface transition-all text-xs">Staging</button>
</div>
</div>
</div>
</div>
{/* Bento Grid Layout */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-md">
{/* Left Column: Tabs & Navigation */}
<div className="lg:col-span-3 flex flex-col gap-stack-md">
<div className="bg-eye-surface border border-eye-border rounded-xl p-4 overflow-hidden">
<div className="space-y-1">
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-container-high text-on-surface group transition-all">
<span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>key</span>
<span className="font-medium">API Keys</span>
<span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">3</span>
</button>
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-eye-text hover:bg-eye-border/50 hover:text-on-surface group transition-all">
<span className="material-symbols-outlined">analytics</span>
<span>Usage Logs</span>
</button>
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-eye-text hover:bg-eye-border/50 hover:text-on-surface group transition-all">
<span className="material-symbols-outlined">webhook</span>
<span>Webhooks</span>
</button>
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-eye-text hover:bg-eye-border/50 hover:text-on-surface group transition-all">
<span className="material-symbols-outlined">settings_input_component</span>
<span>Endpoints</span>
</button>
<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-eye-text hover:bg-eye-border/50 hover:text-on-surface group transition-all">
<span className="material-symbols-outlined">shield</span>
<span>Audit Trail</span>
</button>
</div>
</div>
<div className="bg-eye-surface border border-eye-border rounded-xl p-5 overflow-hidden relative group">
<div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
<span className="font-label-mono text-[10px] text-eye-text uppercase mb-4 block">System Status</span>
<div className="space-y-4 relative z-10">
<div className="flex items-center justify-between">
<span className="text-xs text-eye-text">Core Engine</span>
<div className="flex items-center gap-2">
<span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
<span className="text-xs text-on-surface">Stable</span>
</div>
</div>
<div className="flex items-center justify-between">
<span className="text-xs text-eye-text">Intelligence Mesh</span>
<div className="flex items-center gap-2">
<span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
<span className="text-xs text-on-surface">99.9%</span>
</div>
</div>
</div>
</div>
</div>
{/* Main Content Area: Key Manager */}
<div className="lg:col-span-9 flex flex-col gap-stack-md">
{/* Keys Section */}
<div className="bg-eye-surface border border-eye-border rounded-xl overflow-hidden">
<div className="p-6 border-b border-eye-border flex justify-between items-center">
<div>
<h2 className="text-on-surface font-medium">Access Keys</h2>
<p className="text-xs text-eye-text mt-1">Manage secret keys for authenticating with the EyeX API.</p>
</div>
<button className="border border-eye-border text-on-surface px-4 py-2 rounded-lg text-xs hover:border-primary/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.1)] transition-all active:scale-95 flex items-center gap-2">
<span className="material-symbols-outlined text-sm">add</span>
                            Create New Key
                        </button>
</div>
<div className="divide-y divide-eye-border">
{/* Key Item 1 */}
<div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
<span className="font-medium text-on-surface">Production_Main</span>
<span className="text-[10px] px-1.5 py-0.5 rounded border border-eye-border text-eye-text font-label-mono">READ/WRITE</span>
</div>
<div className="flex items-center gap-3 font-label-mono text-sm text-eye-text">
<code className="bg-[#050505] px-2 py-1 rounded border border-eye-border tracking-wider" id="key-1">sk_live_••••••••••••••••••••3a7b</code>
<div className="flex gap-2">
<button aria-label="Show API key" className="hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Copy API key" className="hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">content_copy</span>
</button>
</div>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="text-xs text-eye-text">Last used: 2 minutes ago</span>
<span className="text-[10px] text-eye-text/60">Created Oct 12, 2023</span>
</div>
</div>
{/* Key Item 2 */}
<div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
<div className="flex-1">
<div className="flex items-center gap-2 mb-1">
<span className="font-medium text-on-surface">Security_Audit_ReadOnly</span>
<span className="text-[10px] px-1.5 py-0.5 rounded border border-eye-border text-eye-text font-label-mono">READ_ONLY</span>
</div>
<div className="flex items-center gap-3 font-label-mono text-sm text-eye-text">
<code className="bg-[#050505] px-2 py-1 rounded border border-eye-border tracking-wider" id="key-2">sk_live_••••••••••••••••••••f921</code>
<div className="flex gap-2">
<button aria-label="Show API key" className="hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button aria-label="Copy API key" className="hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">content_copy</span>
</button>
</div>
</div>
</div>
<div className="flex flex-col items-end gap-1">
<span className="text-xs text-eye-text">Last used: 4 hours ago</span>
<span className="text-[10px] text-eye-text/60">Created Jan 05, 2024</span>
</div>
</div>
</div>
</div>
{/* Live Console Window */}
<div className="bg-[#050505] border border-eye-border rounded-xl overflow-hidden shadow-2xl">
<div className="bg-eye-surface px-4 py-3 border-b border-eye-border flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="flex gap-1.5">
<div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
<div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
<div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
</div>
<span className="ml-4 font-label-mono text-[11px] text-eye-text uppercase flex items-center gap-2">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                                Real-time Traffic Logs
                            </span>
</div>
<div className="flex items-center gap-4">
<span className="font-label-mono text-[11px] text-eye-text">1.2ms Avg Latency</span>
<button aria-label="Filter traffic logs" className="text-eye-text hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-sm">filter_list</span>
</button>
</div>
</div>
<div className="p-4 h-[400px] font-label-mono text-[13px] leading-relaxed console-scrollbar overflow-y-auto overflow-x-hidden space-y-1.5" style={{fontFamily: "'JetBrains Mono', monospace"}}>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:31.421</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">POST</span>
<span className="text-primary truncate">/v1/intelligence/mesh/broadcast</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281a</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:31.109</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">GET</span>
<span className="text-primary truncate">/v1/infrastructure/enclave/status</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281b</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:30.887</span>
<span className="text-yellow-400 font-medium shrink-0">401 ERR</span>
<span className="text-[#888] shrink-0">GET</span>
<span className="text-primary truncate">/v1/security/keys/audit</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity italic">invalid_token</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:29.502</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">POST</span>
<span className="text-primary truncate">/v1/intelligence/analysis/compute</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281c</span>
</div>
<div className="flex gap-4 group bg-red-500/5 -mx-4 px-4 py-0.5 border-y border-red-500/10">
<span className="text-eye-text shrink-0">14:02:28.112</span>
<span className="text-red-500 font-medium shrink-0">500 ERR</span>
<span className="text-[#888] shrink-0">POST</span>
<span className="text-primary truncate">/v1/network/gateway/tunnel</span>
<span className="ml-auto text-red-400 opacity-80 transition-opacity">upstream_timeout</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:27.994</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">GET</span>
<span className="text-primary truncate">/v1/account/billing/usage</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281d</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:27.101</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">POST</span>
<span className="text-primary truncate">/v1/intelligence/mesh/broadcast</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281e</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:26.544</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">GET</span>
<span className="text-primary truncate">/v1/infrastructure/nodes/list</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281f</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:25.210</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">GET</span>
<span className="text-primary truncate">/v1/intelligence/models/available</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9281g</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:24.887</span>
<span className="text-yellow-400 font-medium shrink-0">404 ERR</span>
<span className="text-[#888] shrink-0">GET</span>
<span className="text-primary truncate">/v1/legacy/v0/deprecated_endpoint</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">not_found</span>
</div>
<div className="flex gap-4 group">
<span className="text-eye-text shrink-0">14:02:23.421</span>
<span className="text-green-400 font-medium shrink-0">200 OK</span>
<span className="text-[#888] shrink-0">POST</span>
<span className="text-primary truncate">/v1/intelligence/mesh/broadcast</span>
<span className="ml-auto text-eye-text opacity-0 group-hover:opacity-100 transition-opacity">id: tr_9282a</span>
</div>
</div>
<div className="bg-eye-surface border-t border-eye-border p-3 flex items-center gap-3">
<span className="material-symbols-outlined text-eye-text text-sm">terminal</span>
<input className="bg-transparent border-none focus:ring-0 text-xs w-full text-on-surface placeholder:text-eye-text/50 font-label-mono" placeholder="Search logs or filter by status..." type="text" />
</div>
</div>
</div>
</div>
</main>
    </>
  );
}
