import React from 'react'
import { Button } from '@/shared/components/Button'

export function JobModal({ job, isOpen, onClose }) {
  if (!isOpen || !job) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
        <p className="text-lg text-gray-600 mb-6">{job.company}</p>

        <div className="mb-6">
          <p className="font-semibold mb-2">Description</p>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description || ''}</p>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="mb-6">
            <p className="font-semibold mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
