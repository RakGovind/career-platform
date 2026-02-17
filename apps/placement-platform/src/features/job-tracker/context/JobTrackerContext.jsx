import React, { createContext, useContext } from 'react'
import { useJobTracker } from '../hooks/useJobTracker'

const JobTrackerContext = createContext(null)

export function JobTrackerProvider({ children }) {
  const value = useJobTracker()
  return (
    <JobTrackerContext.Provider value={value}>
      {children}
    </JobTrackerContext.Provider>
  )
}

export function useJobTrackerContext() {
  const ctx = useContext(JobTrackerContext)
  if (!ctx) {
    throw new Error('useJobTrackerContext must be used within JobTrackerProvider')
  }
  return ctx
}
