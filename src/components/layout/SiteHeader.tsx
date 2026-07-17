import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-gray-800 bg-gray-950 px-6">
      <div className="flex-1" />
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input className="pl-9 bg-gray-900 border-gray-800 text-white placeholder-gray-500" placeholder="Search..." />
      </div>
      <button className="relative rounded-full p-2 hover:bg-gray-800">
        <Bell className="h-5 w-5 text-gray-400" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
        <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium border border-gray-800">
          E
        </div>
        <div className="text-sm">
          <p className="font-medium text-white">Admin</p>
          <p className="text-gray-500 text-xs">Administrator</p>
        </div>
      </div>
    </header>
  )
}