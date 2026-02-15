import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getHistory, deleteHistoryEntry } from '../utils/storageService'
import { Calendar, Building2, Briefcase, Trash2, ExternalLink } from 'lucide-react'

function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [corruptedCount, setCorruptedCount] = useState(0)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const entries = getHistory()
      setHistory(entries)
      
      // Check if there were corrupted entries (stored separately or detected)
      // This is handled in storageService, but we can show a message if needed
    } catch (error) {
      console.error('Error loading history:', error)
      setHistory([])
    }
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteHistoryEntry(id)
      loadHistory()
    }
  }

  const handleView = (id) => {
    navigate(`/dashboard/results?id=${id}`)
  }

  if (history.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">History</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No analysis history found. Start by analyzing a job description.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Analysis History</h2>
      
      <div className="space-y-4">
        {history.map((entry) => (
          <Card
            key={entry.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleView(entry.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {entry.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900">{entry.company}</span>
                      </div>
                    )}
                    {entry.role && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{entry.role}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{entry.finalScore !== undefined ? entry.finalScore : (entry.readinessScore || entry.baseScore || 0)}</span>
                      <span>/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default History
