/**
 * Standardized Analysis Entry Schema
 * Ensures consistent data structure across the application
 */

/**
 * Default skills when no skills detected
 */
export const DEFAULT_SKILLS = {
  other: ['Communication', 'Problem solving', 'Basic coding', 'Projects']
}

/**
 * Create a standardized analysis entry
 */
export function createAnalysisEntry(data) {
  const now = new Date().toISOString()
  
  // Normalize extracted skills to standard format
  const normalizedSkills = normalizeExtractedSkills(data.extractedSkills || {})
  
  // Normalize round mapping
  const normalizedRoundMapping = normalizeRoundMapping(data.roundMapping || [])
  
  // Normalize checklist
  const normalizedChecklist = normalizeChecklist(data.checklist || {})
  
  // Normalize 7-day plan
  const normalizedPlan = normalizePlan(data.plan || [])
  
  return {
    id: data.id || Date.now().toString(),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    company: data.company || '',
    role: data.role || '',
    jdText: data.jdText || '',
    extractedSkills: normalizedSkills,
    roundMapping: normalizedRoundMapping,
    checklist: normalizedChecklist,
    plan7Days: normalizedPlan,
    questions: Array.isArray(data.questions) ? data.questions : [],
    baseScore: typeof data.baseScore === 'number' ? data.baseScore : (data.baseReadinessScore || data.readinessScore || 0),
    skillConfidenceMap: data.skillConfidenceMap || {},
    finalScore: typeof data.finalScore === 'number' ? data.finalScore : (data.readinessScore || data.baseReadinessScore || 0),
    companyIntel: data.companyIntel || null
  }
}

/**
 * Normalize extracted skills to standard format
 */
function normalizeExtractedSkills(skills) {
  if (!skills || typeof skills !== 'object') {
    return {
      coreCS: [],
      languages: [],
      web: [],
      data: [],
      cloud: [],
      testing: [],
      other: []
    }
  }

  // If using old format with categories
  if (skills.categories) {
    return {
      coreCS: skills.categories['Core CS'] || [],
      languages: skills.categories['Languages'] || [],
      web: skills.categories['Web'] || [],
      data: skills.categories['Data'] || [],
      cloud: skills.categories['Cloud/DevOps'] || [],
      testing: skills.categories['Testing'] || [],
      other: skills.categories['General'] || (skills.hasSkills === false ? DEFAULT_SKILLS.other : [])
    }
  }

  // If already in new format
  return {
    coreCS: Array.isArray(skills.coreCS) ? skills.coreCS : [],
    languages: Array.isArray(skills.languages) ? skills.languages : [],
    web: Array.isArray(skills.web) ? skills.web : [],
    data: Array.isArray(skills.data) ? skills.data : [],
    cloud: Array.isArray(skills.cloud) ? skills.cloud : [],
    testing: Array.isArray(skills.testing) ? skills.testing : [],
    other: Array.isArray(skills.other) ? skills.other : []
  }
}

/**
 * Normalize round mapping to standard format
 */
function normalizeRoundMapping(roundMapping) {
  if (!Array.isArray(roundMapping)) {
    return []
  }

  return roundMapping.map(round => ({
    roundTitle: round.roundTitle || round.title || `Round ${round.round || ''}`,
    focusAreas: Array.isArray(round.focusAreas) 
      ? round.focusAreas 
      : (round.description ? [round.description] : []),
    whyItMatters: round.whyItMatters || round.whyMatters || ''
  }))
}

/**
 * Normalize checklist to standard format
 */
function normalizeChecklist(checklist) {
  if (!checklist || typeof checklist !== 'object') {
    return []
  }

  // If using old format with round names as keys
  if (!Array.isArray(checklist)) {
    return Object.entries(checklist).map(([roundTitle, items]) => ({
      roundTitle,
      items: Array.isArray(items) ? items : []
    }))
  }

  // If already in new format
  return checklist.map(item => ({
    roundTitle: item.roundTitle || '',
    items: Array.isArray(item.items) ? item.items : []
  }))
}

/**
 * Normalize 7-day plan to standard format
 */
function normalizePlan(plan) {
  if (!Array.isArray(plan)) {
    return []
  }

  return plan.map(day => ({
    day: day.day || '',
    focus: day.focus || day.title || '',
    tasks: Array.isArray(day.tasks) ? day.tasks : []
  }))
}

/**
 * Validate analysis entry structure
 */
export function validateAnalysisEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return { valid: false, error: 'Entry is not an object' }
  }

  const requiredFields = ['id', 'createdAt', 'jdText', 'extractedSkills', 'baseScore', 'finalScore']
  
  for (const field of requiredFields) {
    if (!(field in entry)) {
      return { valid: false, error: `Missing required field: ${field}` }
    }
  }

  // Validate types
  if (typeof entry.id !== 'string') {
    return { valid: false, error: 'id must be a string' }
  }

  if (typeof entry.jdText !== 'string') {
    return { valid: false, error: 'jdText must be a string' }
  }

  if (typeof entry.baseScore !== 'number' || entry.baseScore < 0 || entry.baseScore > 100) {
    return { valid: false, error: 'baseScore must be a number between 0 and 100' }
  }

  if (typeof entry.finalScore !== 'number' || entry.finalScore < 0 || entry.finalScore > 100) {
    return { valid: false, error: 'finalScore must be a number between 0 and 100' }
  }

  if (!entry.extractedSkills || typeof entry.extractedSkills !== 'object') {
    return { valid: false, error: 'extractedSkills must be an object' }
  }

  return { valid: true }
}
