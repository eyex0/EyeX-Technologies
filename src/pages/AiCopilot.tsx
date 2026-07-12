import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/common/primitives";
import { ChatService } from "@/services/chat.service";

export function AiCopilotPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi — I'm your Copilot. Ask about revenue, customers, forecasts, or generate a report based on your connected datasets." },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggested = [
    "Why did revenue drop?",
    "Show customer growth.",
    "Generate executive summary.",
    "Forecast next month's cash flow",
    "Compare this month vs last month",
  ];

  const send = async (t: string) => {
    if (!t.trim() || loading) return;
    
    const newHistory = [...messages, { role: "user", text: t }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const responseText = await ChatService.sendMessage(t, messages);
      setMessages([...newHistory, { role: "assistant", text: responseText }]);
    } catch (error: any) {
      console.error(error);
      setMessages([...newHistory, { role: "assistant", text: `Error: ${error.message || 'Failed to communicate with Copilot.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Copilot" subtitle="Ask · Analyze · Generate">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
        <div className="lg:col-span-3 bento-card rounded-lg flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.role === "user" ? "bg-white text-black" : "text-white bg-white/5 border border-white/10"
                }`}>{msg.text}</div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="max-w-[70%] rounded-lg px-4 py-3 text-sm text-white bg-white/5 border border-white/10 flex items-center gap-2">
                   <span className="material-symbols-outlined animate-spin h-4 w-4">sync</span>
                   Analyzing...
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-border p-4 bg-background/50 backdrop-blur-md">
            <div className="flex gap-2 flex-wrap mb-3">
              {suggested.map((s) => (
                <button key={s} onClick={() => send(s)} disabled={loading} className="text-[11px] px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-secondary/40 disabled:opacity-50">{s}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 border border-border rounded-md px-4 py-3 bg-background focus-within:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">chat</span>
              <input 
                value={input} 
                onChange={(e)=>setInput(e.target.value)} 
                onKeyDown={(e)=>e.key==="Enter"&&send(input)} 
                disabled={loading}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground disabled:opacity-50" 
                placeholder="Ask Copilot anything..." 
              />
              <button 
                onClick={()=>send(input)} 
                disabled={loading || !input.trim()}
                className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Card title="Quick actions" icon="bolt">
            <div className="p-4 space-y-2">
              {["Summarize P&L","Draft weekly update","Find at-risk deals","Explain churn spike"].map((q) => (
                <button key={q} onClick={() => send(q)} disabled={loading} className="w-full text-left text-xs text-white px-3 py-2 rounded border border-border hover:bg-secondary/40 disabled:opacity-50">{q}</button>
              ))}
            </div>
          </Card>
          <Card title="Recent" icon="history">
            <div className="p-4 space-y-2 text-xs">
              {["MoM revenue analysis","Forecast Q4 cash","Top 10 accounts","Marketing ROAS report"].map((c) => (
                <div key={c} className="border-b border-border pb-2 last:border-0 text-muted-foreground hover:text-white cursor-pointer">{c}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

