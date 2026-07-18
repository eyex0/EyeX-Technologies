import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  HeadphonesIcon,
  Search,
  Bell,
  HelpCircle,
  Server,
} from "lucide-react";

export function DashboardPage() {
  return (
    <div className="dark bg-eye-bg">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-[240px] border-r border-outline-variant backdrop-blur-[20px] bg-opacity-90 bg-surface flex flex-col py-6 px-4 z-50">
        <div className="mb-10 px-2 flex items-center gap-3">
          <img
            alt="EyeX Technologies Logo"
            className="w-10 h-10"
            src="https://lh3.googleusercontent.com/aida/AP1WRLsQOWY1jiM2rbry7lohts-Rb8_y4zW5SHQStQwUwZ7oRfScVQ-WnE_KkvjHfnAFef-rz3vFxxUwxqL35TXLlYCqr9Bt61-ISaqM3cE4jyBF0ITRu_SosGsY9YAlga5THtqKeXjGOQJ_lMLRlpta0-d30nL1jxOIq3bzjfw_kDejF1OHgVW9D51iQqIWU5o9vS9kC6vcfnW3hsnsx3fqZjLo8MRWaeESFBRA7UajDJpDR0AJI2QkCQI0qNA"
          />
          <div>
            <h1 className="text-[20px] font-bold text-primary-brand leading-tight">EyeX OS</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline">Enterprise Suite</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {/* Active: Dashboard */}
          <a
            className="flex items-center gap-3 py-3 px-4 text-primary-brand border-l-2 border-primary-brand bg-primary-brand/5 transition-colors text-sm"
            href="#"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Analytics</span>
          </a>
          <a
            className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <MessageSquare className="w-5 h-5" />
            <span>AI Chat</span>
          </a>
          <a
            className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </a>
          <a
            className="flex items-center gap-3 py-3 px-4 text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
            href="#"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>
        <div className="mt-auto pt-6 border-t border-outline-variant">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-brand text-eye-bg font-bold transition-all active:scale-95 text-sm">
            <HeadphonesIcon className="w-[18px] h-[18px]" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-[240px] relative min-h-screen pb-16">
        {/* Ambient Decor */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-brand opacity-[0.08] blur-[80px] rounded-full pointer-events-none z-[-1]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] opacity-[0.05] blur-[80px] rounded-full pointer-events-none z-[-1]" style={{ background: "radial-gradient(circle, rgba(144, 215, 255, 0.05) 0%, transparent 70%)" }} />

        {/* Top Header */}
        <header className="sticky top-0 w-full h-16 border-b border-outline-variant bg-surface/80 backdrop-blur-[20px] flex justify-between items-center px-8 z-40">
          <div className="flex items-center gap-6">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input
                className="w-full bg-eye-bg border border-eye-border py-2 pl-10 pr-4 text-sm font-mono placeholder:text-outline-variant text-on-surface"
                placeholder="Global system search..."
                type="text"
              />
            </div>
            <div className="flex gap-4">
              <span className="text-on-surface-variant hover:text-primary-brand transition-all font-bold text-sm cursor-pointer">
                Systems
              </span>
              <span className="text-on-surface-variant hover:text-primary-brand transition-all font-bold text-sm cursor-pointer">
                Networks
              </span>
              <span className="text-on-surface-variant hover:text-primary-brand transition-all font-bold text-sm cursor-pointer">
                Security
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button aria-label="Notifications" className="text-outline hover:text-primary-brand transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button aria-label="Help" className="text-outline hover:text-primary-brand transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-outline-variant mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface leading-none">Administrator</p>
                <p className="text-[10px] text-outline font-mono">ROOT_AUTH_01</p>
              </div>
              <div className="w-10 h-10 rounded-sm bg-surface-container-highest border border-outline-variant overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIicL4SPXitdl03a-2MxVyZD9r8M1UaYfyCyY7hEquc7hOvckF-G7BMp15AY-PwTaEl7TI91cHoARFaOd-7eiOdiPwQHsxebxMyfurFcF_gTKBaOPLNZzPI2Yt4uRYzZQqcJtjkhPvLyQNRdmR66-Tx6-f31Ztm60g2jo806Yi7fzhdR3O0S6LGLBxmw1r1GH2qTd4m1Rj4d7vkgi094jYxzFZj3J-rgZdGbqlHpAF0ygYo_DbCrnuRyBY4E3wNtz8IX0fmOeBsVg"
                  alt="Administrator avatar"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-8 pt-8 max-w-[1400px] mx-auto">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10" data-fade-up>
            {/* Card 1 - Revenue */}
            <div className="glass-panel p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-outline text-[12px] uppercase font-mono">Total Revenue</p>
                <span className="text-primary-brand text-[14px] font-mono font-bold">+12.4%</span>
              </div>
              <h3 className="text-3xl font-bold text-on-surface">$1.24M</h3>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-brand/20">
                <div className="h-full bg-primary-brand w-[70%] shadow-[0_0_10px_#38BDF8]" />
              </div>
            </div>

            {/* Card 2 - Users */}
            <div className="glass-panel p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-outline text-[12px] uppercase font-mono">Active Users</p>
                <span className="text-primary-brand text-[14px] font-mono font-bold">+5.1%</span>
              </div>
              <h3 className="text-3xl font-bold text-on-surface">45.2k</h3>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-brand/20">
                <div className="h-full bg-primary-brand w-[45%] shadow-[0_0_10px_#38BDF8]" />
              </div>
            </div>

            {/* Card 3 - API Calls */}
            <div className="glass-panel p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-outline text-[12px] uppercase font-mono">API Calls</p>
                <span className="text-red-400 text-[14px] font-mono font-bold">-2.3%</span>
              </div>
              <h3 className="text-3xl font-bold text-on-surface">8.4M</h3>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-400/20">
                <div className="h-full bg-red-400 w-[80%] shadow-[0_0_10px_#ffb4ab]" />
              </div>
            </div>

            {/* Card 4 - Uptime */}
            <div className="glass-panel p-5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <p className="text-outline text-[12px] uppercase font-mono">System Uptime</p>
                <span className="text-primary-brand text-[14px] font-mono font-bold">STABLE</span>
              </div>
              <h3 className="text-3xl font-bold text-on-surface">99.99%</h3>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-brand/20">
                <div className="h-full bg-primary-brand w-[99%] shadow-[0_0_10px_#38BDF8]" />
              </div>
            </div>
          </div>

          {/* Middle Section: Revenue Chart & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10" data-fade-up>
            {/* Revenue Chart */}
            <div className="lg:col-span-2 glass-panel p-6 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-base font-bold text-on-surface">Revenue Over Time</h2>
                  <p className="text-sm text-outline">
                    Performance analysis across infrastructure nodes
                  </p>
                </div>
                <div className="flex border border-eye-border bg-eye-bg p-1">
                  <button className="px-3 py-1 text-[12px] font-mono font-bold bg-primary-brand text-eye-bg">
                    24H
                  </button>
                  <button className="px-3 py-1 text-[12px] font-mono text-outline hover:text-on-surface transition-colors">
                    7D
                  </button>
                  <button className="px-3 py-1 text-[12px] font-mono text-outline hover:text-on-surface transition-colors">
                    30D
                  </button>
                </div>
              </div>
              <div className="flex-1 relative flex items-end">
                {/* Chart Grid Background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(#1A1A1C 1px, transparent 1px), linear-gradient(90deg, #1A1A1C 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                <div className="w-full h-[80%] relative overflow-hidden">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,200 L0,140 Q100,100 200,130 T400,80 T600,110 T800,40 L800,200 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M0,140 Q100,100 200,130 T400,80 T600,110 T800,40"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* System Activity Feed */}
            <div className="glass-panel p-6 flex flex-col h-[400px]">
              <h2 className="text-base font-bold text-on-surface mb-6">System Activity</h2>
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex gap-3 items-start group">
                  <div className="w-2 h-2 mt-2 bg-primary-brand group-hover:shadow-[0_0_8px_#38BDF8]" />
                  <div>
                    <p className="text-[12px] font-mono text-outline">[14:22:01] AUTH</p>
                    <p className="text-sm text-on-surface">
                      User <span className="text-primary-brand">ADMIN_PROX</span> verified.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <div className="w-2 h-2 mt-2 bg-primary-brand/40" />
                  <div>
                    <p className="text-[12px] font-mono text-outline">[14:21:45] NET</p>
                    <p className="text-sm text-on-surface">
                      Gateway node <span className="font-mono">G-LON-04</span> active.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <div className="w-2 h-2 mt-2 bg-red-400 group-hover:shadow-[0_0_8px_#ffb4ab]" />
                  <div>
                    <p className="text-[12px] font-mono text-outline">[14:19:33] CRIT</p>
                    <p className="text-sm text-on-surface">
                      Disk I/O latency spike in <span className="text-red-400">Zone-C</span>.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <div className="w-2 h-2 mt-2 bg-primary-brand/40" />
                  <div>
                    <p className="text-[12px] font-mono text-outline">[14:18:12] SYNC</p>
                    <p className="text-sm text-on-surface">Database clustering synchronized.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <div className="w-2 h-2 mt-2 bg-primary-brand/40" />
                  <div>
                    <p className="text-[12px] font-mono text-outline">[14:15:59] INFO</p>
                    <p className="text-sm text-on-surface">
                      Auto-scaling group expanded by 2 units.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <div className="w-2 h-2 mt-2 bg-primary-brand/40" />
                  <div>
                    <p className="text-[12px] font-mono text-outline">[14:12:01] LOG</p>
                    <p className="text-sm text-on-surface">
                      Weekly security audit complete.
                    </p>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full py-2 text-[12px] font-mono text-outline-variant hover:text-primary-brand transition-colors border border-outline-variant/20 uppercase tracking-widest">
                View Detailed Logs
              </button>
            </div>
          </div>

          {/* Bottom Section: Transactions & Infrastructure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-fade-up>
            {/* Recent Transactions */}
            <div className="lg:col-span-2 glass-panel overflow-hidden">
              <div className="p-6 border-b border-eye-border flex justify-between items-center">
                <h2 className="text-base font-bold text-on-surface">Recent Transactions</h2>
                <button className="text-primary-brand text-sm hover:underline">
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-eye-border">
                      <th className="px-6 py-4 text-[12px] text-outline uppercase font-mono">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-[12px] text-outline uppercase font-mono">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-[12px] text-outline uppercase font-mono">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-[12px] text-outline uppercase font-mono">
                        Status
                      </th>
                      <th className="px-6 py-4 text-[12px] text-outline uppercase font-mono">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-eye-border">
                    <tr className="hover:bg-primary-brand/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-on-surface text-sm">TX-882910</td>
                      <td className="px-6 py-4 text-sm font-bold">Nexus Dynamics</td>
                      <td className="px-6 py-4 font-mono text-on-surface font-bold">
                        $12,400.00
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-primary-brand/10 text-primary-brand border border-primary-brand/20">
                          SUCCESS
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-outline text-[12px]">
                        2024-05-24 14:12
                      </td>
                    </tr>
                    <tr className="hover:bg-primary-brand/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-on-surface text-sm">TX-882909</td>
                      <td className="px-6 py-4 text-sm font-bold">CloudCore AI</td>
                      <td className="px-6 py-4 font-mono text-on-surface font-bold">
                        $45,000.00
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-primary-brand/10 text-primary-brand border border-primary-brand/20">
                          SUCCESS
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-outline text-[12px]">
                        2024-05-24 13:58
                      </td>
                    </tr>
                    <tr className="hover:bg-primary-brand/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-on-surface text-sm">TX-882908</td>
                      <td className="px-6 py-4 text-sm font-bold">Aether Labs</td>
                      <td className="px-6 py-4 font-mono text-on-surface font-bold">
                        $2,150.00
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-secondary/10 text-secondary border border-secondary/20">
                          PENDING
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-outline text-[12px]">
                        2024-05-24 13:45
                      </td>
                    </tr>
                    <tr className="hover:bg-primary-brand/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-on-surface text-sm">TX-882907</td>
                      <td className="px-6 py-4 text-sm font-bold">Stellar Ventures</td>
                      <td className="px-6 py-4 font-mono text-on-surface font-bold">
                        $18,720.00
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-primary-brand/10 text-primary-brand border border-primary-brand/20">
                          SUCCESS
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-outline text-[12px]">
                        2024-05-24 13:22
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Infrastructure Status */}
            <div className="glass-panel p-6">
              <h2 className="text-base font-bold text-on-surface mb-8">Infrastructure Status</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">CPU Utilization</span>
                    <span className="font-mono text-primary-brand font-bold">64%</span>
                  </div>
                  <div className="h-1.5 w-full bg-eye-border">
                    <div className="h-full bg-primary-brand" style={{ width: "64%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">Memory Capacity</span>
                    <span className="font-mono text-primary-brand font-bold">42%</span>
                  </div>
                  <div className="h-1.5 w-full bg-eye-border">
                    <div className="h-full bg-primary-brand" style={{ width: "42%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold">NVMe Storage</span>
                    <span className="font-mono text-red-400 font-bold">88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-eye-border">
                    <div className="h-full bg-red-400" style={{ width: "88%" }} />
                  </div>
                </div>
              </div>
              <div className="mt-10 p-4 border border-outline-variant/20 bg-surface-container-low flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-brand/10 flex items-center justify-center border border-primary-brand/20">
                  <Server className="text-primary-brand w-6 h-6" />
                </div>
                <div>
                  <p className="text-[12px] font-mono text-primary-brand font-bold">
                    All nodes operational
                  </p>
                  <p className="text-[10px] text-outline uppercase tracking-widest">
                    Global Cluster: ACTIVE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 right-0 w-full border-t border-outline-variant flex justify-between items-center px-8 py-4 bg-surface">
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-widest text-primary-brand font-bold">EyeX</span>
            <span className="text-outline">
              &copy; 2024 EyeX Technologies. Surgical Precision Data.
            </span>
          </div>
          <div className="flex gap-6">
            <a className="text-outline hover:text-on-surface transition-opacity duration-150" href="#">
              Status
            </a>
            <a className="text-outline hover:text-on-surface transition-opacity duration-150" href="#">
              Privacy
            </a>
            <a className="text-outline hover:text-on-surface transition-opacity duration-150" href="#">
              Docs
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
