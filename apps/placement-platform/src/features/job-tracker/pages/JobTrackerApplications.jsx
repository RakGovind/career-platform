import React, { useState } from 'react'
import { useJobTrackerContext } from '../context/JobTrackerContext'
import { Button } from '@/shared/components/Button'

const STATUS_OPTIONS = ['Not Applied', 'Applied', 'Rejected', 'Selected']
const INITIAL_FORM = { company: '', role: '', status: 'Not Applied', date: '', notes: '' }

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

export function JobTrackerApplications() {
  const {
    applications,
    addApplication,
    updateApplication,
    deleteApplication
  } = useJobTrackerContext()

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [editingId, setEditingId] = useState(null)

  const resetForm = () => {
    setFormData(INITIAL_FORM)
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.company?.trim() || !formData.role?.trim()) return

    if (editingId) {
      updateApplication(editingId, {
        company: formData.company.trim(),
        role: formData.role.trim(),
        status: formData.status,
        date: formData.date || getTodayDate(),
        notes: formData.notes.trim()
      })
    } else {
      addApplication({
        company: formData.company.trim(),
        role: formData.role.trim(),
        status: formData.status,
        date: formData.date || getTodayDate(),
        notes: formData.notes.trim()
      })
    }
    resetForm()
  }

  const handleEdit = (job) => {
    setFormData({
      company: job.company || '',
      role: job.role || '',
      status: job.status || 'Not Applied',
      date: job.date || getTodayDate(),
      notes: job.notes || ''
    })
    setEditingId(job.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Remove this job from your list?')) {
      deleteApplication(id)
      if (editingId === id) resetForm()
    }
  }

  const handleCancel = () => {
    resetForm()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Applications</h1>
      <p className="text-gray-600 mb-6">
        Track your job applications. Add, edit, and remove entries. Data is saved automatically.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Job' : 'Add Job'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="e.g. Amazon"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g. SDE Intern"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Optional notes..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">
            {editingId ? 'Update' : 'Add Job'}
          </Button>
          {editingId && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h2 className="text-xl font-semibold px-6 py-4 border-b border-gray-200">
          Job List ({applications.length})
        </h2>
        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No applications yet. Add your first job above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {applications.map((job) => (
              <li key={job.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{job.role}</p>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm">
                      <span className={`px-2 py-0.5 rounded ${
                        job.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        job.status === 'Selected' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                      {job.date && (
                        <span className="text-gray-500">{job.date}</span>
                      )}
                    </div>
                    {job.notes && (
                      <p className="text-sm text-gray-500 mt-2 truncate" title={job.notes}>
                        {job.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="secondary" onClick={() => handleEdit(job)}>
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
