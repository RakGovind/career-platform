import React, { useState, useEffect } from 'react'
import { useJobTrackerContext } from '../context/JobTrackerContext'
import { Button } from '@/shared/components/Button'

const defaultPreferences = {
  roleKeywords: '',
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: '',
  skills: '',
  minMatchScore: 40
}

export function JobTrackerSettings() {
  const {
    preferences,
    savePreferences,
    getFilterValues,
    showToast
  } = useJobTrackerContext()

  const filterValues = getFilterValues()
  // Initialize formData with preferences, ensuring it's always an object
  const [formData, setFormData] = useState(() => {
    if (preferences && typeof preferences === 'object') {
      return {
        roleKeywords: preferences.roleKeywords || '',
        preferredLocations: Array.isArray(preferences.preferredLocations) ? preferences.preferredLocations : [],
        preferredMode: Array.isArray(preferences.preferredMode) ? preferences.preferredMode : [],
        experienceLevel: preferences.experienceLevel || '',
        skills: preferences.skills || '',
        minMatchScore: preferences.minMatchScore || 40
      }
    }
    return defaultPreferences
  })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Only sync from preferences on initial load, not on every change
  useEffect(() => {
    if (!isInitialized && preferences) {
      setFormData({
        roleKeywords: preferences.roleKeywords || '',
        preferredLocations: Array.isArray(preferences.preferredLocations) ? preferences.preferredLocations : [],
        preferredMode: Array.isArray(preferences.preferredMode) ? preferences.preferredMode : [],
        experienceLevel: preferences.experienceLevel || '',
        skills: preferences.skills || '',
        minMatchScore: preferences.minMatchScore || 40
      })
      setIsInitialized(true)
    }
  }, [preferences, isInitialized])

  const handleSave = () => {
    // Ensure all required fields have defaults
    const dataToSave = {
      roleKeywords: formData.roleKeywords || '',
      preferredLocations: Array.isArray(formData.preferredLocations) ? formData.preferredLocations : [],
      preferredMode: Array.isArray(formData.preferredMode) ? formData.preferredMode : [],
      experienceLevel: formData.experienceLevel || '',
      skills: formData.skills || '',
      minMatchScore: formData.minMatchScore || 40
    }
    savePreferences(dataToSave)
    setSaveSuccess(true)
    showToast('Preferences saved successfully!')
    setTimeout(() => setSaveSuccess(false), 1500)
  }

  const handleLocationChange = (e) => {
    const options = Array.from(e.target.selectedOptions)
    const values = options.map(opt => opt.value)
    setFormData(prev => ({ ...prev, preferredLocations: values }))
  }

  const handleModeChange = (mode) => {
    setFormData(prev => {
      const currentModes = prev.preferredMode || []
      const newModes = currentModes.includes(mode)
        ? currentModes.filter(m => m !== mode)
        : [...currentModes, mode]
      return { ...prev, preferredMode: newModes }
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block font-medium mb-2" htmlFor="roleKeywords">
            Role keywords
          </label>
          <input
            type="text"
            id="roleKeywords"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g. Frontend, React, Product Manager"
            value={formData.roleKeywords || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, roleKeywords: e.target.value }))}
          />
          <span className="text-sm text-gray-500">Comma-separated</span>
        </div>

        <div>
          <label className="block font-medium mb-2" htmlFor="preferredLocations">
            Preferred locations
            {formData.preferredLocations?.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({formData.preferredLocations.length} selected)
              </span>
            )}
          </label>
          <select
            id="preferredLocations"
            multiple
            size="8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={formData.preferredLocations || []}
            onChange={handleLocationChange}
          >
            {filterValues.locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {formData.preferredLocations?.length === 0 
              ? 'Hold Ctrl/Cmd and click to select multiple locations'
              : 'Hold Ctrl/Cmd and click to select/deselect locations'}
          </span>
        </div>

        <div>
          <span className="block font-medium mb-2">Preferred mode</span>
          <div className="space-y-2">
            {['Remote', 'Hybrid', 'Onsite'].map(mode => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.preferredMode || []).includes(mode)}
                  onChange={() => handleModeChange(mode)}
                  className="cursor-pointer"
                />
                <span>{mode}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2" htmlFor="experienceLevel">
            Experience level
          </label>
          <select
            id="experienceLevel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            value={formData.experienceLevel || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
          >
            <option value="">Any</option>
            {['Fresher', '0-1', '1-3', '3-5'].map(exp => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2" htmlFor="skills">
            Skills
          </label>
          <input
            type="text"
            id="skills"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g. React, Python, SQL"
            value={formData.skills || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
          />
          <span className="text-sm text-gray-500">Comma-separated</span>
        </div>

        <div>
          <label className="block font-medium mb-2" htmlFor="minMatchScore">
            Minimum match score <span id="minMatchScore-value">{formData.minMatchScore || 40}</span>
          </label>
          <input
            type="range"
            id="minMatchScore"
            min="0"
            max="100"
            value={formData.minMatchScore || 40}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10)
              setFormData(prev => ({ ...prev, minMatchScore: value }))
            }}
            className="w-full"
          />
        </div>

        <Button onClick={handleSave}>
          {saveSuccess ? 'Saved' : 'Save preferences'}
        </Button>
      </div>
    </div>
  )
}
