import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { performAnalysis } from '../utils/analysisService'
import { calculateReadinessScore } from '../utils/readinessScore'
import { saveAnalysis } from '../utils/storageService'
import { generateCompanyIntel } from '../utils/companyIntel'
import { generateRoundMapping } from '../utils/roundMapping'

function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [jdWarning, setJdWarning] = useState('')

  // Validate JD length
  const validateJD = (text) => {
    if (!text.trim()) {
      setJdWarning('')
      return false
    }
    if (text.trim().length < 200) {
      setJdWarning('This JD is too short to analyze deeply. Paste full JD for better output.')
      return true // Allow but warn
    }
    setJdWarning('')
    return true
  }

  const handleJDChange = (e) => {
    const text = e.target.value
    setJdText(text)
    validateJD(text)
  }

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      return // Button is disabled, but double-check
    }

    setIsAnalyzing(true)

    // Perform analysis
    const analysis = performAnalysis(jdText, company, role)
    const baseScore = calculateReadinessScore(jdText, company, role)

    // Generate company intel and round mapping
    const companyIntel = generateCompanyIntel(company.trim(), jdText.trim())
    const roundMapping = companyIntel 
      ? generateRoundMapping(companyIntel.size, analysis.extractedSkills)
      : null

    // Save to history with standardized schema
    const savedEntry = saveAnalysis({
      company: company.trim(),
      role: role.trim(),
      jdText: jdText.trim(),
      extractedSkills: analysis.extractedSkills,
      checklist: analysis.checklist,
      plan: analysis.plan,
      questions: analysis.questions,
      baseScore, // Store as baseScore (never changes)
      finalScore: baseScore, // Initial finalScore equals baseScore
      companyIntel, // Store company intel
      roundMapping // Store round mapping
    })

    setIsAnalyzing(false)

    // Navigate to results with the saved entry ID
    if (savedEntry) {
      navigate(`/dashboard/results?id=${savedEntry.id}`)
    } else {
      navigate('/dashboard/results')
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Analyze Job Description</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role/Position (Optional)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineer, Frontend Developer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={jdText}
              onChange={handleJDChange}
              placeholder="Paste the job description here..."
              rows={12}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
                jdWarning ? 'border-amber-300 bg-amber-50' : 'border-gray-300'
              }`}
            />
            <div className="mt-1">
              <p className="text-sm text-gray-500">
                {jdText.length} characters
              </p>
              {jdWarning && (
                <p className="text-sm text-amber-600 mt-1">
                  {jdWarning}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jdText.trim()}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Job Description'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analyze
