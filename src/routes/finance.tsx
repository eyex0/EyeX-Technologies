import { createFileRoute } from "@tanstack/react-router";
import { FinancePage } from "@/pages/Finance";
export const Route = createFileRoute("/finance")({ component: FinancePage });
