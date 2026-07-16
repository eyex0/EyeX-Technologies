import { createFileRoute } from "@tanstack/react-router";
import { ApiPage } from "@/pages/Api";

export const Route = createFileRoute("/api")({
  head: () => ({
    meta: [
      { title: "API Platform — EyeX Technologies" },
      {
        name: "description",
        content:
          "Programmatic access to QORX. Typed endpoints, deterministic outputs, enterprise-grade rate limits.",
      },
      { property: "og:title", content: "API Platform — EyeX Technologies" },
      {
        property: "og:description",
        content:
          "Programmatic access to QORX. Typed endpoints, deterministic outputs, enterprise-grade rate limits.",
      },
    ],
  }),
  component: ApiPage,
});
