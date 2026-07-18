export function ApiPage() {
  return (
    <>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary opacity-10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-primary opacity-5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 pt-24 pb-32 max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16" data-fade-up>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Developer Console</span>
            <div className="h-px w-12 bg-eye-border" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-medium text-eye-white tracking-tight mb-2">API Infrastructure</h1>
          <p className="text-eye-text font-light max-w-2xl">Manage your computational endpoints, monitor live traffic, and secure your enclave with enterprise-grade key management.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bento-card rounded-xl p-4" data-fade-up>
              <div className="space-y-1">
                {[
                  { icon: "key", label: "API Keys", badge: "3", active: true },
                  { icon: "analytics", label: "Usage Logs" },
                  { icon: "webhook", label: "Webhooks" },
                  { icon: "settings_input_component", label: "Endpoints" },
                  { icon: "shield", label: "Audit Trail" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      item.active
                        ? "bg-white/5 text-eye-white"
                        : "text-eye-text hover:bg-eye-border/30 hover:text-eye-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="bento-card rounded-xl p-5 relative group" data-fade-up>
              <span className="text-[10px] font-bold uppercase tracking-wider text-eye-text mb-4 block">System Status</span>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-eye-text">Core Engine</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-xs text-eye-white">Stable</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-eye-text">Intelligence Mesh</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-xs text-eye-white">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* Keys */}
            <div className="bento-card rounded-xl overflow-hidden" data-fade-up>
              <div className="p-6 border-b border-eye-border flex justify-between items-center">
                <div>
                  <h2 className="text-eye-white font-medium">Access Keys</h2>
                  <p className="text-xs text-eye-text mt-1 font-light">Manage secret keys for authenticating with the EyeX API.</p>
                </div>
                <button className="luminous-btn-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">add</span>
                  Create New Key
                </button>
              </div>
              <div className="divide-y divide-eye-border">
                {[
                  { name: "Production_Main", perm: "READ/WRITE", key: "sk_live_••••••••••••••••••••3a7b", used: "2 minutes ago", created: "Oct 12, 2023" },
                  { name: "Security_Audit_ReadOnly", perm: "READ_ONLY", key: "sk_live_••••••••••••••••••••f921", used: "4 hours ago", created: "Jan 05, 2024" },
                ].map((k) => (
                  <div key={k.name} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-eye-white">{k.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-eye-border text-eye-text font-mono">{k.perm}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-xs text-eye-text">
                        <code className="bg-eye-bg px-2 py-1 rounded border border-eye-border">{k.key}</code>
                        <button className="hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-eye-text">Last used: {k.used}</span>
                      <span className="text-[10px] text-eye-text/60">Created {k.created}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Console */}
            <div className="bg-[#050505] bento-card rounded-xl overflow-hidden" data-fade-up>
              <div className="bg-eye-surface px-4 py-3 border-b border-eye-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                  </div>
                  <span className="ml-4 font-mono text-[11px] text-eye-text uppercase flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    Real-time Traffic Logs
                  </span>
                </div>
                <span className="font-mono text-[11px] text-eye-text">1.2ms Avg Latency</span>
              </div>
              <div className="p-4 h-[400px] font-mono text-xs leading-relaxed overflow-y-auto space-y-1">
                {[
                  { ts: "14:02:31.421", status: "200", code: "OK", method: "POST", path: "/v1/intelligence/mesh/broadcast" },
                  { ts: "14:02:31.109", status: "200", code: "OK", method: "GET", path: "/v1/infrastructure/enclave/status" },
                  { ts: "14:02:30.887", status: "401", code: "ERR", method: "GET", path: "/v1/security/keys/audit", highlight: true },
                  { ts: "14:02:29.502", status: "200", code: "OK", method: "POST", path: "/v1/intelligence/analysis/compute" },
                  { ts: "14:02:28.112", status: "500", code: "ERR", method: "POST", path: "/v1/network/gateway/tunnel", error: true },
                  { ts: "14:02:27.994", status: "200", code: "OK", method: "GET", path: "/v1/account/billing/usage" },
                  { ts: "14:02:27.101", status: "200", code: "OK", method: "POST", path: "/v1/intelligence/mesh/broadcast" },
                  { ts: "14:02:26.544", status: "200", code: "OK", method: "GET", path: "/v1/infrastructure/nodes/list" },
                  { ts: "14:02:25.210", status: "200", code: "OK", method: "GET", path: "/v1/intelligence/models/available" },
                  { ts: "14:02:24.887", status: "404", code: "ERR", method: "GET", path: "/v1/legacy/v0/deprecated_endpoint", highlight: true },
                ].map((log, i) => {
                  let statusClass = "text-green-400";
                  if (log.status.startsWith("4")) statusClass = "text-yellow-400";
                  if (log.status.startsWith("5")) statusClass = "text-red-500";
                  const bgClass = log.error ? "bg-red-500/5 -mx-4 px-4 py-0.5 border-y border-red-500/10" : "";

                  return (
                    <div key={i} className={`flex gap-4 group ${bgClass}`}>
                      <span className="text-eye-text shrink-0">{log.ts}</span>
                      <span className={`${statusClass} font-medium shrink-0`}>{log.status} {log.code}</span>
                      <span className="text-[#888] shrink-0">{log.method}</span>
                      <span className="text-primary truncate">{log.path}</span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-eye-surface border-t border-eye-border p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-eye-text text-sm">terminal</span>
                <input
                  className="bg-transparent border-none focus:ring-0 text-xs w-full text-eye-white placeholder:text-eye-text/50 font-mono outline-none"
                  placeholder="Search logs or filter by status..."
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
