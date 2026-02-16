import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  BookMarked, 
  User,
  Menu,
  X,
  FileSearch,
  History
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/practice', icon: BookOpen, label: 'Practice' },
  { path: '/dashboard/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { path: '/dashboard/analyze', icon: FileSearch, label: 'Analyze JD' },
  { path: '/dashboard/history', icon: History, label: 'History' },
  { path: '/dashboard/resources', icon: BookMarked, label: 'Resources' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
]

function DashboardLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-xl font-bold text-primary">Placement Prep</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-primary hidden md:block">
                Placement Prep
              </h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
