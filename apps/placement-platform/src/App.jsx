import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import Assessments from './pages/Assessments'
import Analyze from './pages/Analyze'
import History from './pages/History'
import Results from './pages/Results'
import Resources from './pages/Resources'
import Profile from './pages/Profile'
import TestChecklist from './pages/TestChecklist'
import Ship from './pages/Ship'
import Proof from './pages/Proof'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
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
      </Routes>
    </Router>
  )
}

export default App
