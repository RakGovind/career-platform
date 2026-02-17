import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobTrackerContext } from '../context/JobTrackerContext'
import { Button } from '@/shared/components/Button'

export function JobTrackerDigest() {
  const navigate = useNavigate()
  const {
    preferences,
    digest,
    generateDigest,
    formatDigestPlainText,
    formatDigestDate,
    statusHistory
  } = useJobTrackerContext()

  const [copySuccess, setCopySuccess] = useState(false)

  if (!preferences) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Digest</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600 mb-4">Set preferences to generate a personalized digest.</p>
          <Button onClick={() => navigate('/job-tracker#settings')}>Go to Settings</Button>
        </div>
      </div>
    )
  }

  const handleGenerate = () => {
    generateDigest()
  }

  const handleCopy = async () => {
    if (!digest || !digest.jobs || digest.jobs.length === 0) return
    const text = formatDigestPlainText(digest.jobs)
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {}
  }

  const handleMailto = () => {
    if (!digest || !digest.jobs || digest.jobs.length === 0) return
    const text = formatDigestPlainText(digest.jobs)
    const subject = encodeURIComponent('My 9AM Job Digest')
    const body = encodeURIComponent(text)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const getScoreClass = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-blue-100 text-blue-800'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusClass = (status) => {
    if (status === 'Applied') return 'bg-blue-100 text-blue-800'
    if (status === 'Rejected') return 'bg-red-100 text-red-800'
    if (status === 'Selected') return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Digest</h1>
      
      <p className="text-gray-600 mb-4">Demo Mode: Daily 9AM trigger simulated manually.</p>

      <div className="mb-6">
        <Button onClick={handleGenerate}>
          Generate Today's 9AM Digest (Simulated)
        </Button>
      </div>

      {digest && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-2">Top 10 Jobs For You — 9AM Digest</h2>
          <p className="text-gray-600 mb-4">{formatDigestDate(digest.date)}</p>

          {digest.jobs.length === 0 ? (
            <p className="text-gray-600">No matching roles today. Check again tomorrow.</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {digest.jobs.map((job, i) => (
                  <div key={job.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <strong className="text-lg">{job.title}</strong>
                        {job.matchScore != null && (
                          <span className={`ml-2 px-2 py-1 rounded text-sm ${getScoreClass(job.matchScore)}`}>
                            {job.matchScore}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-500 mb-2">
                      {job.location || '—'} · {job.experience || '—'}
                    </p>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Apply
                    </a>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 mb-4">
                This digest was generated based on your preferences.
              </p>

              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleCopy}>
                  {copySuccess ? 'Copied' : 'Copy Digest to Clipboard'}
                </Button>
                <Button variant="secondary" onClick={handleMailto}>
                  Create Email Draft
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {statusHistory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Status Updates</h3>
          <div className="space-y-2">
            {statusHistory.map((h, i) => {
              const date = new Date(h.dateChanged)
              const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <strong>{h.title}</strong>
                  <span className="text-gray-600">{h.company}</span>
                  <span className={`px-2 py-1 rounded ${getStatusClass(h.status)}`}>
                    {h.status}
                  </span>
                  <span className="text-gray-500">{formattedDate}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
