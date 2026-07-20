import { createFileRoute } from "@tanstack/react-router";
import { AiChatPage } from "@/pages/AiChat";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — EyeX Technologies" },
      {
        name: "description",
        content:
          "Direct conversational access to the QORX intelligence core with persistent, auditable enterprise context.",
      },
      { property: "og:title", content: "AI Chat — EyeX Technologies" },
      {
        property: "og:description",
        content:
          "Direct conversational access to the QORX intelligence core with persistent, auditable enterprise context.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <AiChatPage />
    </ProtectedRoute>
  ),
});
