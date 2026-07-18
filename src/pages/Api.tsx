import {
  Key,
  Plus,
  LayoutDashboard,
  FileText,
  Activity,
  Settings,
  Copy,
  MoreVertical,
  Trash2,
  Pause,
  Download,
  X,
  Database,
} from "lucide-react";

export function ApiPage() {
  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Ambient Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-brand opacity-[0.08] blur-[80px] rounded-full pointer-events-none z-[-1]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-brand opacity-[0.08] blur-[80px] rounded-full pointer-events-none z-[-1]" />

      {/* Side Navigation */}
      <aside className="hidden md:flex flex-col h-full w-[280px] bg-eye-surface border-r border-eye-border py-8 px-6 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-primary-brand rounded-sm flex items-center justify-center">
            <Database className="text-eye-bg font-bold w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white uppercase">QORX</span>
            <span className="text-[10px] text-eye-text font-mono">Analytic Core</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all group"
            href="#"
          >
            <LayoutDashboard className="group-hover:text-primary-brand w-5 h-5" />
            <span className="text-sm">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-brand border-l-2 border-primary-brand bg-surface-container-low transition-all"
            href="#"
          >
            <Key className="w-5 h-5" />
            <span className="text-sm font-bold">API Management</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all group"
            href="#"
          >
            <FileText className="group-hover:text-primary-brand w-5 h-5" />
            <span className="text-sm">Documentation</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all group"
            href="#"
          >
            <Activity className="group-hover:text-primary-brand w-5 h-5" />
            <span className="text-sm">System Health</span>
          </a>
        </nav>
        <div className="pt-8 mt-8 border-t border-eye-border">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-on-surface-variant hover:bg-surface-container transition-all group">
            <Settings className="group-hover:text-primary-brand w-5 h-5" />
            <span className="text-sm">Settings</span>
          </button>
          <div className="mt-6 p-4 rounded-xl glass-panel flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCADlX9fn0WkHCWmyDGh8WzHmcD4apoXdAtufXqEkhWuXG3yx9tYqxBPHKklvJNhNeLad44KiUD-3AUZBPCeXybO1-u7-oazruKGqa2uB0Ft0RQ84p3Ce1ZYEtz-NwPTOmcoy5_rDiJlzGd20mJ2m-Gg_14Nv6bBheXqGC6IpbO_6Z7SNmg4KGvDHgBqbQTDVAXs1SYbffGt-jyNe_v5YegEjsu4ocgyGfUxWnkPWbVBdR0ifzM-Zxws7dIfvp-Lfunjk897pd8Plc"
                alt="Admin avatar"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Admin Core</span>
              <span className="text-[10px] text-eye-text">v2.4.1-stable</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
        {/* Top App Bar */}
        <header className="h-20 flex items-center justify-between px-8 bg-eye-bg/60 backdrop-blur-md sticky top-0 z-40 border-b border-eye-border">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">API Management</h1>
            <p className="text-sm text-eye-text">Provision and audit secure access keys</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white text-eye-bg px-6 py-2.5 rounded-sm font-bold text-sm hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center gap-2">
              <Plus className="text-sm w-4 h-4" />
              Generate New Key
            </button>
          </div>
        </header>

        <div className="p-8 max-w-[1200px] mx-auto w-full space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-fade-up>
            <div className="glass-panel p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-eye-text text-[10px]">TOTAL REQUESTS</span>
                <Activity className="text-primary-brand w-5 h-5" />
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold text-white">8.4M</span>
                <span className="text-xs text-green-400 mb-1">+12.4%</span>
              </div>
              <div className="h-1.5 w-full bg-eye-border rounded-full overflow-hidden">
                <div className="h-full bg-primary-brand w-[65%] rounded-full" />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-eye-text">Usage: 6.5k / 10k req/m</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-eye-text text-[10px]">AVG LATENCY (MS)</span>
                <Activity className="text-primary-brand w-5 h-5" />
              </div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-bold text-white">124</span>
                <span className="text-xs text-blue-400 mb-1">Optimal</span>
              </div>
              <div className="h-10 flex items-end gap-1">
                <div className="w-full bg-eye-border h-4 rounded-t-sm" />
                <div className="w-full bg-eye-border h-6 rounded-t-sm" />
                <div className="w-full bg-primary-brand/40 h-8 rounded-t-sm" />
                <div className="w-full bg-primary-brand h-5 rounded-t-sm" />
                <div className="w-full bg-primary-brand/60 h-7 rounded-t-sm" />
                <div className="w-full bg-eye-border h-3 rounded-t-sm" />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-sm border-l-4 border-l-red-500/50">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-eye-text text-[10px]">ERROR RATE (%)</span>
                <X className="text-red-400 w-5 h-5" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-white">0.04%</span>
                <span className="text-xs text-red-400 mb-1">Critical</span>
              </div>
              <p className="text-[10px] text-eye-text mt-4">
                24 failed handshakes in last 1h
              </p>
            </div>
          </div>

          {/* API Key Section */}
          <div data-fade-up>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-brand rounded-full" />
                ACTIVE SECURITY TOKENS
              </h2>
              <span className="font-mono text-[10px] text-eye-text uppercase">
                Displaying 3 of 12
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Key Card 1 */}
              <div className="glass-panel p-6 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Key className="text-6xl w-16 h-16" />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Production - Edge Mesh
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 uppercase font-bold tracking-wider">
                      Active
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/5 rounded text-eye-text hover:text-white transition-colors">
                      <Copy className="text-lg w-5 h-5" />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded text-eye-text hover:text-white transition-colors">
                      <MoreVertical className="text-lg w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="font-mono text-xs text-white/90 bg-eye-bg p-2 block rounded border border-eye-border select-all">
                    eyex_live_••••••••••••x7a9
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-eye-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-eye-text">RATE LIMIT</span>
                    <span className="text-xs font-bold text-white">10,000 REQ/MIN</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-eye-text">CREATED</span>
                    <span className="text-xs text-white">24 OCT 2023</span>
                  </div>
                </div>
              </div>

              {/* Key Card 2 */}
              <div className="glass-panel p-6 rounded-sm relative overflow-hidden group border-primary-brand/30">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity text-primary-brand">
                  <Key className="text-6xl w-16 h-16" />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Staging - Intel Core
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary-brand/10 text-primary-brand border border-primary-brand/20 uppercase font-bold tracking-wider">
                      Active
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/5 rounded text-eye-text hover:text-white transition-colors">
                      <Copy className="text-lg w-5 h-5" />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded text-eye-text hover:text-white transition-colors">
                      <MoreVertical className="text-lg w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="font-mono text-xs text-white/90 bg-eye-bg p-2 block rounded border border-eye-border select-all">
                    eyex_dev_••••••••••••p2r1
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-eye-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-eye-text">RATE LIMIT</span>
                    <span className="text-xs font-bold text-white">2,500 REQ/MIN</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-eye-text">CREATED</span>
                    <span className="text-xs text-white">12 NOV 2023</span>
                  </div>
                </div>
              </div>

              {/* Key Card 3 - Revoked */}
              <div className="glass-panel p-6 rounded-sm relative overflow-hidden group opacity-60">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity text-red-500">
                  <Key className="text-6xl w-16 h-16" />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      Legacy - Cloud Sync
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 uppercase font-bold tracking-wider">
                      Revoked
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/5 rounded text-eye-text transition-colors cursor-not-allowed">
                      <Trash2 className="text-lg w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="font-mono text-xs text-eye-text bg-eye-bg p-2 block rounded border border-eye-border line-through">
                    eyex_old_••••••••••••a1b2
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-eye-border">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-eye-text">RATE LIMIT</span>
                    <span className="text-xs font-bold text-eye-text">DISABLED</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-eye-text">REVOKED</span>
                    <span className="text-xs text-white">05 JAN 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Traffic Stream */}
          <div
            className="glass-panel rounded-sm overflow-hidden flex flex-col border border-primary-brand/20 shadow-[0_0_40px_rgba(56,189,248,0.05)]"
            data-fade-up
          >
            <div className="bg-eye-surface px-6 py-4 border-b border-eye-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                    Live Traffic Stream
                  </h3>
                </div>
                <div className="h-4 w-px bg-eye-border" />
                <span className="font-mono text-[10px] text-eye-text">CLUSTER: HKG-01</span>
              </div>
              <div className="flex gap-3">
                <button className="text-eye-text hover:text-white transition-colors">
                  <Pause className="text-lg w-5 h-5" />
                </button>
                <button className="text-eye-text hover:text-white transition-colors">
                  <Download className="text-lg w-5 h-5" />
                </button>
                <button className="text-eye-text hover:text-white transition-colors">
                  <X className="text-lg w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="bg-eye-bg p-6 h-[400px] overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed">
              <div className="flex items-center gap-4 py-1.5 opacity-90 border-b border-white/[0.02]">
                <span className="text-eye-text w-32 shrink-0">[14:02:41.002]</span>
                <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold w-14 text-center">
                  GET
                </span>
                <span className="text-white shrink-0">/v1/network/nodes</span>
                <span className="text-eye-text italic shrink-0">124ms</span>
                <span className="text-green-400 font-bold ml-auto">200 OK</span>
              </div>
              <div className="flex items-center gap-4 py-1.5 opacity-90 border-b border-white/[0.02]">
                <span className="text-eye-text w-32 shrink-0">[14:02:41.481]</span>
                <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold w-14 text-center">
                  POST
                </span>
                <span className="text-white shrink-0">/v1/auth/provision</span>
                <span className="text-eye-text italic shrink-0">312ms</span>
                <span className="text-green-400 font-bold ml-auto">201 CREATED</span>
              </div>
              <div className="flex items-center gap-4 py-1.5 opacity-90 border-b border-white/[0.02]">
                <span className="text-eye-text w-32 shrink-0">[14:02:42.115]</span>
                <span className="bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-bold w-14 text-center">
                  DEL
                </span>
                <span className="text-white shrink-0">/v1/cluster/0xf291</span>
                <span className="text-eye-text italic shrink-0">45ms</span>
                <span className="text-red-400 font-bold ml-auto">403 FORBIDDEN</span>
              </div>
              <div className="flex items-center gap-4 py-1.5 opacity-90 border-b border-white/[0.02]">
                <span className="text-eye-text w-32 shrink-0">[14:02:42.990]</span>
                <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold w-14 text-center">
                  GET
                </span>
                <span className="text-white shrink-0">/v1/telemetry/health</span>
                <span className="text-eye-text italic shrink-0">12ms</span>
                <span className="text-green-400 font-bold ml-auto">200 OK</span>
              </div>
              <div className="flex items-center gap-4 py-1.5 opacity-90 border-b border-white/[0.02]">
                <span className="text-eye-text w-32 shrink-0">[14:02:43.042]</span>
                <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold w-14 text-center">
                  GET
                </span>
                <span className="text-white shrink-0">/v1/network/topology</span>
                <span className="text-eye-text italic shrink-0">198ms</span>
                <span className="text-green-400 font-bold ml-auto">200 OK</span>
              </div>
              <div className="flex items-center gap-4 py-1.5 opacity-90 border-b border-white/[0.02]">
                <span className="text-eye-text w-32 shrink-0">[14:02:44.221]</span>
                <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold w-14 text-center">
                  POST
                </span>
                <span className="text-white shrink-0">/v1/events/ingest</span>
                <span className="text-eye-text italic shrink-0">210ms</span>
                <span className="text-green-400 font-bold ml-auto">202 ACCEPTED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <footer className="p-8 mt-auto border-t border-eye-border bg-eye-surface/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[10px] text-eye-text">SECURITY ENCLAVE</span>
                <span className="text-xs font-bold text-white">AES-256 GCM Active</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-eye-text">GLOBAL UPTIME</span>
                <span className="text-xs font-bold text-green-400">99.9992%</span>
              </div>
            </div>
            <div className="text-[10px] text-eye-text flex items-center gap-2">
              <span>&copy; 2024 EYEX TECHNOLOGIES INC.</span>
              <span className="h-1 w-1 bg-eye-text rounded-full" />
              <a className="hover:text-primary-brand" href="#">
                TERMS OF SERVICE
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
