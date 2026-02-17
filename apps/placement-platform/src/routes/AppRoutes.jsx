import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout'
import { Dashboard as MainDashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'
import { JobTrackerPage } from '@/features/job-tracker/pages/JobTrackerPage'
import { ResumeBuilderPage } from '@/features/resume-builder/pages/ResumeBuilderPage'

// Import existing placement platform pages
import LandingPage from '@/pages/LandingPage'
import DashboardLayout from '@/layouts/DashboardLayout'
import Practice from '@/pages/Practice'
import Assessments from '@/pages/Assessments'
import Analyze from '@/pages/Analyze'
import History from '@/pages/History'
import Results from '@/pages/Results'
import Resources from '@/pages/Resources'
import Profile from '@/pages/Profile'
import TestChecklist from '@/pages/TestChecklist'
import Ship from '@/pages/Ship'
import Proof from '@/pages/Proof'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Unified career platform routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/job-tracker" element={<JobTrackerPage />} />
        <Route path="/job-tracker/*" element={<JobTrackerPage />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />
      </Route>

      {/* Placement platform routes (existing) */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="practice" element={<Practice />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="history" element={<History />} />
        <Route path="results" element={<Results />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      <Route path="/prp/07-test" element={<TestChecklist />} />
      <Route path="/prp/proof" element={<Proof />} />
      <Route path="/prp/08-ship" element={<Ship />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
