import { createFileRoute } from "@tanstack/react-router";
import { IntegrationsPage } from "@/pages/Integrations";
export const Route = createFileRoute("/integrations")({ component: IntegrationsPage });
