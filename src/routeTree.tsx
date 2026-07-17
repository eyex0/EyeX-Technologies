import { createRoute, createRouter, createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/Dashboard'
import { FinancePage } from '@/pages/Finance'
import { CrmPage } from '@/pages/Crm'
import { SalesPage } from '@/pages/Sales'
import { HrPage } from '@/pages/Hr'
import { ProjectsPage } from '@/pages/Projects'
import { InventoryPage } from '@/pages/Inventory'
import { MarketingPage } from '@/pages/Marketing'
import { DocumentsAppPage } from '@/pages/DocumentsApp'
import { ReportsPage } from '@/pages/Reports'
import { AnalyticsPage } from '@/pages/Analytics'
import { NotificationsPage } from '@/pages/Notifications'
import { AiCopilotPage } from '@/pages/AiCopilot'
import { AiChatPage } from '@/pages/AiChat'
import { IntegrationsPage } from '@/pages/Integrations'
import { DataSourcesPage } from '@/pages/DataSources'
import { SettingsPage } from '@/pages/Settings'
import { DataImportPage } from '@/pages/DataImport'

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
})

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: DashboardPage })
const financeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/finance', component: FinancePage })
const crmRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crm', component: CrmPage })
const salesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sales', component: SalesPage })
const hrRoute = createRoute({ getParentRoute: () => rootRoute, path: '/hr', component: HrPage })
const projectsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/projects', component: ProjectsPage })
const inventoryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/inventory', component: InventoryPage })
const marketingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/marketing', component: MarketingPage })
const documentsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/documents', component: DocumentsAppPage })
const reportsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/reports', component: ReportsPage })
const analyticsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/analytics', component: AnalyticsPage })
const notificationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/notifications', component: NotificationsPage })
const aiCopilotRoute = createRoute({ getParentRoute: () => rootRoute, path: '/ai-copilot', component: AiCopilotPage })
const aiChatRoute = createRoute({ getParentRoute: () => rootRoute, path: '/ai-chat', component: AiChatPage })
const integrationsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/integrations', component: IntegrationsPage })
const dataSourcesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/data-sources', component: DataSourcesPage })
const dataImportRoute = createRoute({ getParentRoute: () => rootRoute, path: '/data-import', component: DataImportPage })
const settingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: SettingsPage })

const routeTree = rootRoute.addChildren([
  indexRoute, financeRoute, crmRoute, salesRoute, hrRoute, projectsRoute,
  inventoryRoute, marketingRoute, documentsRoute, reportsRoute, analyticsRoute,
  notificationsRoute, aiCopilotRoute, aiChatRoute, integrationsRoute, dataSourcesRoute, dataImportRoute, settingsRoute,
])

export const router = createRouter({ routeTree })
