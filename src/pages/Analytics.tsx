import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Bell,
  HelpCircle,
  Calendar,
  BarChart3,
  Download,
  ChevronDown,
  FileText,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Activity,
} from "lucide-react";

export function AnalyticsPage() {
  return (
    <>
      {/* SIDE NAVIGATION */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-eye-border bg-eye-bg flex flex-col py-6 z-[60]">
        <div className="px-6 mb-10">
          <h1 className="text-2xl tracking-tighter leading-none font-medium" style={{ fontFamily: "var(--font-display)" }}>
            EyeX Pro
          </h1>
          <p className="font-mono text-xs text-eye-text mt-1" style={{ fontFamily: "var(--font-mono)" }}>
            Enterprise BI
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center px-6 py-3 text-primary font-bold border-r-2 border-primary bg-primary/5 transition-all duration-300" href="#">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>Dashboard</span>
          </a>
          <a className="flex items-center px-6 py-3 text-eye-text hover:text-white hover:bg-eye-surface transition-colors duration-200" href="#">
            <Activity className="w-5 h-5 mr-3" />
            <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>Analytics</span>
          </a>
          <a className="flex items-center px-6 py-3 text-eye-text hover:text-white hover:bg-eye-surface transition-colors duration-200" href="#">
            <MessageSquare className="w-5 h-5 mr-3" />
            <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>AI Chat</span>
          </a>
          <a className="flex items-center px-6 py-3 text-eye-text hover:text-white hover:bg-eye-surface transition-colors duration-200" href="#">
            <FileText className="w-5 h-5 mr-3" />
            <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>Documents</span>
          </a>
          <a className="flex items-center px-6 py-3 text-eye-text hover:text-white hover:bg-eye-surface transition-colors duration-200" href="#">
            <Settings className="w-5 h-5 mr-3" />
            <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>Settings</span>
          </a>
        </nav>
        <div className="px-6 mt-auto">
          <button className="w-full bg-[#FAFAFA] text-[#050505] py-3 rounded font-mono text-xs hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all" style={{ fontFamily: "var(--font-mono)" }}>
            Upgrade Power
          </button>
        </div>
      </aside>

      {/* TOP NAVIGATION */}
      <header className="fixed top-0 right-0 h-16 border-b border-eye-border backdrop-blur-md flex justify-between items-center px-6 w-[calc(100%-16rem)] ml-64 z-50 bg-eye-bg/60">
        <div className="flex items-center gap-4">
          <span className="text-lg text-white" style={{ fontFamily: "var(--font-display)" }}>
            EyeX Analytics
          </span>
          <div className="h-4 w-[1px] bg-eye-border mx-2" />
          <div className="flex items-center bg-eye-surface border border-eye-border rounded px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary transition-all">
            <Search className="w-4 h-4 text-eye-text mr-2" />
            <input className="bg-transparent border-none focus:ring-0 text-sm text-white w-48 placeholder:text-eye-text" style={{ fontFamily: "var(--font-body)" }} placeholder="Search Systems" type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button aria-label="Notifications" className="text-eye-text hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button aria-label="Help" className="text-eye-text hover:text-primary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#78d1ff] overflow-hidden border border-eye-border">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDitNiwCP6Zy0ae-XXZ6CuzvnT7TjqAJ_cfSsKnanxxWVIY9EMNRx0b4NgMTeeeDH_VKoRUZmzmii38J8Wnz20qxbxagVFYiysMnM0flG9tscqVd1vYMAJPDAlKyGKkV3iYiV_hlECExrC0Im0rAxOfzfMUFyoAT9ezZQ92s81pii4Q_S2r_zYY-icRub07TQQ9N6uGKZW-2GgryBJoqI_qdwOzhWo2bcSJ1f3o0ym67l7DnuPB7eGfAXQSv3a_QdIKHYNTPkbje1E" alt="User avatar" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="ml-64 pt-16 min-h-screen">
        {/* FILTER BAR */}
        <div className="sticky top-16 z-40 px-6 py-4 border-b border-eye-border bg-eye-bg/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded cursor-pointer transition-all">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>Last 30 Days</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded cursor-pointer transition-all">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>All Metrics</span>
              <ChevronDown className="w-4 h-4 text-white" />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-eye-border rounded font-mono text-xs hover:border-primary hover:text-primary transition-all" style={{ fontFamily: "var(--font-mono)" }}>
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
          {/* AMBIENT GLOWS */}
          <div className="fixed top-1/4 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] pointer-events-none -z-10" />
          <div className="fixed bottom-1/4 left-64 w-[300px] h-[300px] bg-primary/5 blur-[100px] pointer-events-none -z-10" />

          {/* KPI SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sessions */}
            <div data-fade-up className="bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded-lg p-6 relative overflow-hidden transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-mono text-xs text-eye-text uppercase" style={{ fontFamily: "var(--font-mono)" }}>Sessions</p>
                  <h3 className="text-3xl font-medium text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>1.2M</h3>
                </div>
                <span className="text-[#38BDF8] font-mono text-[10px] flex items-center bg-[#38BDF8]/10 px-2 py-0.5 rounded" style={{ fontFamily: "var(--font-mono)" }}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.4%
                </span>
              </div>
              <div className="w-full h-12 mt-2">
                <svg className="w-full h-full" viewBox="0 0 200 40">
                  <path className="sparkline" d="M0,35 Q20,32 40,30 T80,15 T120,25 T160,10 T200,5" fill="none" stroke="#38BDF8" strokeWidth="2" />
                  <path d="M0,35 Q20,32 40,30 T80,15 T120,25 T160,10 T200,5 L200,40 L0,40 Z" fill="url(#grad-blue)" opacity="0.1" />
                  <defs>
                    <linearGradient id="grad-blue" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="1" />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Bounce Rate */}
            <div data-fade-up className="bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded-lg p-6 relative overflow-hidden transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-mono text-xs text-eye-text uppercase" style={{ fontFamily: "var(--font-mono)" }}>Bounce Rate</p>
                  <h3 className="text-3xl font-medium text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>42.8%</h3>
                </div>
                <span className="text-[#4ade80] font-mono text-[10px] flex items-center bg-[#4ade80]/10 px-2 py-0.5 rounded" style={{ fontFamily: "var(--font-mono)" }}>
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -2.1%
                </span>
              </div>
              <div className="w-full h-12 mt-2">
                <svg className="w-full h-full" viewBox="0 0 200 40">
                  <path className="sparkline" d="M0,10 Q30,15 60,8 T100,20 T140,12 T180,25 T200,30" fill="none" stroke="#4ade80" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Avg Duration */}
            <div data-fade-up className="bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded-lg p-6 relative overflow-hidden transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-mono text-xs text-eye-text uppercase" style={{ fontFamily: "var(--font-mono)" }}>Avg Duration</p>
                  <h3 className="text-3xl font-medium text-white mt-1" style={{ fontFamily: "var(--font-display)" }}>4m 12s</h3>
                </div>
                <span className="text-[#38BDF8] font-mono text-[10px] flex items-center bg-[#38BDF8]/10 px-2 py-0.5 rounded" style={{ fontFamily: "var(--font-mono)" }}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8%
                </span>
              </div>
              <div className="w-full h-12 mt-2">
                <svg className="w-full h-full" viewBox="0 0 200 40">
                  <path className="sparkline" d="M0,30 Q40,25 80,28 T120,15 T160,18 T200,10" fill="none" stroke="#38BDF8" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* MAIN CHART */}
          <div data-fade-up className="bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl text-white" style={{ fontFamily: "var(--font-display)" }}>Traffic Over Time</h2>
                <p className="text-sm text-eye-text mt-1" style={{ fontFamily: "var(--font-body)" }}>System-wide node interactions across active clusters.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 font-mono text-[10px] rounded border border-eye-border bg-eye-surface text-primary" style={{ fontFamily: "var(--font-mono)" }}>Nodes</button>
                <button className="px-3 py-1 font-mono text-[10px] rounded border border-eye-border text-eye-text hover:text-white" style={{ fontFamily: "var(--font-mono)" }}>Clusters</button>
              </div>
            </div>
            <div className="h-[400px] w-full relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <g className="stroke-eye-border/30" strokeDasharray="4 4" strokeWidth="1">
                  <line x1="0" x2="1000" y1="100" y2="100" />
                  <line x1="0" x2="1000" y1="200" y2="200" />
                  <line x1="0" x2="1000" y1="300" y2="300" />
                </g>
                {/* Chart Path */}
                <path className="sparkline" d="M0,350 C100,320 150,380 250,250 C350,120 450,220 550,150 C650,80 750,120 850,50 C950,-20 1000,50 1000,50" fill="none" stroke="#38BDF8" strokeWidth="3" />
                <path d="M0,350 C100,320 150,380 250,250 C350,120 450,220 550,150 C650,80 750,120 850,50 C950,-20 1000,50 1000,50 L1000,400 L0,400 Z" fill="url(#chartFill)" />
                {/* Nodes */}
                <circle className="pulse-dot" cx="250" cy="250" fill="#38BDF8" r="4" />
                <circle className="pulse-dot" cx="550" cy="150" fill="#38BDF8" r="4" />
                <circle className="pulse-dot" cx="850" cy="50" fill="#38BDF8" r="4" />
              </svg>
            </div>
            <div className="flex justify-between mt-6 px-2">
              <span className="font-mono text-[10px] text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>01 OCT</span>
              <span className="font-mono text-[10px] text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>08 OCT</span>
              <span className="font-mono text-[10px] text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>15 OCT</span>
              <span className="font-mono text-[10px] text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>22 OCT</span>
              <span className="font-mono text-[10px] text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>30 OCT</span>
            </div>
          </div>

          {/* LOWER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PIE CHART: Traffic Sources */}
            <div data-fade-up className="lg:col-span-4 bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded-lg p-6 flex flex-col">
              <h2 className="text-xl text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>Traffic Sources</h2>
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-48 h-48 rounded-full border-[12px] border-eye-surface relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#38BDF8" strokeDasharray="251.2" strokeDashoffset="150" strokeWidth="12" />
                    <circle cx="50" cy="50" fill="none" opacity="0.6" r="40" stroke="#22d3ee" strokeDasharray="251.2" strokeDashoffset="200" strokeWidth="12" />
                    <circle cx="50" cy="50" fill="none" opacity="0.4" r="40" stroke="#67e8f9" strokeDasharray="251.2" strokeDashoffset="230" strokeWidth="12" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg text-white" style={{ fontFamily: "var(--font-display)" }}>100%</span>
                    <span className="font-mono text-[10px] text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>Captured</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  <span className="font-mono text-[11px] text-white" style={{ fontFamily: "var(--font-mono)" }}>Direct (40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#22d3ee] opacity-60" />
                  <span className="font-mono text-[11px] text-white" style={{ fontFamily: "var(--font-mono)" }}>Organic (35%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#67e8f9] opacity-40" />
                  <span className="font-mono text-[11px] text-white" style={{ fontFamily: "var(--font-mono)" }}>Referral (15%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-eye-border" />
                  <span className="font-mono text-[11px] text-white" style={{ fontFamily: "var(--font-mono)" }}>Social (10%)</span>
                </div>
              </div>
            </div>

            {/* DATA TABLE: Top Pages */}
            <div data-fade-up className="lg:col-span-8 bg-eye-surface border border-eye-border hover:border-eye-border-hover rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-white" style={{ fontFamily: "var(--font-display)" }}>Top Pages</h2>
                <span className="font-mono text-[10px] text-primary cursor-pointer hover:underline" style={{ fontFamily: "var(--font-mono)" }}>View All Pages</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-eye-border">
                    <th className="pb-4 font-mono text-eye-text text-[11px] uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Page URL</th>
                    <th className="pb-4 font-mono text-eye-text text-[11px] uppercase tracking-wider text-right" style={{ fontFamily: "var(--font-mono)" }}>Views</th>
                    <th className="pb-4 font-mono text-eye-text text-[11px] uppercase tracking-wider text-right" style={{ fontFamily: "var(--font-mono)" }}>Bounce Rate</th>
                    <th className="pb-4 font-mono text-eye-text text-[11px] uppercase tracking-wider text-right" style={{ fontFamily: "var(--font-mono)" }}>Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eye-border/50">
                  <tr className="group hover:bg-eye-surface/50 transition-colors">
                    <td className="py-4 font-mono text-[13px] text-white" style={{ fontFamily: "var(--font-mono)" }}>/dashboard/v2</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>428,192</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>12.4%</td>
                    <td className="py-4 text-right">
                      <TrendingUp className="w-4 h-4 text-[#38BDF8] inline" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-eye-surface/50 transition-colors">
                    <td className="py-4 font-mono text-[13px] text-white" style={{ fontFamily: "var(--font-mono)" }}>/systems/core</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>312,044</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>24.8%</td>
                    <td className="py-4 text-right">
                      <TrendingUp className="w-4 h-4 text-[#38BDF8] inline" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-eye-surface/50 transition-colors">
                    <td className="py-4 font-mono text-[13px] text-white" style={{ fontFamily: "var(--font-mono)" }}>/analytics/realtime</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>184,291</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>8.1%</td>
                    <td className="py-4 text-right">
                      <Minus className="w-4 h-4 text-[#4ade80] inline" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-eye-surface/50 transition-colors">
                    <td className="py-4 font-mono text-[13px] text-white" style={{ fontFamily: "var(--font-mono)" }}>/docs/api-v4</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>144,910</td>
                    <td className="py-4 text-right font-mono text-white" style={{ fontFamily: "var(--font-mono)" }}>54.2%</td>
                    <td className="py-4 text-right">
                      <TrendingDown className="w-4 h-4 text-[#ff6b6b] inline" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t border-eye-border mt-12 py-6 px-6 flex justify-between items-center bg-eye-bg">
          <span className="font-mono text-xs text-eye-text" style={{ fontFamily: "var(--font-mono)" }}>© 2024 EyeX Technologies. All rights reserved.</span>
          <div className="flex gap-6">
            <a className="font-mono text-xs text-eye-text hover:text-white hover:underline transition-all" style={{ fontFamily: "var(--font-mono)" }} href="#">System Status</a>
            <a className="font-mono text-xs text-eye-text hover:text-white hover:underline transition-all" style={{ fontFamily: "var(--font-mono)" }} href="#">Privacy Policy</a>
            <a className="font-mono text-xs text-eye-text hover:text-white hover:underline transition-all" style={{ fontFamily: "var(--font-mono)" }} href="#">Legal</a>
            <a className="font-mono text-xs text-eye-text hover:text-white hover:underline transition-all" style={{ fontFamily: "var(--font-mono)" }} href="#">Terms of Service</a>
          </div>
        </footer>
      </main>

      {/* REAL-TIME TELEMETRY FLOATER */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <div className="bg-eye-surface border border-eye-border px-4 py-3 rounded-full flex items-center shadow-2xl backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-primary pulse-dot mr-3" />
          <span className="font-mono text-[12px] text-white" style={{ fontFamily: "var(--font-mono)" }}>843 Live Visitors</span>
          <div className="h-4 w-[1px] bg-eye-border mx-3" />
          <span className="font-mono text-[10px] text-eye-text uppercase" style={{ fontFamily: "var(--font-mono)" }}>Real-Time Sync</span>
        </div>
      </div>
    </>
  );
}
