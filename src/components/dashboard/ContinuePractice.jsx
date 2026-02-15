import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ContinuePractice() {
  const navigate = useNavigate()
  const completed = 3
  const total = 10
  const percentage = (completed / total) * 100

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Programming</h4>
      <p className="text-sm text-gray-600 mb-4">Last practiced topic</p>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="text-gray-900 font-medium">{completed}/{total} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard/practice')}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ContinuePractice
