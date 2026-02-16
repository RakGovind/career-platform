function OverallReadiness() {
  const score = 72
  const maxScore = 100
  const percentage = (score / maxScore) * 100
  
  // SVG circle calculations
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-gray-900">{score}</span>
          <span className="text-gray-500 text-sm mt-1">Readiness Score</span>
        </div>
      </div>
    </div>
  )
}

export default OverallReadiness
