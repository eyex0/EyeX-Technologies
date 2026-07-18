import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, DollarSign, Users, ShoppingCart, Building2, FolderKanban,
  Package, FileText, Bell, Bot, BarChart3, Settings, Database, Megaphone,
  FileBarChart, Puzzle, MessageSquare, Upload,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/finance', icon: DollarSign, label: 'Finance' },
  { to: '/crm', icon: Users, label: 'CRM' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/hr', icon: Building2, label: 'HR' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/marketing', icon: Megaphone, label: 'Marketing' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/ai-copilot', icon: Bot, label: 'AI Copilot' },
  { to: '/ai-chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/integrations', icon: Puzzle, label: 'Integrations' },
  { to: '/data-sources', icon: Database, label: 'Data Sources' },
  { to: '/data-import', icon: Upload, label: 'Data Import' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-semibold text-lg">Enterprise</span>
        </Link>
      </div>
      <nav className="h-[calc(100vh-3.5rem)] overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}