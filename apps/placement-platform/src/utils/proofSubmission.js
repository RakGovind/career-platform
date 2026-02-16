/**
 * Proof Submission Storage Utility
 * Manages final submission artifacts and step completion
 */

const STORAGE_KEY = 'prp_final_submission'
const STEPS_KEY = 'prp_steps_completion'

const DEFAULT_STEPS = [
  { id: 'step-1', label: 'Design System Created', completed: false },
  { id: 'step-2', label: 'Landing Page Built', completed: false },
  { id: 'step-3', label: 'Dashboard Layout Implemented', completed: false },
  { id: 'step-4', label: 'JD Analysis Engine Built', completed: false },
  { id: 'step-5', label: 'Interactive Features Added', completed: false },
  { id: 'step-6', label: 'Company Intel Integrated', completed: false },
  { id: 'step-7', label: 'Data Model Hardened', completed: false },
  { id: 'step-8', label: 'Test Checklist Completed', completed: false }
]

/**
 * Get proof submission data
 */
export function getProofSubmission() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {
      lovableLink: '',
      githubLink: '',
      deployedLink: ''
    }
  } catch (error) {
    console.error('Error reading proof submission:', error)
    return {
      lovableLink: '',
      githubLink: '',
      deployedLink: ''
    }
  }
}

/**
 * Save proof submission data
 */
export function saveProofSubmission(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Error saving proof submission:', error)
    return false
  }
}

/**
 * Get step completion status
 */
export function getStepsCompletion() {
  try {
    const stored = localStorage.getItem(STEPS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to ensure all steps present
      return DEFAULT_STEPS.map(defaultStep => {
        const storedStep = parsed.find(s => s.id === defaultStep.id)
        return storedStep || defaultStep
      })
    }
    return DEFAULT_STEPS
  } catch (error) {
    console.error('Error reading steps:', error)
    return DEFAULT_STEPS
  }
}

/**
 * Update step completion status
 */
export function updateStepCompletion(stepId, completed) {
  try {
    const steps = getStepsCompletion()
    const updated = steps.map(step =>
      step.id === stepId ? { ...step, completed } : step
    )
    localStorage.setItem(STEPS_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error updating step:', error)
    return getStepsCompletion()
  }
}

/**
 * Check if all steps are completed
 */
export function areAllStepsCompleted() {
  const steps = getStepsCompletion()
  return steps.every(step => step.completed)
}

/**
 * Check if all proof links are provided
 */
export function areAllProofLinksProvided() {
  const submission = getProofSubmission()
  return !!(
    submission.lovableLink &&
    submission.githubLink &&
    submission.deployedLink
  )
}

/**
 * Validate URL format
 */
export function validateURL(url) {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'URL is required' }
  }

  try {
    const urlObj = new URL(url)
    // Check for http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must start with http:// or https://' }
    }
    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Invalid URL format' }
  }
}
