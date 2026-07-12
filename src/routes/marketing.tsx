import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage } from "@/pages/Marketing";
export const Route = createFileRoute("/marketing")({ component: MarketingPage });
