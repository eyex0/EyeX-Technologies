import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/pages/Admin";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — EyeX Technologies" },
      {
        name: "description",
        content:
          "System administration dashboard. Monitor Python backend services, agents, and system health.",
      },
      { property: "og:title", content: "Admin — EyeX Technologies" },
      { property: "og:description", content: "System administration dashboard." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  ),
});
