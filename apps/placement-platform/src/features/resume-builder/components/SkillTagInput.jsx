import React, { useState } from 'react'

export function SkillTagInput({ value = [], onChange }) {
  const [input, setInput] = useState('')

  const addSkill = (s) => {
    const trimmed = s.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInput('')
    }
  }

  const removeSkill = (i) => {
    onChange(value.filter((_, j) => j !== i))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (input.trim()) {
        addSkill(input.trim())
      }
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((s, i) => (
          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2">
            {s}
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="text-gray-500 hover:text-gray-700"
              aria-label={`Remove ${s}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type skill and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  )
}
