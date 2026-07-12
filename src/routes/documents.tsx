import { createFileRoute } from "@tanstack/react-router";
import { DocumentsAppPage } from "@/pages/DocumentsApp";
export const Route = createFileRoute("/documents")({ component: DocumentsAppPage });
