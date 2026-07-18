import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { FinanceService } from "./data/finance.service";
import { CrmService } from "./data/crm.service";
import { SalesService } from "./data/sales.service";
import { HrService } from "./data/hr.service";
import { ProjectsService } from "./data/projects.service";
import { InventoryService } from "./data/inventory.service";
import { NotificationsService } from "./data/notifications.service";

function getSupabase() {
  const request = getRequest();
  const cookieHeader = request.headers.get("cookie") || "";
  return createServerSupabase(cookieHeader);
}

async function getOrgId() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();
  return profile?.organization_id || null;
}

// Auth
export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export const getOrganizationId = createServerFn({ method: "GET" }).handler(async () => {
  return getOrgId();
});

// Finance
export const getInvoicesFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return FinanceService.getInvoices(orgId || undefined);
});

export const getFinanceSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return FinanceService.getSummary(orgId || undefined);
});

// CRM
export const getCrmSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return CrmService.getSummary(orgId || undefined);
});

// Sales
export const getSalesSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return SalesService.getSummary(orgId || undefined);
});

// HR
export const getHrSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return HrService.getSummary(orgId || undefined);
});

// Projects
export const getProjectsSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return ProjectsService.getSummary(orgId || undefined);
});

// Inventory
export const getInventorySummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  const orgId = await getOrgId();
  return InventoryService.getSummary(orgId || undefined);
});

// Notifications
export const getUnreadNotificationsFn = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  return NotificationsService.getUnreadCount(user.id);
});

export const markNotificationReadFn = createServerFn({ method: "POST" })
  .validator((data: { notificationId: string }) => data)
  .handler(async ({ data }) => {
    await NotificationsService.markAsRead(data.notificationId);
    return { success: true };
  });
