import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Briefcase, FileText } from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/job-tracker', icon: Briefcase, label: 'Job Tracker' },
  { path: '/resume-builder', icon: FileText, label: 'Resume Builder' },
]

export function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          Career Platform
        </Link>
        <ul className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/')
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
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
      </div>
    </nav>
  )
}
