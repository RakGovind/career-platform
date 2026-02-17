import React from 'react'
import { computeAtsScore } from '../utils/atsScore'
import { useResume } from '../hooks/useResume'

export function ATSScore() {
  const { data } = useResume()
  if (!data) return null
  const { score, suggestions, band, bandLabel } = computeAtsScore(data)

  const bandColors = {
    red: 'bg-red-100 text-red-800 border-red-300',
    amber: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    green: 'bg-green-100 text-green-800 border-green-300'
  }

  return (
    <div className={`p-4 rounded-lg border ${bandColors[band]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">ATS Readiness Score</h3>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full ${
            band === 'green' ? 'bg-green-600' : band === 'amber' ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-sm mb-2">{bandLabel}</p>
      {suggestions.length > 0 && (
        <ul className="text-sm space-y-1 mt-2">
          {suggestions.slice(0, 5).map((s, i) => (
            <li key={i}>• {s}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
