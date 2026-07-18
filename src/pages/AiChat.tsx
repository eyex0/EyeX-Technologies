import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { chatWithCopilotFn } from "@/services/chat.service";
import {
  Send,
  Plus,
  Search,
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

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export function AiChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  interface ChatResponse {
    success: boolean;
    text?: string;
    error?: string;
  }

  const chatMutation = useMutation<ChatResponse, Error, { message: string; history: { role: string; text: string }[] }>({
    mutationFn: async ({ message, history }) => {
      return chatWithCopilotFn({ data: { message, history } }) as Promise<ChatResponse>;
    },
    onSuccess: (result) => {
      if (result.success && result.text) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: result.text!, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
      } else {
        toast.error(result.error || "Failed to get response");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Connection failed. Please try again.");
    },
  });

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || chatMutation.isPending) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = { role: "user", text: trimmed, timestamp: now };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    chatMutation.mutate({
      message: trimmed,
      history: messages.map((m) => ({ role: m.role, text: m.text })),
    });

    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

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
          <button
            onClick={() => { setMessages([]); setMessage(""); }}
            className="w-full py-3 px-4 bg-white hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300 rounded flex items-center justify-center gap-2 text-background font-bold text-sm"
          >
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
          <button aria-label="Settings" className="text-eye-text hover:text-white transition-colors">
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
            <button aria-label="User profile" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-eye-border-hover transition-colors">
              <User className="text-xl w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Chat History */}
        <section className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full pb-32">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-primary-brand/10 rounded-full flex items-center justify-center mb-6">
                <Terminal className="text-primary-brand w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">QORX Analytic Core</h3>
              <p className="text-sm text-eye-text max-w-md">
                Issue a command to begin analysis. The orchestrator will route your request
                to the appropriate specialist agent.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col gap-3 group ${msg.role === "user" ? "items-end" : ""}`}
              data-fade-up
            >
              <div className="flex items-center gap-2">
                {msg.role === "assistant" && (
                  <span className="text-[10px] text-primary-brand uppercase tracking-widest font-mono">
                    QORX ANALYTIC
                  </span>
                )}
                <span className="text-[10px] text-eye-text/40 font-mono">{msg.timestamp}</span>
                {msg.role === "user" && (
                  <span className="text-[10px] text-eye-text uppercase tracking-widest font-mono">
                    ADMINISTRATOR
                  </span>
                )}
              </div>
              {msg.role === "assistant" ? (
                <div
                  className="pl-6 border-l-2 border-primary-brand py-2 relative"
                  style={{ background: "linear-gradient(90deg, rgba(56,189,248,0.05) 0%, transparent 100%)" }}
                >
                  <p className="text-eye-white leading-relaxed text-[16px] whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  <button
                    onClick={() => copyToClipboard(msg.text)}
                    className="absolute top-2 right-2 text-eye-text/30 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Copy response"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="bg-eye-surface border border-eye-border px-6 py-4 rounded-xl max-w-[85%]">
                  <p className="text-eye-white leading-relaxed text-[15px] whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
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
          )}

          <div ref={chatEndRef} />
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
                    ref={textareaRef}
                    className="w-full bg-transparent border-none focus:ring-0 text-[15px] leading-relaxed resize-none py-1 max-h-48 min-h-[44px]"
                    placeholder={chatMutation.isPending ? "Analytic Core processing..." : "Issue command to Analytic Core..."}
                    rows={1}
                    value={message}
                    disabled={chatMutation.isPending}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      e.currentTarget.style.height = "";
                      e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    aria-label="Send message"
                    onClick={handleSend}
                    disabled={chatMutation.isPending || !message.trim()}
                    className="w-10 h-10 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-background hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:bg-primary-brand transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
                  >
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
          <button
            onClick={() => { setMessages([]); setMessage(""); toast.success("Session purged"); }}
            className="w-full py-2.5 border border-eye-border hover:border-red-500/50 text-eye-text hover:text-red-400 text-xs font-mono rounded transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="text-sm w-4 h-4" />
            PURGE SESSION
          </button>
        </div>
      </aside>
    </div>
  );
}
