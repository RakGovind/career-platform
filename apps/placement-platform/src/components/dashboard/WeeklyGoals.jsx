function WeeklyGoals() {
  const solved = 12
  const target = 20
  const percentage = (solved / target) * 100

  // Mock data for days (Mon-Sun)
  const days = [
    { label: 'Mon', active: true },
    { label: 'Tue', active: true },
    { label: 'Wed', active: false },
    { label: 'Thu', active: true },
    { label: 'Fri', active: true },
    { label: 'Sat', active: false },
    { label: 'Sun', active: false },
  ]

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Problems Solved</span>
          <span className="text-gray-900 font-medium">{solved}/{target} this week</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Day circles */}
      <div className="flex items-center justify-between gap-2">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                day.active
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {day.label.charAt(0)}
            </div>
            <span className="text-xs text-gray-500">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeeklyGoals
