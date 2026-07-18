import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Search, Terminal, Shield, BarChart3,
  Database, User, Settings, Pencil, Star, Share2,
  UserCheck, Info, ArrowUp, Loader2,
} from "lucide-react";
import { ChatService } from "@/services/chat.service";

interface AgentStep {
  agent: string;
  duration: number;
  result: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  text: string;
  steps?: AgentStep[];
  timestamp: string;
}

interface HistoryItem {
  label: string;
  group: string;
}

const HISTORY: HistoryItem[] = [
  { label: "Network Latency Audit", group: "Today" },
  { label: "Threat Vector Analysis", group: "Today" },
  { label: "Infrastructure Scaling", group: "Yesterday" },
  { label: "Core Cluster Redundancy", group: "Yesterday" },
];

const now = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

export function AiChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Intelligence Core v4.2 initialized. I can analyze latency, investigate security threats, generate forecasts, or query your data infrastructure. What do you need?",
      timestamp: "14:22:00",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", text, timestamp: now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await ChatService.sendMessage(text, messages);
      setMessages([
        ...updated,
        {
          role: "assistant",
          text: res.text,
          steps: res.steps,
          timestamp: now(),
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...updated,
        { role: "assistant", text: `System error: ${err.message}`, timestamp: now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-shrink-0 border-r border-eye-border bg-eye-surface flex-col">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Sparkles size={18} className="text-eye-bg" />
            </div>
            <span className="text-[18px] tracking-tight text-eye-white font-bold">EyeX</span>
          </div>
          <button
            onClick={() => setMessages([{ role: "assistant", text: "New session started.", timestamp: now() }])}
            className="text-eye-text hover:text-eye-white transition-colors cursor-pointer active:scale-95"
          >
            <Pencil size={18} />
          </button>
        </div>

        <div className="px-4 py-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-eye-text" />
            <input className="w-full bg-eye-bg border border-eye-border focus:border-primary/50 rounded-lg text-xs py-2 pl-9 pr-4 text-eye-white placeholder:text-eye-text/50 focus:ring-0 outline-none transition-all font-mono" placeholder="Search sessions..." type="text" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {["Today", "Yesterday"].map((group) => (
            <div key={group} className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-eye-text/50 font-mono px-3 mb-2">{group}</div>
              {HISTORY.filter((h) => h.group === group).map((item) => (
                <button key={item.label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-eye-text hover:bg-eye-border/30 hover:text-eye-white transition-all text-left">
                  <Terminal size={16} className="text-muted-foreground" />
                  <span className="truncate text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-eye-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-eye-border flex items-center justify-center">
              <User size={16} className="text-eye-white" />
            </div>
            <div className="text-left flex-1">
              <div className="text-xs font-medium text-eye-white">Systems Admin</div>
              <div className="text-[10px] text-eye-text font-mono">ENTERPRISE-NODE</div>
            </div>
            <Settings size={14} className="text-eye-text" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-eye-border bg-[#050505]">
          <div className="flex items-center gap-4">
            <Sparkles size={18} className="text-primary" />
            <h1 className="text-[18px] text-eye-white font-bold tracking-tight">Intelligence Core v4.2</h1>
            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] text-primary font-mono">SECURE</div>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-eye-text hover:text-eye-white cursor-pointer">
              <Share2 size={16} />
              <span className="text-xs font-medium">Export</span>
            </button>
            <div className="w-px h-4 bg-eye-border" />
            <button className="bg-eye-white text-eye-bg px-4 py-1.5 rounded-full text-xs font-bold hover:shadow-[0_0_15px_rgba(250,250,250,0.2)] transition-all active:scale-95">
              Upgrade Node
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[800px] mx-auto w-full px-6 py-12 space-y-12">
            {messages.map((msg, i) => (
              <div key={i} className="flex gap-6">
                {msg.role === "user" ? (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-eye-surface border border-eye-border flex-shrink-0 flex items-center justify-center">
                      <UserCheck size={20} className="text-eye-white" />
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="font-mono text-[10px] text-eye-text uppercase tracking-widest mb-2">Request — {msg.timestamp}</div>
                      <div className="text-eye-white text-[15px] leading-relaxed">{msg.text}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-eye-surface border border-eye-border flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5" />
                      <Sparkles size={20} className="text-primary relative z-10" />
                    </div>
                    <div className="flex-1 pt-2 space-y-6">
                      <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Response — {msg.timestamp}</div>

                      {msg.steps && msg.steps.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {msg.steps.map((step, si) => (
                            <div key={si} className="text-[10px] font-mono px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                              {step.agent} · {(step.duration / 1000).toFixed(1)}s
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-eye-white text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  </>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-eye-surface border border-eye-border flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                  <Loader2 size={20} className="text-primary relative z-10 animate-spin" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="font-mono text-[10px] text-primary uppercase tracking-widest">Synthesizing intelligence...</div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-eye-border p-4 bg-[#050505]">
          <div className="max-w-[800px] mx-auto">
            <div className="flex items-center gap-3 bg-eye-surface border border-eye-border rounded-xl px-5 py-4 focus-within:border-primary/50 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                disabled={loading}
                className="flex-1 bg-transparent outline-none text-sm text-eye-white placeholder:text-eye-text/50 disabled:opacity-50"
                placeholder="Ask the Intelligence Core..."
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-lg bg-primary text-eye-bg flex items-center justify-center transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
