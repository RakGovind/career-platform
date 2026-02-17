import React from 'react'
import { Button } from '@/shared/components/Button'

export function JobCard({ job, isSaved, onSave, onUnsave, onStatusChange, onView, currentStatus, showUnsave = false }) {
  const formatPosted = (days) => {
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    return `${days} days ago`
  }

  const getScoreClass = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-blue-100 text-blue-800'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusClass = (status) => {
    if (status === 'Applied') return 'bg-blue-100 text-blue-800 border-blue-300'
    if (status === 'Rejected') return 'bg-red-100 text-red-800 border-red-300'
    if (status === 'Selected') return 'bg-green-100 text-green-800 border-green-300'
    return 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const statuses = ['Not Applied', 'Applied', 'Rejected', 'Selected']

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            {job.matchScore != null && (
              <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreClass(job.matchScore)}`}>
                {job.matchScore}
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {job.source}
            </span>
          </div>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {[job.location, job.mode].filter(Boolean).join(' · ')}
        {job.experience && ` · ${job.experience}`}
        {job.salaryRange && ` · ${job.salaryRange}`}
        {` · ${formatPosted(job.postedDaysAgo || 0)}`}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => onStatusChange(job.id, status, job)}
            className={`px-3 py-1 rounded text-sm transition-colors border ${
              currentStatus === status
                ? getStatusClass(status)
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onView(job)}>
          View
        </Button>
        {showUnsave && isSaved ? (
          <Button variant="secondary" onClick={() => onUnsave(job.id)}>
            Remove
          </Button>
        ) : (
          <Button variant="secondary" onClick={() => isSaved ? onUnsave(job.id) : onSave(job.id)}>
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        )}
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Apply
        </a>
      </div>
    </div>
  )
}
