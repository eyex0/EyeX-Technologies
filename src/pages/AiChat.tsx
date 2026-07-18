import { useState } from "react";
import {
  Send,
  Plus,
  Search,
  Bot,
  User,
  Settings,
  Shield,
  Share,
  Paperclip,
  FileText,
  History,
  Trash2,
  Copy,
  Terminal,
} from "lucide-react";

export function AiChatPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="h-screen flex text-eye-white overflow-hidden relative">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-brand/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-brand/5 blur-[100px] rounded-full" />
      </div>

      {/* Sidebar */}
      <aside className="w-[280px] h-screen bg-eye-surface border-r border-eye-border flex flex-col z-20 relative">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-brand rounded-sm flex items-center justify-center">
            <Terminal className="text-eye-bg text-xl w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-white">QORX</h1>
            <p className="text-[10px] text-eye-text uppercase tracking-[0.2em] font-mono">
              Analytic Core
            </p>
          </div>
        </div>
        <div className="px-4 mb-6">
          <button className="w-full py-3 px-4 bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300 rounded flex items-center justify-center gap-2 text-background font-bold text-sm">
            <Plus className="text-lg w-5 h-5" />
            New Analysis
          </button>
        </div>
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-eye-text text-sm w-4 h-4" />
            <input
              className="w-full bg-eye-bg border border-eye-border rounded py-2 pl-10 pr-4 text-xs font-mono focus:border-primary-brand outline-none transition-colors"
              placeholder="Search threads..."
              type="text"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-4 py-2">
            <span className="text-[10px] text-eye-text/50 uppercase tracking-widest font-mono">
              Recent Threads
            </span>
          </div>
          {/* Thread Item Active */}
          <a
            className="flex flex-col p-3 rounded bg-surface-container-high border-l-2 border-primary-brand group transition-all"
            href="#"
          >
            <span className="text-sm font-medium text-white truncate">
              Infrastructure Optimization Engine
            </span>
            <span className="text-[10px] text-primary-brand mt-1 font-mono">
              12:44 PM &bull; SECURE
            </span>
          </a>
          {/* Thread Items */}
          <a
            className="flex flex-col p-3 rounded hover:bg-eye-border-hover border-l-2 border-transparent group transition-all"
            href="#"
          >
            <span className="text-sm font-medium text-eye-text group-hover:text-white truncate">
              Neural Link Latency Analysis
            </span>
            <span className="text-[10px] text-eye-text/40 mt-1 font-mono">
              10:15 AM &bull; ARCHIVED
            </span>
          </a>
          <a
            className="flex flex-col p-3 rounded hover:bg-eye-border-hover border-l-2 border-transparent group transition-all"
            href="#"
          >
            <span className="text-sm font-medium text-eye-text group-hover:text-white truncate">
              Market Volatility Predictor
            </span>
            <span className="text-[10px] text-eye-text/40 mt-1 font-mono">
              Yesterday &bull; ENCRYPTED
            </span>
          </a>
        </nav>
        <div className="p-4 border-t border-eye-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-eye-border overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoX1QcUCNe0fxY85lYyp70drYA-Xs3TNXYnpBTC07yHxRtWvwHpomfitx_Pu-SMrG2FHRe60c2dLWrp6OD5pF05bcqXICZtWTcax8cbZXDBrqEqN_7d6fk_cX0EDNhEK6tvhzA35otCsYWBNdsHBKhf2GvVIBBWVUUmC2JZBrNTJCOpqJsAx2d22BZzyYwQB3nzgX2sJbp1wlWZbdx9YK4RgFzWH6hrS96gCihF5GqSVHgQXz9O0DofVfGOleu3dCTwC-3c5usglo"
                alt="Administrator avatar"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">Administrator</span>
              <span className="text-[9px] text-eye-text font-mono">L7-CLEARANCE</span>
            </div>
          </div>
          <button className="text-eye-text hover:text-white transition-colors">
            <Settings className="text-lg w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 bg-eye-bg/40 backdrop-blur-sm">
        {/* Header */}
        <header className="h-16 glass-panel border-t-0 border-x-0 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-brand shadow-[0_0_8px_#38BDF8]" />
              <h2 className="text-sm font-bold tracking-tight text-white uppercase">
                Analytic Core v4.2
              </h2>
            </div>
            <div className="h-4 w-[1px] bg-eye-border" />
            <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded text-[10px] font-mono text-primary-brand border border-primary-brand/20">
              <Shield className="w-3 h-3" />
              QUANTUM ENCRYPTED
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-eye-text hover:text-white transition-colors">
              <Share className="text-lg w-5 h-5" />
              <span className="text-xs font-mono">EXPORT</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-eye-border-hover transition-colors">
              <User className="text-xl w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Chat History */}
        <section className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full pb-32">
          {/* Assistant Message */}
          <div className="flex flex-col gap-3 group" data-fade-up>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary-brand uppercase tracking-widest font-mono">
                QORX ANALYTIC
              </span>
              <span className="text-[10px] text-eye-text/40 font-mono">T+0.002s</span>
            </div>
            <div className="pl-6 border-l-2 border-primary-brand py-2" style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.05) 0%, transparent 100%)" }}>
              <p className="text-eye-white leading-relaxed text-[16px]">
                Infrastructure optimization sequence initialized. I have mapped the current node
                distribution across your EMEA clusters. Systems are currently performing at 84.2%
                efficiency. Would you like me to execute the reallocation protocol for the peak-load
                shift?
              </p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex flex-col gap-3 items-end" data-fade-up>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-eye-text/40 font-mono">12:45 PM</span>
              <span className="text-[10px] text-eye-text uppercase tracking-widest font-mono">
                ADMINISTRATOR
              </span>
            </div>
            <div className="bg-eye-surface border border-eye-border px-6 py-4 rounded-xl max-w-[85%]">
              <p className="text-eye-white leading-relaxed text-[15px]">
                Yes, please proceed. Also, generate a Python script to monitor the specific latency
                spikes we saw in the Frankfurt cluster during the last deployment cycle.
              </p>
            </div>
          </div>

          {/* Assistant Message with Code */}
          <div className="flex flex-col gap-3 group" data-fade-up>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary-brand uppercase tracking-widest font-mono">
                QORX ANALYTIC
              </span>
              <span className="text-[10px] text-eye-text/40 font-mono">T+0.412s</span>
            </div>
            <div className="pl-6 border-l-2 border-primary-brand py-2 space-y-4" style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.05) 0%, transparent 100%)" }}>
              <p className="text-eye-white leading-relaxed text-[16px]">
                Reallocation protocol executed. Efficiency projected to reach 97.4% within 120
                seconds.
                <br />
                <br />
                Here is the latency monitoring utility for the Frankfurt cluster. This uses the
                internal EyeX Telemetry API.
              </p>
              <div className="bg-black rounded-lg border border-eye-border overflow-hidden group/code relative">
                <div className="bg-eye-surface border-b border-eye-border px-4 py-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-eye-text uppercase tracking-tighter">
                    latency_monitor.py
                  </span>
                  <button className="text-eye-text hover:text-white transition-all">
                    <Copy className="text-sm w-4 h-4" />
                  </button>
                </div>
                <pre className="p-5 font-mono text-[13px] leading-relaxed text-blue-300/80 overflow-x-auto">
                  <code>
                    <span className="text-primary-brand">import</span>{" "}
                    eyex_telemetry{" "}
                    <span className="text-primary-brand">as</span> et
                    {"\n"}
                    <span className="text-primary-brand">from</span> datetime{" "}
                    <span className="text-primary-brand">import</span> datetime
                    {"\n\n"}
                    <span className="text-zinc-500">
                      # Configure Frankfurt Cluster Endpoint
                    </span>
                    {"\n"}
                    CLUSTER_ID ={" "}
                    <span className="text-orange-300">"EMEA-FRA-01"</span>
                    {"\n"}
                    THRESHOLD_MS ={" "}
                    <span className="text-orange-300">45.0</span>
                    {"\n\n"}
                    <span className="text-primary-brand">def</span>{" "}
                    <span className="text-white">monitor_latency</span>():
                    {"\n"}
                    {"    "}telemetry = et.Connect(secure=
                    <span className="text-primary-brand">True</span>)
                    {"\n"}
                    {"    "}
                    <span className="text-primary-brand">while</span>{" "}
                    <span className="text-primary-brand">True</span>:
                    {"\n"}
                    {"        "}metrics = telemetry.get_cluster_stats(CLUSTER_ID)
                    {"\n"}
                    {"        "}
                    <span className="text-primary-brand">if</span>{" "}
                    metrics.latency &gt; THRESHOLD_MS:
                    {"\n"}
                    {"            "}et.alert(f
                    <span className="text-orange-300">
                      "Critical Spike: {metrics.latency}ms"
                    </span>
                    )
                    {"\n"}
                    {"            "}et.log_event(metrics.trace_dump())
                  </code>
                </pre>
              </div>
            </div>
          </div>

          {/* Thinking State */}
          <div className="flex flex-col gap-3" data-fade-up>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-primary-brand uppercase tracking-widest font-mono">
                QORX ANALYTIC
              </span>
            </div>
            <div className="flex items-center gap-4 bg-eye-surface/40 border border-primary-brand/10 rounded-full px-5 py-3 w-fit backdrop-blur-md">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-brand animate-pulse" />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-primary-brand animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full bg-primary-brand animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
              <span className="text-[10px] text-eye-text uppercase tracking-widest font-mono">
                Thinking
              </span>
            </div>
          </div>
        </section>

        {/* Input Area */}
        <footer className="absolute bottom-0 left-0 right-0 p-8 pt-0 pointer-events-none">
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            <div className="glass-panel rounded-2xl p-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-brand/5 via-transparent to-transparent pointer-events-none" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-1 border-b border-eye-border/50">
                  <select className="bg-transparent border-none text-[10px] font-mono text-eye-text focus:ring-0 cursor-pointer hover:text-white transition-colors p-0 pr-6">
                    <option>AGENT: QORX-CORE</option>
                    <option>AGENT: VISION-PRO</option>
                    <option>AGENT: INFRA-V3</option>
                  </select>
                  <div className="h-3 w-[1px] bg-eye-border" />
                  <button className="flex items-center gap-1.5 text-[10px] font-mono text-eye-text hover:text-white transition-colors">
                    <Paperclip className="w-3.5 h-3.5" />
                    ATTACH
                  </button>
                </div>
                <div className="flex items-end gap-3 px-3 py-2">
                  <textarea
                    className="w-full bg-transparent border-none focus:ring-0 text-[15px] leading-relaxed resize-none py-1 max-h-48 min-h-[44px]"
                    placeholder="Issue command to Analytic Core..."
                    rows={1}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      e.currentTarget.style.height = "";
                      e.currentTarget.style.height =
                        e.currentTarget.scrollHeight + "px";
                    }}
                  />
                  <button className="w-10 h-10 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-background hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:bg-primary-brand transition-all group">
                    <Send className="text-xl w-5 h-5 transition-transform group-active:scale-90" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-[9px] text-eye-text/30 uppercase tracking-[0.3em] font-mono">
                EyeX Technologies Unified Intelligence Interface &bull; Authorized Personnel Only
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Right Detail Sidebar */}
      <aside className="w-[320px] h-screen bg-eye-surface border-l border-eye-border hidden xl:flex flex-col z-20">
        <div className="p-6">
          <h3 className="text-[10px] text-eye-text uppercase tracking-widest mb-6 font-mono">
            Agent Diagnostics
          </h3>
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-surface-container border border-eye-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-eye-text">Core Load</span>
                <span className="font-mono text-xs text-primary-brand">24.2%</span>
              </div>
              <div className="w-full bg-eye-border h-[2px] rounded-full overflow-hidden">
                <div className="bg-primary-brand h-full w-[24%] shadow-[0_0_8px_#38BDF8]" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] text-eye-text/50 uppercase font-mono">
                    Uptime
                  </span>
                  <span className="font-mono text-xs text-white">412d 14h</span>
                </div>
                <div>
                  <span className="block text-[10px] text-eye-text/50 uppercase font-mono">
                    Tokens/sec
                  </span>
                  <span className="font-mono text-xs text-white">124.8</span>
                </div>
              </div>
            </div>

            {/* Abstract Visual for Agent */}
            <div className="aspect-square bg-black border border-eye-border rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 border-2 border-primary-brand/20 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 border border-primary-brand/40 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary-brand rounded-full shadow-[0_0_15px_#38BDF8]" />
                  </div>
                </div>
                <span className="mt-4 text-[10px] text-primary-brand uppercase tracking-[0.2em] opacity-80 font-mono">
                  Syncing Intelligence
                </span>
              </div>
            </div>

            {/* Knowledge Base Snippet */}
            <div className="space-y-3">
              <span className="block text-[10px] text-eye-text uppercase tracking-widest font-mono">
                Active Context
              </span>
              <div className="p-3 bg-eye-surface border border-eye-border rounded-md group hover:border-primary-brand/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="text-primary-brand text-sm w-4 h-4" />
                  <span className="text-xs font-medium text-white">emea_topology.json</span>
                </div>
                <p className="text-[10px] text-eye-text leading-relaxed">
                  Infrastructure mapping for European nodes...
                </p>
              </div>
              <div className="p-3 bg-eye-surface border border-eye-border rounded-md group hover:border-primary-brand/40 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="text-primary-brand text-sm w-4 h-4" />
                  <span className="text-xs font-medium text-white">security_protocol_v9.pdf</span>
                </div>
                <p className="text-[10px] text-eye-text leading-relaxed">
                  Compliance and encryption standards...
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto p-6 space-y-4">
          <button className="w-full py-2.5 border border-eye-border hover:border-primary-brand/50 text-eye-text hover:text-white text-xs font-mono rounded transition-all flex items-center justify-center gap-2">
            <History className="text-sm w-4 h-4" />
            FULL CONTEXT LOGS
          </button>
          <button className="w-full py-2.5 border border-eye-border hover:border-red-500/50 text-eye-text hover:text-red-400 text-xs font-mono rounded transition-all flex items-center justify-center gap-2">
            <Trash2 className="text-sm w-4 h-4" />
            PURGE SESSION
          </button>
        </div>
      </aside>
    </div>
  );
}
