import { createFileRoute } from "@tanstack/react-router";
import { DataSourcesPage } from "@/pages/DataSources";
export const Route = createFileRoute("/data-sources")({ component: DataSourcesPage });
