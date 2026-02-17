import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobTrackerContext } from '../context/JobTrackerContext'
import { JobCard } from '../components/JobCard'
import { JobModal } from '../components/JobModal'

export function JobTrackerDashboard() {
  const navigate = useNavigate()
  const {
    jobs = [],
    preferences,
    filters,
    isSaved,
    saveJob,
    removeSaved,
    setJobStatus,
    getJobStatus,
    setFilters,
    getFilterValues
  } = useJobTrackerContext()

  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filterValues = getFilterValues()
  
  // Ensure jobs array exists
  if (!jobs || !Array.isArray(jobs)) {
    return <div className="max-w-7xl mx-auto p-6">Loading jobs...</div>
  }

  const handleView = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleStatusChange = (jobId, status, job) => {
    setJobStatus(jobId, status, job)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {!preferences || (preferences.roleKeywords === '' && preferences.preferredLocations.length === 0) ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            Set your preferences to activate intelligent matching.{' '}
            <button onClick={() => navigate('/job-tracker#settings')} className="underline">Go to Settings</button>
          </p>
        </div>
      ) : null}

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search title or company"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All locations</option>
            {filterValues.locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <select
            value={filters.mode}
            onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All modes</option>
            {filterValues.modes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All experience</option>
            {filterValues.experiences.map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All sources</option>
            {filterValues.sources.map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All</option>
            <option value="Not Applied">Not Applied</option>
            <option value="Applied">Applied</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="latest">Latest</option>
            <option value="match">Match Score</option>
            <option value="salary">Salary</option>
          </select>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.onlyAboveThreshold}
            onChange={(e) => setFilters({ ...filters, onlyAboveThreshold: e.target.checked })}
          />
          <span>Show only jobs above my threshold</span>
        </label>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No roles match your criteria. Adjust filters or lower threshold.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onSave={saveJob}
              onUnsave={removeSaved}
              onStatusChange={handleStatusChange}
              onView={handleView}
              currentStatus={getJobStatus(job.id)}
            />
          ))}
        </div>
      )}

      <JobModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
