import { lazy, Suspense, type ReactNode } from 'react'
import { createRoute, createRouter, createRootRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/layout/AppShell'
import { PageLoading } from '@/components/Loading'

function LazyLoad({ component: LazyComponent }: { component: React.LazyExoticComponent<() => ReactNode> }) {
  return (
    <Suspense fallback={<PageLoading text="Loading..." />}>
      <LazyComponent />
    </Suspense>
  )
}

const DashboardPage = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.DashboardPage })))
const FinancePage = lazy(() => import('@/pages/Finance').then(m => ({ default: m.FinancePage })))
const CrmPage = lazy(() => import('@/pages/Crm').then(m => ({ default: m.CrmPage })))
const SalesPage = lazy(() => import('@/pages/Sales').then(m => ({ default: m.SalesPage })))
const HrPage = lazy(() => import('@/pages/Hr').then(m => ({ default: m.HrPage })))
const ProjectsPage = lazy(() => import('@/pages/Projects').then(m => ({ default: m.ProjectsPage })))
const InventoryPage = lazy(() => import('@/pages/Inventory').then(m => ({ default: m.InventoryPage })))
const MarketingPage = lazy(() => import('@/pages/Marketing').then(m => ({ default: m.MarketingPage })))
const DocumentsAppPage = lazy(() => import('@/pages/DocumentsApp').then(m => ({ default: m.DocumentsAppPage })))
const ReportsPage = lazy(() => import('@/pages/Reports').then(m => ({ default: m.ReportsPage })))
const AnalyticsPage = lazy(() => import('@/pages/Analytics').then(m => ({ default: m.AnalyticsPage })))
const NotificationsPage = lazy(() => import('@/pages/Notifications').then(m => ({ default: m.NotificationsPage })))
const AiCopilotPage = lazy(() => import('@/pages/AiCopilot').then(m => ({ default: m.AiCopilotPage })))
const AiChatPage = lazy(() => import('@/pages/AiChat').then(m => ({ default: m.AiChatPage })))
const IntegrationsPage = lazy(() => import('@/pages/Integrations').then(m => ({ default: m.IntegrationsPage })))
const DataSourcesPage = lazy(() => import('@/pages/DataSources').then(m => ({ default: m.DataSourcesPage })))
const DataImportPage = lazy(() => import('@/pages/DataImport').then(m => ({ default: m.DataImportPage })))
const SettingsPage = lazy(() => import('@/pages/Settings').then(m => ({ default: m.SettingsPage })))

const rootRoute = createRootRoute({
  component: () => (
    <AppShell>
      <Suspense fallback={<PageLoading text="Loading..." />}>
        <Outlet />
      </Suspense>
    </AppShell>
  ),
})

function route(path: string, component: React.LazyExoticComponent<() => ReactNode>) {
  return createRoute({ getParentRoute: () => rootRoute, path, component: () => <LazyLoad component={component} /> })
}

const indexRoute = route('/', DashboardPage)
const financeRoute = route('/finance', FinancePage)
const crmRoute = route('/crm', CrmPage)
const salesRoute = route('/sales', SalesPage)
const hrRoute = route('/hr', HrPage)
const projectsRoute = route('/projects', ProjectsPage)
const inventoryRoute = route('/inventory', InventoryPage)
const marketingRoute = route('/marketing', MarketingPage)
const documentsRoute = route('/documents', DocumentsAppPage)
const reportsRoute = route('/reports', ReportsPage)
const analyticsRoute = route('/analytics', AnalyticsPage)
const notificationsRoute = route('/notifications', NotificationsPage)
const aiCopilotRoute = route('/ai-copilot', AiCopilotPage)
const aiChatRoute = route('/ai-chat', AiChatPage)
const integrationsRoute = route('/integrations', IntegrationsPage)
const dataSourcesRoute = route('/data-sources', DataSourcesPage)
const dataImportRoute = route('/data-import', DataImportPage)
const settingsRoute = route('/settings', SettingsPage)

const routeTree = rootRoute.addChildren([
  indexRoute, financeRoute, crmRoute, salesRoute, hrRoute, projectsRoute,
  inventoryRoute, marketingRoute, documentsRoute, reportsRoute, analyticsRoute,
  notificationsRoute, aiCopilotRoute, aiChatRoute, integrationsRoute, dataSourcesRoute, dataImportRoute, settingsRoute,
])

export const router = createRouter({ routeTree })
