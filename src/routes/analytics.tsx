import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/pages/Analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — EyeX Technologies" },
      { name: "description", content: "Cross-module intelligence and business analytics. Track KPIs, traffic, and performance across your entire operation." },
      { property: "og:title", content: "Analytics — EyeX Technologies" },
      { property: "og:description", content: "Cross-module intelligence and business analytics." },
    ],
  }),
  component: AnalyticsPage,
});
