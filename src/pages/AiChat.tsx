import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function AiChatPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Chat</h1>
      <Card className="flex flex-col items-center justify-center py-20">
        <CardContent className="text-center">
          <Sparkles className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">AI Chat Coming Soon</h2>
          <p className="text-gray-500 max-w-md">This page will provide a standalone AI chat interface for general questions and assistance, separate from business-specific copilot features.</p>
        </CardContent>
      </Card>
    </div>
  )
}
