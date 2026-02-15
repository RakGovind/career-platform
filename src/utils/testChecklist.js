/**
 * Test Checklist Storage Utility
 * Manages the built-in test checklist for shipping validation
 */

const STORAGE_KEY = 'prp_test_checklist'

const DEFAULT_TESTS = [
  {
    id: 'jd-validation',
    label: 'JD required validation works',
    hint: 'Try submitting empty JD - button should be disabled',
    passed: false
  },
  {
    id: 'jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Enter JD with <200 characters - warning should appear',
    passed: false
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze JD with React, DSA, SQL - verify skills grouped by category',
    passed: false
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Test Enterprise vs Startup companies - rounds should differ',
    passed: false
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Analyze same JD twice - scores should match',
    passed: false
  },
  {
    id: 'skill-toggles',
    label: 'Skill toggles update score live',
    hint: 'Toggle skills on Results page - score should update immediately',
    passed: false
  },
  {
    id: 'persistence',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page - changes should remain',
    passed: false
  },
  {
    id: 'history-save-load',
    label: 'History saves and loads correctly',
    hint: 'Create analysis, check History page - entry should appear',
    passed: false
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click copy buttons - verify clipboard contains correct formatted text',
    passed: false
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Check browser console on Analyze, Results, History pages - no errors',
    passed: false
  }
]

/**
 * Get test checklist from localStorage
 */
export function getTestChecklist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure all tests are present (merge with defaults for new tests)
      const merged = DEFAULT_TESTS.map(defaultTest => {
        const storedTest = parsed.find(t => t.id === defaultTest.id)
        return storedTest || defaultTest
      })
      return merged
    }
    return DEFAULT_TESTS
  } catch (error) {
    console.error('Error reading test checklist:', error)
    return DEFAULT_TESTS
  }
}

/**
 * Update a test's passed status
 */
export function updateTestStatus(testId, passed) {
  try {
    const checklist = getTestChecklist()
    const updated = checklist.map(test => 
      test.id === testId ? { ...test, passed } : test
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error updating test status:', error)
    return getTestChecklist()
  }
}

/**
 * Reset all tests to not passed
 */
export function resetTestChecklist() {
  try {
    const reset = DEFAULT_TESTS.map(test => ({ ...test, passed: false }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reset))
    return reset
  } catch (error) {
    console.error('Error resetting checklist:', error)
    return DEFAULT_TESTS
  }
}

/**
 * Check if all tests are passed
 */
export function areAllTestsPassed() {
  const checklist = getTestChecklist()
  return checklist.every(test => test.passed)
}

/**
 * Get count of passed tests
 */
export function getPassedCount() {
  const checklist = getTestChecklist()
  return checklist.filter(test => test.passed).length
}
