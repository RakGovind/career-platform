import React from 'react'
import { getBulletFeedback } from '../utils/bulletGuidance'

export function BulletGuidance({ bulletsText }) {
  const feedback = getBulletFeedback(bulletsText)
  const items = feedback.filter(f => f.needsActionVerb || f.needsNumbers)

  if (items.length === 0) return null

  return (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
      {items.map((f, i) => {
        const tips = []
        if (f.needsActionVerb) tips.push('Start with a strong action verb.')
        if (f.needsNumbers) tips.push('Add measurable impact (numbers).')
        return (
          <div key={i} className="text-yellow-800">
            Bullet {f.bulletIndex}: {tips.join(' ')}
          </div>
        )
      })}
    </div>
  )
}
