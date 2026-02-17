import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  BookMarked, 
  User,
  FileSearch,
  History,
  Briefcase,
  FileText
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/job-tracker', icon: Briefcase, label: 'Job Tracker' },
  { path: '/resume-builder', icon: FileText, label: 'Resume Builder' },
  { path: '/dashboard/practice', icon: BookOpen, label: 'Practice' },
  { path: '/dashboard/assessments', icon: ClipboardCheck, label: 'Assessments' },
  { path: '/dashboard/analyze', icon: FileSearch, label: 'Analyze JD' },
  { path: '/dashboard/history', icon: History, label: 'History' },
  { path: '/dashboard/resources', icon: BookMarked, label: 'Resources' },
  { path: '/dashboard/profile', icon: User, label: 'Profile' },
]

export function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:hidden">
          <h2 className="text-xl font-bold text-primary">Career Platform</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/')
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
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
    </>
  )
}
