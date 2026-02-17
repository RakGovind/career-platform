import { useState, useEffect, useMemo, useCallback } from 'react'
import { JOBS_DATA } from '../services/jobsData'

const STORAGE_KEY = 'jt-saved'
const PREFS_KEY = 'jobTrackerPreferences'
const DIGEST_KEY_PREFIX = 'jobTrackerDigest_'
const STATUS_KEY = 'jobTrackerStatus'
const STATUS_HISTORY_KEY = 'jobTrackerStatusHistory'
const STATUS_HISTORY_MAX = 20
const APPLICATIONS_KEY = 'jt-applications'

function getTodayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getDefaultPreferences() {
  return {
    roleKeywords: '',
    preferredLocations: [],
    preferredMode: [],
    experienceLevel: '',
    skills: '',
    minMatchScore: 40
  }
}

export function useJobTracker() {
  const [savedIds, setSavedIds] = useState([])
  const [preferences, setPreferences] = useState(null)
  const [statusMap, setStatusMap] = useState({})
  const [statusHistory, setStatusHistory] = useState([])
  const [digest, setDigest] = useState(null)
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'latest',
    onlyAboveThreshold: false,
    status: ''
  })
  const [toast, setToast] = useState(null)
  const [applications, setApplications] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Normalize saved IDs to strings
        const normalized = Array.isArray(parsed) ? parsed.map(id => String(id)) : []
        setSavedIds(normalized)
      }
      
      const prefs = localStorage.getItem(PREFS_KEY)
      if (prefs) setPreferences(JSON.parse(prefs))
      
      const status = localStorage.getItem(STATUS_KEY)
      if (status) {
        try {
          const parsed = JSON.parse(status)
          // Normalize all statusMap keys to strings
          const normalizedStatusMap = {}
          Object.keys(parsed).forEach(key => {
            const normalizedKey = String(key)
            normalizedStatusMap[normalizedKey] = parsed[key]
          })
          setStatusMap(normalizedStatusMap)
        } catch (e) {
          console.error('Error parsing statusMap:', e)
          setStatusMap({})
        }
      }
      
      const history = localStorage.getItem(STATUS_HISTORY_KEY)
      if (history) setStatusHistory(JSON.parse(history))
      
      const todayDigest = localStorage.getItem(DIGEST_KEY_PREFIX + getTodayKey())
      if (todayDigest) setDigest(JSON.parse(todayDigest))

      const apps = localStorage.getItem(APPLICATIONS_KEY)
      if (apps) {
        try {
          const parsed = JSON.parse(apps)
          setApplications(Array.isArray(parsed) ? parsed : [])
        } catch (e) {
          setApplications([])
        }
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e)
    }
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds))
    } catch (e) {}
  }, [savedIds])

  useEffect(() => {
    try {
      if (preferences) {
        localStorage.setItem(PREFS_KEY, JSON.stringify(preferences))
      }
    } catch (e) {}
  }, [preferences])

  useEffect(() => {
    try {
      localStorage.setItem(STATUS_KEY, JSON.stringify(statusMap))
    } catch (e) {}
  }, [statusMap])

  useEffect(() => {
    try {
      localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(statusHistory))
    } catch (e) {}
  }, [statusHistory])

  useEffect(() => {
    try {
      if (digest) {
        localStorage.setItem(DIGEST_KEY_PREFIX + digest.date, JSON.stringify(digest))
      }
    } catch (e) {}
  }, [digest])

  useEffect(() => {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications))
    } catch (e) {}
  }, [applications])

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const saveJob = useCallback((id) => {
    const normalizedId = String(id)
    setSavedIds(prev => {
      // Check for duplicates inside the functional update to avoid stale closures
      if (prev.includes(normalizedId) || prev.some(x => String(x) === normalizedId)) {
        return prev // Already saved, don't add again
      }
      showToast('Job saved!')
      return [...prev, normalizedId]
    })
  }, [showToast])

  const removeSaved = useCallback((id) => {
    const normalizedId = String(id)
    setSavedIds(prev => {
      const newIds = prev.filter(x => String(x) !== normalizedId && x !== id)
      showToast('Job removed from saved')
      return newIds
    })
  }, [showToast])

  const isSaved = useCallback((id) => {
    const normalizedId = String(id)
    return savedIds.includes(normalizedId) || savedIds.includes(id)
  }, [savedIds])

  const getJobStatus = useCallback((jobId) => {
    // Normalize jobId to string for consistent lookup
    const normalizedId = String(jobId)
    const s = statusMap[normalizedId] || statusMap[jobId]
    return s === 'Applied' || s === 'Rejected' || s === 'Selected' || s === 'Not Applied' 
      ? s 
      : 'Not Applied'
  }, [statusMap])

  const setJobStatus = useCallback((jobId, status, job) => {
    // Normalize jobId to string before using as key
    const normalizedId = String(jobId)
    setStatusMap(prev => ({ ...prev, [normalizedId]: status }))
    
    if (status === 'Applied' || status === 'Rejected' || status === 'Selected') {
      setStatusHistory(prev => {
        const newHistory = [{
          jobId: normalizedId, // Store normalized ID
          title: job?.title || '',
          company: job?.company || '',
          status,
          dateChanged: new Date().toISOString()
        }, ...prev].slice(0, STATUS_HISTORY_MAX)
        return newHistory
      })
      showToast(`Status updated: ${status}`)
    }
  }, [showToast])

  const savePreferences = useCallback((prefs) => {
    setPreferences(prefs)
  }, [])

  const addApplication = useCallback((job) => {
    const id = String(Date.now())
    const newJob = {
      id,
      company: job.company || '',
      role: job.role || '',
      status: job.status || 'Not Applied',
      date: job.date || new Date().toISOString().slice(0, 10),
      notes: job.notes || ''
    }
    setApplications(prev => [...prev, newJob])
    showToast('Job added!')
    return newJob
  }, [showToast])

  const updateApplication = useCallback((id, updates) => {
    setApplications(prev =>
      prev.map(j => (String(j.id) === String(id) ? { ...j, ...updates } : j))
    )
    showToast('Job updated!')
  }, [showToast])

  const deleteApplication = useCallback((id) => {
    setApplications(prev => prev.filter(j => String(j.id) !== String(id)))
    showToast('Job removed')
  }, [showToast])

  const computeMatchScore = useCallback((job) => {
    if (!preferences) return 0
    let score = 0
    const title = (job.title || '').toLowerCase()
    const desc = (job.description || '').toLowerCase()
    const roleKeywords = (preferences.roleKeywords || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    
    if (roleKeywords.length) {
      if (roleKeywords.some(k => title.includes(k))) score += 25
      if (roleKeywords.some(k => desc.includes(k))) score += 15
    }
    
    const prefLocs = preferences.preferredLocations || []
    if (prefLocs.length && job.location && prefLocs.includes(job.location)) score += 15
    
    const prefMode = preferences.preferredMode || []
    if (prefMode.length && job.mode && prefMode.includes(job.mode)) score += 10
    
    if (preferences.experienceLevel && job.experience === preferences.experienceLevel) score += 10
    
    const userSkills = (preferences.skills || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
    const jobSkills = (job.skills || []).map(s => s.toLowerCase())
    if (userSkills.length && jobSkills.some(js => 
      userSkills.some(us => js.includes(us) || us.includes(js))
    )) score += 15
    
    if (job.postedDaysAgo != null && job.postedDaysAgo <= 2) score += 5
    if (job.source === 'LinkedIn') score += 5
    
    return Math.min(score, 100)
  }, [preferences])

  const jobsWithScores = useMemo(() => {
    return JOBS_DATA.map(job => ({
      ...job,
      matchScore: computeMatchScore(job)
    }))
  }, [computeMatchScore])

  const getFilterValues = useCallback(() => {
    const locs = new Set()
    const modes = new Set()
    const exps = new Set()
    const sources = new Set()
    
    JOBS_DATA.forEach(j => {
      locs.add(j.location)
      modes.add(j.mode)
      exps.add(j.experience)
      sources.add(j.source)
    })
    
    return {
      locations: Array.from(locs).sort(),
      modes: Array.from(modes).sort(),
      experiences: Array.from(exps).sort(),
      sources: Array.from(sources).sort()
    }
  }, [])

  const filteredJobs = useMemo(() => {
    let filtered = [...jobsWithScores]
    const minScore = preferences?.minMatchScore || 40

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase()
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(kw) || 
        j.company.toLowerCase().includes(kw)
      )
    }
    if (filters.location) filtered = filtered.filter(j => j.location === filters.location)
    if (filters.mode) filtered = filtered.filter(j => j.mode === filters.mode)
    if (filters.experience) filtered = filtered.filter(j => j.experience === filters.experience)
    if (filters.source) filtered = filtered.filter(j => j.source === filters.source)
    if (filters.onlyAboveThreshold) {
      filtered = filtered.filter(j => (j.matchScore || 0) >= minScore)
    }
    if (filters.status) {
      filtered = filtered.filter(j => {
        const normalizedId = String(j.id)
        return getJobStatus(normalizedId) === filters.status
      })
    }

    filtered.sort((a, b) => {
      if (filters.sort === 'match') {
        return (b.matchScore || 0) - (a.matchScore || 0)
      }
      if (filters.sort === 'salary') {
        const na = parseInt(a.salaryRange.match(/\d+/)?.[0] || '0')
        const nb = parseInt(b.salaryRange.match(/\d+/)?.[0] || '0')
        return nb - na
      }
      return (a.postedDaysAgo || 99) - (b.postedDaysAgo || 99)
    })

    return filtered
  }, [jobsWithScores, filters, preferences, getJobStatus])

  const savedJobs = useMemo(() => {
    if (!Array.isArray(savedIds) || savedIds.length === 0) {
      return []
    }
    // Normalize IDs to strings for comparison
    const normalizedIds = savedIds.map(id => String(id))
    const jobs = normalizedIds
      .map(id => JOBS_DATA.find(j => String(j.id) === id))
      .filter(Boolean)
    
    return jobs.map(job => ({
      ...job,
      matchScore: computeMatchScore(job)
    }))
  }, [savedIds, computeMatchScore])

  const generateDigest = useCallback(() => {
    const withScores = jobsWithScores
    const sorted = [...withScores].sort((a, b) => {
      const sa = a.matchScore != null ? a.matchScore : 0
      const sb = b.matchScore != null ? b.matchScore : 0
      if (sb !== sa) return sb - sa
      const da = a.postedDaysAgo != null ? a.postedDaysAgo : 99
      const db = b.postedDaysAgo != null ? b.postedDaysAgo : 99
      return da - db
    })
    const top10 = sorted.slice(0, 10)
    const newDigest = { date: getTodayKey(), jobs: top10 }
    setDigest(newDigest)
    showToast('Digest generated!')
    return newDigest
  }, [jobsWithScores, showToast])

  const formatDigestPlainText = useCallback((jobs) => {
    const lines = ['Top 10 Jobs For You — 9AM Digest', formatDigestDate(getTodayKey()), '']
    jobs.forEach((j, i) => {
      lines.push(`${i + 1}. ${j.title || ''} at ${j.company || ''}`)
      lines.push(`   Location: ${j.location || '—'} | Experience: ${j.experience || '—'} | Match: ${j.matchScore != null ? j.matchScore : '—'}`)
      lines.push(`   Apply: ${j.applyUrl || ''}`)
      lines.push('')
    })
    lines.push('This digest was generated based on your preferences.')
    return lines.join('\n')
  }, [])

  function formatDigestDate(ymd) {
    if (!ymd) return ''
    const parts = ymd.split('-')
    if (parts.length !== 3) return ymd
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[parseInt(parts[1], 10) - 1] || parts[1]
    return `${month} ${parseInt(parts[2], 10)}, ${parts[0]}`
  }

  return {
    jobs: filteredJobs,
    savedJobs,
    savedIds,
    preferences: preferences || getDefaultPreferences(),
    filters,
    statusMap,
    statusHistory,
    digest,
    toast,
    applications,
    isSaved,
    saveJob,
    removeSaved,
    setJobStatus,
    getJobStatus,
    savePreferences,
    setFilters,
    getFilterValues,
    computeMatchScore,
    generateDigest,
    formatDigestPlainText,
    formatDigestDate,
    showToast,
    addApplication,
    updateApplication,
    deleteApplication
  }
}
