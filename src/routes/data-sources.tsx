import { createFileRoute } from "@tanstack/react-router";
import { DataSourcesPage } from "@/pages/DataSources";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const Route = createFileRoute("/data-sources")({
  head: () => ({
    meta: [
      { title: "Data Sources | EyeX Technologies" },
      {
        name: "description",
        content: "Manage and connect your data sources for unified business intelligence.",
      },
      { property: "og:title", content: "Data Sources | EyeX Technologies" },
      {
        property: "og:description",
        content: "Manage and connect your data sources for unified business intelligence.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <DataSourcesPage />
    </ProtectedRoute>
  ),
});
