import { useEffect, useState, useRef } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bot, Send, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AiCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Copilot. I have access to your business data and can help you analyze it, generate reports, or answer questions about your operations." },
  ])
  const [input, setInput] = useState('')
  const [context, setContext] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([
      db.getCustomers(), db.getInvoices(), db.getDeals(), db.getProjects(), db.getEmployees(),
    ]).then(([customers, invoices, deals, projects, employees]) => {
      const paidInvoices = invoices.filter((i: any) => i.status === 'paid')
      const totalRevenue = paidInvoices.reduce((s: number, i: any) => s + Number(i.amount), 0)
      const pipelineValue = deals.filter((d: any) => d.stage !== 'closed_lost').reduce((s: number, d: any) => s + Number(d.value), 0)
      setContext(`Business Context: ${customers.length} customers, ${invoices.length} invoices (${paidInvoices.length} paid, total $${totalRevenue.toLocaleString()}), ${deals.length} deals (pipeline $${pipelineValue.toLocaleString()}), ${projects.length} projects, ${employees.length} employees.`)
    })
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: `Based on your business data:\n${context}\n\nI understand your question about "${input}". To provide specific analysis, I would connect to the Gemini API. For now, here's a summary of what I know about your business.`,
      }])
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Copilot</h1>
      <p className="text-sm text-gray-500">{context}</p>
      <Card className="h-[600px] flex flex-col">
        <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> AI Copilot Chat</CardTitle></CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-blue-600" /></div>}
              <div className={`max-w-[80%] rounded-lg p-3 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
              {m.role === 'user' && <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><User className="h-4 w-4 text-gray-600" /></div>}
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your business data..." onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
          <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
        </div>
      </Card>
    </div>
  )
}
