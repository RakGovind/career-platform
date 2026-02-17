import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/Button'

export function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  )
}
