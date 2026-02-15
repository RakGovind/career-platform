import { extractSkills } from './skillExtraction'

/**
 * Calculate readiness score (0-100)
 * Start: 35
 * +5 per detected category (max 30)
 * +10 if company name provided
 * +10 if role provided
 * +10 if JD length > 800 chars
 * Cap at 100
 */
export function calculateReadinessScore(jdText, company = '', role = '') {
  let score = 35 // Base score

  // Extract skills to count categories
  const extracted = extractSkills(jdText)
  const categoryCount = Object.keys(extracted.categories).length
  
  // +5 per category (max 30)
  const categoryScore = Math.min(categoryCount * 5, 30)
  score += categoryScore

  // +10 if company name provided
  if (company && company.trim().length > 0) {
    score += 10
  }

  // +10 if role provided
  if (role && role.trim().length > 0) {
    score += 10
  }

  // +10 if JD length > 800 chars
  if (jdText && jdText.length > 800) {
    score += 10
  }

  // Cap at 100
  return Math.min(score, 100)
}

/**
 * Calculate live readiness score based on skill confidence
 * Base score + adjustments from skill confidence
 * +2 for each "know" skill, -2 for each "practice" skill
 */
export function calculateLiveReadinessScore(baseScore, skillConfidenceMap = {}, allSkills = []) {
  let score = baseScore
  
  allSkills.forEach(skill => {
    const confidence = skillConfidenceMap[skill]
    if (confidence === 'know') {
      score += 2
    } else if (confidence === 'practice') {
      score -= 2
    }
    // If not set, default is "practice" but we don't adjust (already accounted in base)
  })
  
  // Bounds: 0-100
  return Math.max(0, Math.min(100, score))
}
