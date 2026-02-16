function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  )
}

function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export { Card, CardHeader, CardTitle, CardContent }
