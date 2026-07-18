import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { Card, Badge } from "@/components/common/primitives";
import { NotificationsService } from "@/services/data";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2, BellOff } from "lucide-react";
import { toast } from "sonner";

const TYPE_TONE: Record<string, "success" | "warn" | "danger" | "info" | "neutral"> = {
  info: "info",
  warning: "warn",
  error: "danger",
  success: "success",
  deal: "info",
  invoice: "warn",
  task: "info",
  system: "neutral",
};

export function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => NotificationsService.getNotifications(userId),
    enabled: !!userId,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => NotificationsService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", userId] }),
  });

  const markAllRead = useMutation({
    mutationFn: () => NotificationsService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      toast.success("All notifications marked as read");
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppShell title="Notifications" subtitle="Alerts & activity">
      <Card
        title="Recent"
        icon="notifications"
        action={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-white disabled:opacity-50"
            >
              {markAllRead.isPending ? "Marking..." : `Mark all read (${unreadCount})`}
            </button>
          ) : undefined
        }
      >
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <BellOff className="h-8 w-8" />
              <span className="text-sm">No notifications yet</span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-3 py-3 border-b border-border last:border-0 hover:bg-secondary/40 rounded ${!n.read ? "bg-secondary/20" : ""}`}
              >
                <div className="mt-0.5">
                  <Badge tone={TYPE_TONE[n.type] ?? "neutral"}>
                    {n.read ? "·" : "●"}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>
                  <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">
                    {new Date(n.created_at).toLocaleDateString()}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead.mutate(n.id)}
                    disabled={markRead.isPending}
                    className="text-[10px] font-mono uppercase text-muted-foreground hover:text-white disabled:opacity-50 shrink-0"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </AppShell>
  );
}
