import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/pages/Notifications";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: 'Notifications | EyeX Technologies' },
      { name: "description", content: 'View and manage your notifications and alerts.' },
      { property: "og:title", content: 'Notifications | EyeX Technologies' },
      { property: "og:description", content: 'View and manage your notifications and alerts.' },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  ),
});
