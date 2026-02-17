import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { JobTrackerProvider, useJobTrackerContext } from '../context/JobTrackerContext'
import { JobTrackerDashboard } from './JobTrackerDashboard'
import { JobTrackerSaved } from './JobTrackerSaved'
import { JobTrackerDigest } from './JobTrackerDigest'
import { JobTrackerSettings } from './JobTrackerSettings'
import { JobTrackerApplications } from './JobTrackerApplications'
import { Toast } from '../components/Toast'

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'saved', label: 'Saved' },
  { id: 'applications', label: 'My Applications' },
  { id: 'digest', label: 'Digest' },
  { id: 'settings', label: 'Settings' }
]

function JobTrackerContent() {
  const location = useLocation()
  const { toast, showToast } = useJobTrackerContext()
  const [activeTab, setActiveTab] = useState('dashboard')

  // Sync with URL hash if present
  useEffect(() => {
    const hash = location.hash.replace('#', '') || 'dashboard'
    if (TABS.some(t => t.id === hash)) {
      setActiveTab(hash)
    } else {
      setActiveTab('dashboard')
    }
  }, [location.hash])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    window.location.hash = tab
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <nav className="flex border-b border-gray-200 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'dashboard' && <JobTrackerDashboard />}
      {activeTab === 'saved' && <JobTrackerSaved />}
      {activeTab === 'applications' && <JobTrackerApplications />}
      {activeTab === 'digest' && <JobTrackerDigest />}
      {activeTab === 'settings' && <JobTrackerSettings />}

      <Toast message={toast} onClose={() => showToast(null)} />
    </div>
  )
}

export function JobTrackerPage() {
  return (
    <JobTrackerProvider>
      <JobTrackerContent />
    </JobTrackerProvider>
  )
}
