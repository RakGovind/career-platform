/**
 * Export service for copying and downloading analysis data
 */

/**
 * Format 7-day plan as plain text
 */
export function formatPlanAsText(plan) {
  let text = '7-DAY PREPARATION PLAN\n'
  text += '='.repeat(50) + '\n\n'
  
  plan.forEach((dayPlan) => {
    text += `${dayPlan.day}: ${dayPlan.title}\n`
    dayPlan.tasks.forEach((task, index) => {
      text += `  ${index + 1}. ${task}\n`
    })
    text += '\n'
  })
  
  return text
}

/**
 * Format round checklist as plain text
 */
export function formatChecklistAsText(checklist) {
  let text = 'ROUND-WISE PREPARATION CHECKLIST\n'
  text += '='.repeat(50) + '\n\n'
  
  Object.entries(checklist).forEach(([round, items]) => {
    text += `${round}\n`
    items.forEach((item, index) => {
      text += `  ${index + 1}. ${item}\n`
    })
    text += '\n'
  })
  
  return text
}

/**
 * Format questions as plain text
 */
export function formatQuestionsAsText(questions) {
  let text = '10 LIKELY INTERVIEW QUESTIONS\n'
  text += '='.repeat(50) + '\n\n'
  
  questions.forEach((question, index) => {
    text += `${index + 1}. ${question}\n\n`
  })
  
  return text
}

/**
 * Format complete analysis as text
 */
export function formatCompleteAnalysisAsText(analysisData) {
  const { company, role, extractedSkills, checklist, plan, questions, readinessScore } = analysisData
  
  let text = 'PLACEMENT READINESS ANALYSIS\n'
  text += '='.repeat(50) + '\n\n'
  
  if (company) text += `Company: ${company}\n`
  if (role) text += `Role: ${role}\n`
  text += `Readiness Score: ${readinessScore}/100\n\n`
  
  text += '\n' + 'KEY SKILLS EXTRACTED\n'
  text += '='.repeat(50) + '\n\n'
  
  if (extractedSkills.hasSkills) {
    Object.entries(extractedSkills.categories).forEach(([category, skills]) => {
      text += `${category}:\n`
      skills.forEach(skill => {
        text += `  - ${skill}\n`
      })
      text += '\n'
    })
  } else {
    text += 'General fresher stack\n\n'
  }
  
  text += '\n' + formatChecklistAsText(checklist) + '\n'
  text += formatPlanAsText(plan) + '\n'
  text += formatQuestionsAsText(questions)
  
  return text
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Download text as file
 */
export function downloadAsFile(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
