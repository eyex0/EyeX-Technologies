import { createFileRoute } from "@tanstack/react-router";
import { AiChatPage } from "@/pages/AiChat";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
<<<<<<< HEAD
      { title: 'QORX AI Chat — EyeX Technologies' },
      { name: "description", content: 'Direct conversational access to the QORX intelligence core with persistent, auditable enterprise context.' },
      { property: "og:title", content: 'QORX AI Chat — EyeX Technologies' },
      { property: "og:description", content: 'Direct conversational access to the QORX intelligence core with persistent, auditable enterprise context.' },
=======
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
>>>>>>> origin/main
    ],
  }),
  component: AiChatPage,
});
