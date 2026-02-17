import React, { useState } from 'react'
import { useJobTrackerContext } from '../context/JobTrackerContext'
import { JobCard } from '../components/JobCard'
import { JobModal } from '../components/JobModal'

export function JobTrackerSaved() {
  const {
    savedJobs = [],
    isSaved,
    removeSaved,
    setJobStatus,
    getJobStatus,
    savedIds = []
  } = useJobTrackerContext()

  const [selectedJob, setSelectedJob] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleView = (job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleStatusChange = (jobId, status, job) => {
    setJobStatus(jobId, status, job)
  }

  // Ensure savedJobs is an array
  const jobsToDisplay = Array.isArray(savedJobs) ? savedJobs : []

  if (!jobsToDisplay || jobsToDisplay.length === 0) {
    return (
      <div className="max-w-7xl mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Saved</h1>
        <p className="text-gray-600">
          No saved jobs yet. Save jobs from the Dashboard to see them here.
        </p>
        {savedIds.length > 0 && (
          <p className="text-sm text-yellow-600 mt-2">
            Debug: Found {savedIds.length} saved IDs but no jobs matched.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Saved ({jobsToDisplay.length})</h1>
      <div className="grid grid-cols-1 gap-4">
        {jobsToDisplay.map(job => {
          if (!job || !job.id) return null
          return (
            <JobCard
              key={job.id}
              job={job}
              isSaved={isSaved(job.id)}
              onSave={() => {}}
              onUnsave={removeSaved}
              onStatusChange={handleStatusChange}
              onView={handleView}
              currentStatus={getJobStatus(job.id)}
              showUnsave={true}
            />
          )
        })}
      </div>

      <JobModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
