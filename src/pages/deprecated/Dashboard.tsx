export function DashboardPage() {
  return (
    <>
      {/* Fixed Sidebar Navigation */}
      <nav className="w-[240px] flex-shrink-0 border-r border-border bg-background flex flex-col h-full py-6">
        <div className="px-6 mb-10 flex items-center gap-2">
          <div className="h-6 w-6 flex items-center justify-center overflow-hidden rounded-sm">
            <img
              alt="EyeX Infinity Core Logo"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AP1WRLs3QIR8bz_KeO6mBtkKGaJ0z1O7nOO4knQsxU4j_m0kEq0rJeN0jL3P30sKhRnkTRHsos4yyjXi4oXThdw7EyPRe5_I_MvI48WlQ_vnr_LVkOosOcI_CzAOSau72FYBsR3SyHVn8eGNxxuOrh18T_txLPsUfDShYcX67Qtd5DdXEXrjzz3CUfxqvb0734jgWeCuWvgujX5Imsyn3oRHJsCr7ywDyrbErLXgpAtQ_q41KRQ2FXCvfTH9VA"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-white leading-none">
              EYEX
            </span>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider leading-none mt-1">
              Technologies
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 space-y-0.5">
          <a
            className="nav-link active flex items-center gap-3 px-3 py-2 text-text-main rounded-md"
            href="#"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              dashboard
            </span>
            <span className="font-medium">Dashboard</span>
          </a>
          <a
            className="nav-link flex items-center gap-3 px-3 py-2 text-text-muted rounded-md"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="font-medium">AI Chat</span>
          </a>
          <a
            className="nav-link flex items-center gap-3 px-3 py-2 text-text-muted rounded-md"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            <span className="font-medium">AI Agents</span>
          </a>
          <a
            className="nav-link flex items-center gap-3 px-3 py-2 text-text-muted rounded-md"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">description</span>
            <span className="font-medium">Documents</span>
          </a>
          <a
            className="nav-link flex items-center gap-3 px-3 py-2 text-text-muted rounded-md"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">api</span>
            <span className="font-medium">API Platform</span>
          </a>
          <a
            className="nav-link flex items-center gap-3 px-3 py-2 text-text-muted rounded-md"
            href="#"
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            <span className="font-medium">Analytics</span>
          </a>
        </div>
        <div className="px-3 mt-auto">
          <div className="flex items-center gap-3 p-3 border-t border-border mt-4">
            <div className="w-8 h-8 rounded-sm bg-surface flex items-center justify-center border border-border">
              <span className="text-[10px] font-mono font-bold text-accent">AU</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-xs text-text-main">Admin User</span>
              <span className="text-text-muted text-[10px] font-mono">ID: EX-8921</span>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-border px-8 py-5 flex items-center justify-between bg-background z-10">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Dashboard</h1>
            <p className="text-text-muted mt-0.5 font-mono text-[10px] uppercase tracking-wider">
              Status: <span className="text-white">Synchronized</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bento-card w-9 h-9 flex items-center justify-center rounded-md text-text-muted hover:text-white hover:bg-surface">
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
            <button className="bg-accent hover:bg-accent/90 text-black px-4 h-9 rounded-md font-semibold text-xs flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[16px] font-bold">add</span>
              Deploy Agent
            </button>
          </div>
        </header>
        {/* Scrollable Grid Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
            {/* Top Row: Metrics (4 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="bento-card rounded-lg p-5 flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                    Total API Calls
                  </span>
                  <span className="material-symbols-outlined text-text-muted text-[18px]">
                    monitoring
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-white">1.2M</span>
                  <span className="text-white text-[10px] font-mono opacity-60">+14%</span>
                </div>
              </div>
              {/* Metric 2 */}
              <div className="bento-card rounded-lg p-5 flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                    Token Usage (24h)
                  </span>
                  <span className="material-symbols-outlined text-text-muted text-[18px]">
                    toll
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-white">4.5M</span>
                  <span className="text-white text-[10px] font-mono opacity-60">-2.1%</span>
                </div>
              </div>
              {/* Metric 3 */}
              <div className="bento-card rounded-lg p-5 flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                    Active Agents
                  </span>
                  <span className="material-symbols-outlined text-text-muted text-[18px]">hub</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-white">12</span>
                  <span className="text-text-muted text-[10px] font-mono">/ 20 Limit</span>
                </div>
              </div>
              {/* Metric 4 */}
              <div className="bento-card rounded-lg p-5 flex flex-col justify-between h-[120px]">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                    Avg Latency
                  </span>
                  <span className="material-symbols-outlined text-text-muted text-[18px]">
                    speed
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold tracking-tight text-white">240</span>
                  <span className="text-text-muted text-[10px] font-mono">ms</span>
                </div>
              </div>
            </div>
            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
              {/* Activity Feed (Spans 2 cols) */}
              <div className="bento-card rounded-lg col-span-1 lg:col-span-2 flex flex-col overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-surface">
                  <h2 className="font-medium text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    Recent Activity
                  </h2>
                  <a
                    className="text-[10px] text-text-muted hover:text-white transition-colors font-mono uppercase tracking-wider"
                    href="#"
                  >
                    View Logs
                  </a>
                </div>
                <div className="flex-1 overflow-y-auto bg-background">
                  {/* Dense Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-[10px] font-mono text-text-muted uppercase tracking-wider sticky top-0 bg-background z-10">
                    <div className="col-span-3">Agent</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-4">Action</div>
                    <div className="col-span-3 text-right">Timestamp</div>
                  </div>
                  {/* Table Rows */}
                  <div className="flex flex-col">
                    {/* Row 1 */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border items-center hover:bg-surface transition-colors group">
                      <div className="col-span-3 font-medium text-white truncate flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                        DataExtractor-v2
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-mono bg-white/5 text-text-main border border-border">
                          Success
                        </span>
                      </div>
                      <div className="col-span-4 text-text-muted text-xs truncate">
                        Processed 14 RAG chunks
                      </div>
                      <div className="col-span-3 text-right font-mono text-[11px] text-text-muted group-hover:text-white transition-colors">
                        10:42:15.002Z
                      </div>
                    </div>
                    {/* Synchronizing state (Functional, no glass) */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border items-center relative overflow-hidden group bg-surface/30">
                      <div className="absolute inset-0 bg-background/80 z-20 flex items-center px-5 gap-4">
                        <div className="w-4 h-4 functional-pulse">
                          <img
                            alt="Syncing"
                            className="w-full h-full object-contain grayscale opacity-60"
                            src="https://lh3.googleusercontent.com/aida/AP1WRLs3QIR8bz_KeO6mBtkKGaJ0z1O7nOO4knQsxU4j_m0kEq0rJeN0jL3P30sKhRnkTRHsos4yyjXi4oXThdw7EyPRe5_I_MvI48WlQ_vnr_LVkOosOcI_CzAOSau72FYBsR3SyHVn8eGNxxuOrh18T_txLPsUfDShYcX67Qtd5DdXEXrjzz3CUfxqvb0734jgWeCuWvgujX5Imsyn3oRHJsCr7ywDyrbErLXgpAtQ_q41KRQ2FXCvfTH9VA"
                          />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">
                          Synchronizing...
                        </span>
                      </div>
                      <div className="col-span-3 font-medium text-white/20 truncate">
                        SupportBot_Prod
                      </div>
                      <div className="col-span-2">
                        <div className="h-4 w-12 bg-white/5 rounded-sm"></div>
                      </div>
                      <div className="col-span-4">
                        <div className="h-3 w-40 bg-white/5 rounded-sm"></div>
                      </div>
                      <div className="col-span-3 text-right">
                        <div className="h-3 w-16 bg-white/5 rounded-sm ml-auto"></div>
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border items-center hover:bg-surface transition-colors group">
                      <div className="col-span-3 font-medium text-white truncate flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                        CodeReviewer_Alpha
                      </div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-mono bg-white/5 text-text-main border border-border">
                          Success
                        </span>
                      </div>
                      <div className="col-span-4 text-text-muted text-xs truncate">
                        Generated PR summary
                      </div>
                      <div className="col-span-3 text-right font-mono text-[11px] text-text-muted group-hover:text-white transition-colors">
                        10:41:03.991Z
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* System Status Panel (1 col) */}
              <div className="bento-card rounded-lg col-span-1 flex flex-col">
                <div className="px-5 py-4 border-b border-border bg-surface">
                  <h2 className="font-medium text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">memory</span>
                    Utilization
                  </h2>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-6 justify-center bg-background">
                  {/* GPU Usage */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider font-mono">
                      <span className="text-text-muted">Compute Cluster</span>
                      <span className="text-white">78%</span>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-white opacity-80 w-[78%]"></div>
                    </div>
                  </div>
                  {/* Vector DB */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider font-mono">
                      <span className="text-text-muted">Storage</span>
                      <span className="text-white">42%</span>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-white opacity-40 w-[42%]"></div>
                    </div>
                  </div>
                  {/* API Rate Limit */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-2 uppercase tracking-wider font-mono">
                      <span className="text-text-muted">Rate Limit</span>
                      <span className="text-white">15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
