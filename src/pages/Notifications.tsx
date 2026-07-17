import { useEffect, useState } from 'react'
import { db } from '@/services/database.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Bell } from 'lucide-react'

const typeVariant: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  success: 'success', warning: 'warning', error: 'danger', info: 'info',
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    db.getNotifications().then(setNotifications)
    const unsub = db.subscribeNotifications((payload) => {
      setNotifications((prev) => [payload, ...prev])
    })
    return () => unsub()
  }, [])

  const dismiss = async (id: string) => {
    await db.markNotificationRead(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <Card>
        <CardHeader><CardTitle>Recent Notifications</CardTitle></CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell className="h-12 w-12 mb-4" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n: any) => (
                <div key={n.id} className={`flex items-start justify-between p-4 rounded-lg border ${n.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{n.title}</p>
                        <Badge variant={typeVariant[n.type] || 'default'}>{n.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <button onClick={() => dismiss(n.id)} className="p-1 hover:bg-gray-100 rounded">
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
