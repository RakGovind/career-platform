const ACTION_VERBS = [
  'built', 'led', 'designed', 'improved', 'developed', 'created',
  'implemented', 'managed', 'launched', 'optimized', 'delivered',
  'achieved', 'established', 'reduced', 'increased', 'streamlined'
]

function summaryContainsActionVerbs(summary) {
  const lower = summary.toLowerCase()
  return ACTION_VERBS.some(v => lower.includes(v))
}

function hasExperienceWithBullets(data) {
  return (data.experience || []).some(e => e.details?.trim().length > 0)
}

export function computeAtsScore(data) {
  if (!data) {
    return {
      score: 0,
      breakdown: [],
      suggestions: ['Add resume data to get started'],
      band: 'red',
      bandLabel: 'No Data'
    }
  }
  const hasName = !!data.personal?.name?.trim()
  const hasEmail = !!data.personal?.email?.trim()
  const hasSummary = (data.summary || '').trim().length > 50
  const hasExpWithBullets = hasExperienceWithBullets(data)
  const hasEducation = (data.education || []).length >= 1
  const totalSkills =
    (data.skills?.technical?.length ?? 0) +
    (data.skills?.soft?.length ?? 0) +
    (data.skills?.tools?.length ?? 0)
  const hasSkills5 = totalSkills >= 5
  const hasProject = (data.projects || []).length >= 1
  const hasPhone = !!data.personal?.phone?.trim()
  const hasLinkedIn = !!data.links?.linkedin?.trim()
  const hasGitHub = !!data.links?.github?.trim()
  const hasActionVerbs = summaryContainsActionVerbs(data.summary || '')

  const breakdown = [
    { label: 'Name provided', earned: hasName, points: 10 },
    { label: 'Email provided', earned: hasEmail, points: 10 },
    { label: 'Summary (>50 chars)', earned: hasSummary, points: 10 },
    { label: '1+ experience with bullets', earned: hasExpWithBullets, points: 15 },
    { label: '1+ education entry', earned: hasEducation, points: 10 },
    { label: '5+ skills', earned: hasSkills5, points: 10 },
    { label: '1+ project', earned: hasProject, points: 10 },
    { label: 'Phone provided', earned: hasPhone, points: 5 },
    { label: 'LinkedIn provided', earned: hasLinkedIn, points: 5 },
    { label: 'GitHub provided', earned: hasGitHub, points: 5 },
    { label: 'Summary has action verbs', earned: hasActionVerbs, points: 10 }
  ]

  const score = Math.min(
    100,
    breakdown.filter(b => b.earned).reduce((sum, b) => sum + b.points, 0)
  )

  const suggestions = []
  if (!hasName) suggestions.push('Add your name (+10 points)')
  if (!hasEmail) suggestions.push('Add your email (+10 points)')
  if (!hasSummary) suggestions.push('Add a professional summary >50 chars (+10 points)')
  if (!hasExpWithBullets) suggestions.push('Add at least 1 experience with bullet points (+15 points)')
  if (!hasEducation) suggestions.push('Add at least 1 education entry (+10 points)')
  if (!hasSkills5) suggestions.push('Add at least 5 skills (+10 points)')
  if (!hasProject) suggestions.push('Add at least 1 project (+10 points)')
  if (!hasPhone) suggestions.push('Add your phone (+5 points)')
  if (!hasLinkedIn) suggestions.push('Add LinkedIn link (+5 points)')
  if (!hasGitHub) suggestions.push('Add GitHub link (+5 points)')
  if (!hasActionVerbs && (data.summary || '').trim()) {
    suggestions.push('Use action verbs in summary (built, led, designed, etc.) (+10 points)')
  }

  let band = 'red'
  let bandLabel = 'Needs Work'
  if (score >= 71) {
    band = 'green'
    bandLabel = 'Strong Resume'
  } else if (score >= 41) {
    band = 'amber'
    bandLabel = 'Getting There'
  }

  return {
    score,
    breakdown,
    suggestions,
    band,
    bandLabel
  }
}
