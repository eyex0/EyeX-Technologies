export function AiChatPage() {
  return (
    <>
      {/* Ambient background */}
      <div className="fixed inset-0 ambient-glow-fixed z-0"></div>
      {/* Sidebar: Conversation History */}
      <aside className="w-72 h-full flex flex-col z-10 bento-border border-r bg-eye-surface transition-all duration-300">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center infinity-logo">
              <span
                className="material-symbols-outlined text-eye-bg"
                style={{ fontVariationSettings: "'wght' 700" }}
              >
                all_inclusive
              </span>
            </div>
            <span className="font-display-lg text-[18px] tracking-tight text-on-surface font-bold">
              EyeX
            </span>
          </div>
          <button
            aria-label="New chat"
            className="text-eye-text hover:text-on-surface transition-colors cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined">edit_square</span>
          </button>
        </div>
        <div className="px-4 py-2">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-eye-text text-sm">
              search
            </span>
            <input
              className="w-full bg-eye-bg border-eye-border focus:border-primary/50 rounded-lg text-xs py-2 pl-9 pr-4 font-label-mono focus:ring-0 outline-none transition-all"
              placeholder="Search Intel..."
              type="text"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-6">
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-eye-text/50 font-label-mono px-3 mb-2">
              Today
            </div>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container text-on-surface font-medium transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
              <span className="truncate">Network Latency Audit</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-eye-text hover:bg-eye-border/30 hover:text-on-surface transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              <span className="truncate">Threat Vector Analysis</span>
            </a>
          </div>
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-eye-text/50 font-label-mono px-3 mb-2">
              Yesterday
            </div>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-eye-text hover:bg-eye-border/30 hover:text-on-surface transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span className="truncate">Infrastructure Scaling</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-eye-text hover:bg-eye-border/30 hover:text-on-surface transition-all group"
              href="#"
            >
              <span className="material-symbols-outlined text-[18px]">database</span>
              <span className="truncate">Core Cluster Redundancy</span>
            </a>
          </div>
        </nav>
        <div className="p-4 mt-auto border-t border-eye-border">
          <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-eye-border/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-eye-border flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface text-[20px]">
                  person
                </span>
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-on-surface">Systems Admin</div>
                <div className="text-[10px] text-eye-text font-label-mono">ENTERPRISE-NODE</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-eye-text text-sm">settings</span>
          </button>
        </div>
      </aside>
      {/* Main Content: Chat Workspace */}
      <main className="flex-1 flex flex-col h-full bg-eye-bg z-10 relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-8 glass-effect border-b border-eye-border">
          <div className="flex items-center gap-4">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <h1 className="font-headline-md text-[18px] text-on-surface font-bold tracking-tight">
              Intelligence Core v4.2
            </h1>
            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-label-mono">
              SECURE
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-eye-text hover:text-on-surface cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">ios_share</span>
              <span className="text-xs font-medium">Export</span>
            </div>
            <div className="w-[1px] h-4 bg-eye-border"></div>
            <button className="bg-on-background text-eye-bg px-4 py-1.5 rounded-full text-xs font-bold hover:shadow-[0_0_15px_rgba(250,250,250,0.2)] transition-all active:scale-95">
              Upgrade Node
            </button>
          </div>
        </header>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="max-w-[800px] mx-auto w-full px-gutter py-12 space-y-12">
            {/* User Message */}
            <div className="flex gap-6 group">
              <div className="w-10 h-10 rounded-xl bg-eye-surface bento-border flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface text-[22px]">
                  person_check
                </span>
              </div>
              <div className="flex-1 pt-2">
                <div className="font-label-mono text-[10px] text-eye-text uppercase tracking-widest mb-2">
                  Request - 14:22:01
                </div>
                <div className="font-body-sm text-on-surface text-[15px] leading-relaxed">
                  Analyze current latency spikes in the Frankfurt region cluster. Provide a surgical
                  breakdown of the bottleneck and suggest primary remediation paths for immediate
                  deployment.
                </div>
              </div>
            </div>
            {/* AI Response (Thinking State) */}
            <div className="flex gap-6">
              <div className="w-10 h-10 rounded-xl bg-eye-surface bento-border flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/5 thinking-shimmer"></div>
                <span
                  className="material-symbols-outlined text-primary text-[22px] relative z-10"
                  style={{ fontVariationSettings: "'wght' 500" }}
                >
                  all_inclusive
                </span>
              </div>
              <div className="flex-1 pt-2 space-y-6">
                <div className="font-label-mono text-[10px] text-primary uppercase tracking-widest mb-2">
                  Synthesizing intelligence...
                </div>
                <div className="space-y-4">
                  {/* Thinking Glass Card */}
                  <div className="glass-effect bento-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-sm font-medium text-on-surface">
                        Bottleneck Identified: Port 8080 congestion
                      </span>
                    </div>
                    <div className="font-label-mono text-xs text-eye-text leading-relaxed bg-eye-bg/50 p-4 rounded-lg border border-eye-border/50">
                      <span className="text-primary">$</span> eye-trace --target fra-cluster-04
                      <br />
                      <span className="text-eye-text/60">
                        Tracing route to fra-cluster-04.eyex.internal...
                      </span>
                      <br />
                      <span className="text-on-surface">
                        [CRITICAL] 482ms delay detected at edge-gateway-02
                      </span>
                    </div>
                  </div>
                  {/* Main Response Body */}
                  <div className="font-body-sm text-on-surface text-[15px] leading-relaxed">
                    The spikes originate from a misconfigured load balancer at the Frankfurt edge.
                    Direct analysis reveals a{" "}
                    <span className="text-primary font-medium">342% increase</span> in unhandled TCP
                    handshakes during the 14:00 window.
                  </div>
                  {/* Bento Grid for stats/results */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bento-border rounded-xl p-4 bg-eye-surface/50">
                      <div className="text-[10px] font-label-mono text-eye-text uppercase mb-1">
                        Peak Latency
                      </div>
                      <div className="text-2xl font-bold text-on-surface tracking-tighter">
                        894ms
                      </div>
                    </div>
                    <div className="bento-border rounded-xl p-4 bg-eye-surface/50">
                      <div className="text-[10px] font-label-mono text-eye-text uppercase mb-1">
                        Affected Nodes
                      </div>
                      <div className="text-2xl font-bold text-on-surface tracking-tighter">
                        14 Nodes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* System Alert Style Interaction */}
            <div className="flex gap-6">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                <div className="w-1 h-full bg-eye-border rounded-full"></div>
              </div>
              <div className="flex-1 py-4 px-6 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <span className="text-sm font-medium text-primary">
                    System recommends immediate patch deployment to Frankfurt Gateways.
                  </span>
                </div>
                <button className="text-[10px] font-label-mono uppercase tracking-widest text-on-surface bg-eye-surface border border-eye-border px-3 py-1.5 rounded hover:bg-eye-border transition-colors">
                  Execute Patch
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Input Section */}

        {/* Scroll Indicator */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2">
          <div className="w-1 h-8 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
          <div className="w-1 h-4 rounded-full bg-eye-border"></div>
          <div className="w-1 h-4 rounded-full bg-eye-border"></div>
        </div>
      </main>
      {/* Interactive Scripts */}
    </>
  );
}
