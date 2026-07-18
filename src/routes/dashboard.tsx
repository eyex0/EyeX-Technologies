import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EyeX Technologies" },
      { name: "description", content: "Real-time business intelligence dashboard. Monitor revenue, customers, growth, and AI-powered insights." },
      { property: "og:title", content: "Dashboard — EyeX Technologies" },
      { property: "og:description", content: "Real-time business intelligence dashboard." },
    ],
  }),
  component: DashboardPage,
});
