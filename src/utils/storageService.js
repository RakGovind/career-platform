import { createAnalysisEntry, validateAnalysisEntry } from './schema'

const STORAGE_KEY = 'placement_readiness_history'

/**
 * Save analysis to localStorage with standardized schema
 */
export function saveAnalysis(analysisData) {
  try {
    const history = getHistory()
    const newEntry = createAnalysisEntry({
      ...analysisData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    // Validate before saving
    const validation = validateAnalysisEntry(newEntry)
    if (!validation.valid) {
      console.error('Invalid entry:', validation.error)
      return null
    }
    
    history.unshift(newEntry) // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return newEntry
  } catch (error) {
    console.error('Error saving analysis:', error)
    return null
  }
}

/**
 * Get all history entries with error handling for corrupted entries
 */
export function getHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      console.error('History is not an array, resetting')
      localStorage.removeItem(STORAGE_KEY)
      return []
    }
    
    // Filter out corrupted entries
    const validEntries = []
    let corruptedCount = 0
    
    for (const entry of parsed) {
      const validation = validateAnalysisEntry(entry)
      if (validation.valid) {
        // Normalize entry to ensure schema compliance
        validEntries.push(createAnalysisEntry(entry))
      } else {
        corruptedCount++
        console.warn('Corrupted entry skipped:', validation.error, entry)
      }
    }
    
    // If we filtered out entries, save the cleaned version
    if (corruptedCount > 0 && validEntries.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validEntries))
    }
    
    return validEntries
  } catch (error) {
    console.error('Error reading history:', error)
    // If parsing fails, clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // Ignore cleanup errors
    }
    return []
  }
}

/**
 * Get a specific history entry by ID with validation
 */
export function getHistoryEntry(id) {
  try {
    const history = getHistory()
    const entry = history.find(e => e.id === id)
    
    if (!entry) {
      return null
    }
    
    // Validate and normalize
    const validation = validateAnalysisEntry(entry)
    if (!validation.valid) {
      console.warn('Entry validation failed:', validation.error)
      return null
    }
    
    return createAnalysisEntry(entry)
  } catch (error) {
    console.error('Error getting entry:', error)
    return null
  }
}

/**
 * Delete a history entry
 */
export function deleteHistoryEntry(id) {
  try {
    const history = getHistory()
    const filtered = history.filter(entry => entry.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting entry:', error)
    return false
  }
}

/**
 * Update a history entry with score stability rules
 */
export function updateHistoryEntry(id, updates) {
  try {
    const history = getHistory()
    const index = history.findIndex(entry => entry.id === id)
    
    if (index === -1) {
      return false
    }
    
    const existingEntry = history[index]
    
    // Score stability: baseScore never changes, only finalScore updates
    const updatedEntry = createAnalysisEntry({
      ...existingEntry,
      ...updates,
      updatedAt: new Date().toISOString(),
      // Preserve baseScore - never update it
      baseScore: existingEntry.baseScore !== undefined ? existingEntry.baseScore : existingEntry.baseReadinessScore || 0
    })
    
    // Validate before saving
    const validation = validateAnalysisEntry(updatedEntry)
    if (!validation.valid) {
      console.error('Invalid entry after update:', validation.error)
      return false
    }
    
    history[index] = updatedEntry
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    return updatedEntry
  } catch (error) {
    console.error('Error updating entry:', error)
    return false
  }
}

/**
 * Clear all history
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing history:', error)
    return false
  }
}
