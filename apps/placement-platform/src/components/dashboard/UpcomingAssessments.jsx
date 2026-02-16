import { Clock } from 'lucide-react'

const assessments = [
  { title: 'DSA Mock Test', date: 'Tomorrow', time: '10:00 AM' },
  { title: 'System Design Review', date: 'Wed', time: '2:00 PM' },
  { title: 'HR Interview Prep', date: 'Friday', time: '11:00 AM' },
]

function UpcomingAssessments() {
  return (
    <div className="space-y-4">
      {assessments.map((assessment, index) => (
        <div
          key={index}
          className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 mb-1">{assessment.title}</h5>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{assessment.date}, {assessment.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UpcomingAssessments
