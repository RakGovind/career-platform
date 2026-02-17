import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, FileText, LayoutDashboard } from 'lucide-react'
import { Card } from '@/shared/components/Card'

export function Dashboard() {
  const features = [
    {
      title: 'Job Tracker',
      description: 'Track job applications, save opportunities, and manage your job search',
      icon: Briefcase,
      path: '/job-tracker',
      color: 'bg-blue-500'
    },
    {
      title: 'Resume Builder',
      description: 'Create and customize your professional resume',
      icon: FileText,
      path: '/resume-builder',
      color: 'bg-green-500'
    },
    {
      title: 'Placement Prep',
      description: 'Practice assessments, analyze job descriptions, and track your progress',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome to your unified career platform. Manage your job search, build your resume, and prepare for placements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.path}
              to={feature.path}
              className="block"
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
