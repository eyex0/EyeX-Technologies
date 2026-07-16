import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/common/primitives";
import { ChatService } from "@/services/chat.service";
import { DatabaseService } from "@/services/database.service";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 85, damping: 15 } },
};

export function AiCopilotPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi — I'm your Copilot. Ask about revenue, customers, deals, projects, or your entire business." }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await DatabaseService.getChatHistory();
        if (history && history.length > 0) setMessages(history.map(m => ({ role: m.role, text: m.content })));
      } catch (err) { console.error("Failed to load chat history", err); }
    };
    loadHistory();
  }, []);

  const getContext = async () => {
    const [customers, invoices, deals, projects, products, employees] = await Promise.all([
      DatabaseService.getCustomers().catch(() => []),
      DatabaseService.getInvoices().catch(() => []),
      DatabaseService.getDeals().catch(() => []),
      DatabaseService.getProjects().catch(() => []),
      DatabaseService.getProducts().catch(() => []),
      DatabaseService.getEmployees().catch(() => []),
    ]);
    return `Business context — Customers: ${customers.length}, Invoices: ${invoices.length} (${invoices.filter(i => i.status === "paid").length} paid), Deals: ${deals.length} (pipeline: $${deals.reduce((s, d) => s + Number(d.value || 0), 0).toLocaleString()}), Projects: ${projects.length} (${projects.filter(p => p.status === "active").length} active), Products: ${products.length}, Employees: ${employees.length}.`;
  };

  const send = async (t: string) => {
    if (!t.trim() || loading) return;
    const userMessage = { role: "user" as const, text: t };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      await DatabaseService.saveChatMessage("user", t);
      const context = await getContext();
      const responseText = await ChatService.sendMessage(`[Context: ${context}]\n\n${t}`, messages);
      await DatabaseService.saveChatMessage("assistant", responseText);
      setMessages([...newHistory, { role: "assistant", text: responseText }]);
    } catch (error: any) {
      console.error(error);
      setMessages([...newHistory, { role: "assistant", text: `Error: ${error.message || "Failed to communicate with Copilot."}` }]);
    } finally {
      setLoading(false);
    }
  };

  const suggested = [
    "Why did revenue drop?",
    "Show customer growth.",
    "Generate executive summary.",
    "Forecast next month's cash flow",
    "Compare this month vs last month",
  ];

  return (
    <AppShell title="AI Copilot" subtitle="Ask · Analyze · Generate">
      <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="lg:col-span-3 bento-card rounded-lg flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${msg.role === "user" ? "bg-white text-black font-medium" : "text-white bg-white/5 border border-white/10"}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="max-w-[70%] rounded-lg px-4 py-3 text-sm text-white bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs text-muted-foreground">Analyzing business data...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-border p-4 bg-background/50 backdrop-blur-md">
            <div className="flex gap-2 flex-wrap mb-3">
              {suggested.map(s => (
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }} whileTap={{ scale: 0.98 }} key={s} onClick={() => send(s)} disabled={loading}
                  className="text-[11px] px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:text-white hover:bg-secondary/40 disabled:opacity-50 cursor-pointer">
                  {s}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center gap-2 border border-border rounded-md px-4 py-3 bg-background focus-within:border-primary/50 transition-colors">
              <span className="material-symbols-outlined text-muted-foreground text-[18px]">chat</span>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} disabled={loading}
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground disabled:opacity-50" placeholder="Ask Copilot anything..." />
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => send(input)} disabled={loading || !input.trim()}
                className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <Card title="Quick actions" icon="bolt">
            <div className="p-4 space-y-2">
              {["Summarize business", "Find at-risk deals", "Compare revenue", "Explain churn spike"].map(q => (
                <motion.button whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }} whileTap={{ scale: 0.98 }} key={q} onClick={() => send(q)} disabled={loading}
                  className="w-full text-left text-xs text-white px-3 py-2 rounded border border-border hover:bg-secondary/40 disabled:opacity-50 cursor-pointer">
                  {q}
                </motion.button>
              ))}
            </div>
          </Card>
          <Card title="Data sources" icon="database">
            <div className="p-4 space-y-2 text-xs text-muted-foreground">
              <div>Finance · Invoices & budgets</div>
              <div>CRM · Customers & deals</div>
              <div>Projects · Tasks & milestones</div>
              <div>Inventory · Stock & products</div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}
