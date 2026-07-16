import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Badge } from "@/components/common/primitives";
import { supabase } from "@/lib/supabase/client";
import { DatabaseService } from "@/services/database.service";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const items = await DatabaseService.getNotifications(session.user.id);
      setNotifications(items);
      setLoading(false);
    };
    load();

    const sub = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: undefined,
        },
        (payload: any) => {
          setNotifications((prev) => [payload.new, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const dismiss = async (id: string) => {
    await DatabaseService.markNotificationRead(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AppShell title="Notifications" subtitle="Alerts & activity">
      <Card title={`Notifications (${notifications.length})`} icon="notifications">
        <div className="p-2">
          {loading ? (
            <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No notifications yet
            </div>
          ) : (
            notifications.map((n: any) => (
              <div
                key={n.id}
                className="flex items-start gap-3 px-3 py-3 border-b border-border last:border-0 hover:bg-secondary/40 rounded"
              >
                <div className="mt-0.5">
                  <Badge tone={n.read ? "neutral" : "info"}>·</Badge>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{n.title}</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    {n.type} · {new Date(n.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="text-[10px] font-mono uppercase text-muted-foreground hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </AppShell>
  );
}
