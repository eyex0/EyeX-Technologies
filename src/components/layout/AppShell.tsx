import { Sidebar } from './Sidebar'
import { SiteHeader } from './SiteHeader'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <SiteHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}