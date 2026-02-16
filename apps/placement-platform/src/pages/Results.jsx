import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getHistoryEntry, getHistory, updateHistoryEntry } from '../utils/storageService'
import { calculateLiveReadinessScore } from '../utils/readinessScore'
import { 
  formatPlanAsText, 
  formatChecklistAsText, 
  formatQuestionsAsText, 
  formatCompleteAnalysisAsText,
  copyToClipboard, 
  downloadAsFile 
} from '../utils/exportService'
import { CheckCircle2, Calendar, Building2, Briefcase, Copy, Download, CheckCircle, XCircle, Info, Clock } from 'lucide-react'
import { generateCompanyIntel } from '../utils/companyIntel'
import { generateRoundMapping } from '../utils/roundMapping'
import { createAnalysisEntry } from '../utils/schema'

function Results() {
  const [searchParams] = useSearchParams()
  const [analysisData, setAnalysisData] = useState(null)
  const [baseReadinessScore, setBaseReadinessScore] = useState(0)
  const [liveReadinessScore, setLiveReadinessScore] = useState(0)
  const [skillConfidenceMap, setSkillConfidenceMap] = useState({})
  const [copySuccess, setCopySuccess] = useState({})
  const [currentId, setCurrentId] = useState(null)

  useEffect(() => {
    const id = searchParams.get('id')
    setCurrentId(id)
    
    let entry = null
    if (id) {
      entry = getHistoryEntry(id)
    } else {
      const history = getHistory()
      if (history.length > 0) {
        entry = history[0]
        setCurrentId(entry.id)
      }
    }

    if (entry) {
      // Generate company intel and round mapping if not present (backward compatibility)
      let companyIntel = entry.companyIntel
      let roundMapping = entry.roundMapping
      
      if (entry.company && !companyIntel) {
        companyIntel = generateCompanyIntel(entry.company, entry.jdText || '')
        if (companyIntel) {
          roundMapping = generateRoundMapping(companyIntel.size, entry.extractedSkills || { categories: {}, allSkills: [] })
          // Update entry with generated intel (async, don't wait)
          setTimeout(() => {
            updateHistoryEntry(entry.id, { companyIntel, roundMapping })
          }, 100)
        }
      }
      
      // Normalize entry using schema
      const normalizedEntry = createAnalysisEntry(entry)
      
      // Merge generated intel
      const updatedEntry = {
        ...normalizedEntry,
        companyIntel: companyIntel || normalizedEntry.companyIntel,
        roundMapping: roundMapping || normalizedEntry.roundMapping
      }
      
      setAnalysisData(updatedEntry)
      
      // Use baseScore from standardized schema
      const baseScore = updatedEntry.baseScore !== undefined ? updatedEntry.baseScore : (updatedEntry.baseReadinessScore || updatedEntry.readinessScore || 0)
      setBaseReadinessScore(baseScore)
      
      // Initialize skill confidence map (default: "practice")
      const confidenceMap = updatedEntry.skillConfidenceMap || {}
      // Get all skills from normalized format
      const allSkills = [
        ...(updatedEntry.extractedSkills?.coreCS || []),
        ...(updatedEntry.extractedSkills?.languages || []),
        ...(updatedEntry.extractedSkills?.web || []),
        ...(updatedEntry.extractedSkills?.data || []),
        ...(updatedEntry.extractedSkills?.cloud || []),
        ...(updatedEntry.extractedSkills?.testing || []),
        ...(updatedEntry.extractedSkills?.other || [])
      ]
      
      // Also check old format for backward compatibility
      const oldFormatSkills = updatedEntry.extractedSkills?.allSkills || []
      const combinedSkills = [...new Set([...allSkills, ...oldFormatSkills])]
      
      const initializedMap = {}
      combinedSkills.forEach(skill => {
        initializedMap[skill] = confidenceMap[skill] || 'practice'
      })
      
      setSkillConfidenceMap(initializedMap)
      
      // Calculate initial live score (use finalScore if exists, otherwise calculate)
      const existingFinalScore = updatedEntry.finalScore !== undefined ? updatedEntry.finalScore : null
      const liveScore = existingFinalScore !== null 
        ? existingFinalScore 
        : calculateLiveReadinessScore(baseScore, initializedMap, combinedSkills)
      setLiveReadinessScore(liveScore)
    }
  }, [searchParams])

  // Update live score when skill confidence changes
  useEffect(() => {
    if (analysisData && analysisData.extractedSkills && Object.keys(skillConfidenceMap).length > 0) {
      const allSkills = analysisData.extractedSkills.allSkills || []
      const liveScore = calculateLiveReadinessScore(
        baseReadinessScore,
        skillConfidenceMap,
        allSkills
      )
      setLiveReadinessScore(liveScore)
      
      // Save to history if we have an ID (debounce to avoid too many saves)
      // Score stability: only update finalScore, never baseScore
      if (currentId && analysisData) {
        const timeoutId = setTimeout(() => {
          updateHistoryEntry(currentId, {
            skillConfidenceMap,
            finalScore: liveScore // Update finalScore, baseScore stays unchanged
          })
        }, 500) // Debounce 500ms
        
        return () => clearTimeout(timeoutId)
      }
    }
  }, [skillConfidenceMap, baseReadinessScore, currentId, analysisData])

  const handleSkillToggle = (skill) => {
    setSkillConfidenceMap(prev => {
      const current = prev[skill] || 'practice'
      const next = current === 'know' ? 'practice' : 'know'
      return {
        ...prev,
        [skill]: next
      }
    })
  }

  const handleCopy = async (type) => {
    if (!analysisData) return
    
    let text = ''
    switch (type) {
      case 'plan':
        text = formatPlanAsText(analysisData.plan)
        break
      case 'checklist':
        text = formatChecklistAsText(analysisData.checklist)
        break
      case 'questions':
        text = formatQuestionsAsText(analysisData.questions)
        break
      default:
        return
    }
    
    const success = await copyToClipboard(text)
    if (success) {
      setCopySuccess({ [type]: true })
      setTimeout(() => setCopySuccess({}), 2000)
    }
  }

  const handleDownload = () => {
    if (!analysisData) return
    
    const text = formatCompleteAnalysisAsText(analysisData)
    const filename = `placement-analysis-${analysisData.company || 'jd'}-${Date.now()}.txt`
    downloadAsFile(text, filename)
  }

  // Get top 3 weak skills (practice-marked)
  const getTopWeakSkills = () => {
    if (!analysisData || !analysisData.extractedSkills) return []
    
    // Get all skills from standardized format
    const allSkills = [
      ...(analysisData.extractedSkills.coreCS || []),
      ...(analysisData.extractedSkills.languages || []),
      ...(analysisData.extractedSkills.web || []),
      ...(analysisData.extractedSkills.data || []),
      ...(analysisData.extractedSkills.cloud || []),
      ...(analysisData.extractedSkills.testing || []),
      ...(analysisData.extractedSkills.other || []),
      ...(analysisData.extractedSkills.allSkills || []) // Backward compatibility
    ]
    
    const uniqueSkills = [...new Set(allSkills)]
    const weakSkills = uniqueSkills.filter(
      skill => skillConfidenceMap[skill] === 'practice'
    )
    return weakSkills.slice(0, 3)
  }
  
  // Get skills for display (normalize to old format for UI compatibility)
  const getSkillsForDisplay = () => {
    if (!analysisData || !analysisData.extractedSkills) {
      return { categories: {}, allSkills: [], hasSkills: false }
    }
    
    const skills = analysisData.extractedSkills
    const categories = {}
    
    if (skills.coreCS?.length) categories['Core CS'] = skills.coreCS
    if (skills.languages?.length) categories['Languages'] = skills.languages
    if (skills.web?.length) categories['Web'] = skills.web
    if (skills.data?.length) categories['Data'] = skills.data
    if (skills.cloud?.length) categories['Cloud/DevOps'] = skills.cloud
    if (skills.testing?.length) categories['Testing'] = skills.testing
    if (skills.other?.length) categories['General'] = skills.other
    
    const allSkills = [
      ...(skills.coreCS || []),
      ...(skills.languages || []),
      ...(skills.web || []),
      ...(skills.data || []),
      ...(skills.cloud || []),
      ...(skills.testing || []),
      ...(skills.other || []),
      ...(skills.allSkills || []) // Backward compatibility
    ]
    
    return {
      categories,
      allSkills: [...new Set(allSkills)],
      hasSkills: Object.keys(categories).length > 0
    }
  }

  if (!analysisData) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Results</h2>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No analysis data found. Please analyze a job description first.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { checklist, plan, questions, company, role, createdAt, companyIntel, roundMapping } = analysisData
  const extractedSkills = getSkillsForDisplay()
  const weakSkills = getTopWeakSkills()
  
  // Normalize checklist and plan for display (handle both old and new formats)
  const displayChecklist = Array.isArray(checklist) ? checklist : Object.entries(checklist || {}).map(([roundTitle, items]) => ({
    roundTitle,
    items: Array.isArray(items) ? items : []
  }))
  
  const displayPlan = Array.isArray(plan) ? plan : (plan || [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Analysis Results</h2>
        {createdAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Company and Role Info */}
      {(company || role) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {company && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-semibold text-gray-900">{company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {role && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-semibold text-gray-900">{role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Company Intel Block */}
      {companyIntel && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Company Intel</CardTitle>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info className="w-4 h-4" />
                <span>Demo Mode: Company intel generated heuristically.</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Company</p>
                <p className="font-semibold text-gray-900">{companyIntel.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Industry</p>
                <p className="font-semibold text-gray-900">{companyIntel.industry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Size Category</p>
                <p className="font-semibold text-gray-900">{companyIntel.sizeLabel}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Typical Hiring Focus</h4>
              <p className="text-sm text-gray-700 mb-3">{companyIntel.hiringFocus.title}</p>
              <ul className="list-disc list-inside space-y-1">
                {companyIntel.hiringFocus.points.map((point, index) => (
                  <li key={index} className="text-sm text-gray-600">{point}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping Timeline */}
      {roundMapping && roundMapping.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expected Interview Rounds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-6">
                {roundMapping.map((round, index) => (
                  <div key={index} className="relative pl-12">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>
                    
                    <div className="pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">
                            Round {round.round}: {round.title}
                          </h4>
                          <p className="text-sm text-gray-700 mt-1">{round.description}</p>
                        </div>
                        {round.duration && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            <span>{round.duration}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Why this round matters:</span> {round.whyMatters}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Readiness Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 - (liveReadinessScore / 100) * 2 * Math.PI * 56}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{liveReadinessScore}</span>
                <span className="text-xs text-gray-500">/100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Skills Extracted with Toggles */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
        </CardHeader>
        <CardContent>
          {extractedSkills.hasSkills ? (
            <div className="space-y-4">
              {Object.entries(extractedSkills.categories).map(([category, skills]) => (
                <div key={category}>
                  <h4 className="font-semibold text-gray-900 mb-2">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => {
                      const confidence = skillConfidenceMap[skill] || 'practice'
                      const isKnow = confidence === 'know'
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-all cursor-pointer"
                          style={{
                            backgroundColor: isKnow ? 'rgba(55, 48, 146, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderColor: isKnow ? 'rgba(55, 48, 146, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                            color: isKnow ? '#373092' : '#ef4444'
                          }}
                          onClick={() => handleSkillToggle(skill)}
                          title={`Click to toggle: ${isKnow ? 'I know this' : 'Need practice'}`}
                        >
                          <span>{skill}</span>
                          {isKnow ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-4">
                💡 Click on skills to mark as "I know this" or "Need practice". Score updates automatically.
              </p>
            </div>
          ) : (
            <p className="text-gray-600">General fresher stack</p>
          )}
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
          <button
            onClick={() => handleCopy('checklist')}
            className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copySuccess.checklist ? 'Copied!' : 'Copy'}
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayChecklist.map((roundData, index) => {
              const roundTitle = typeof roundData === 'string' ? roundData : (roundData.roundTitle || `Round ${index + 1}`)
              const items = Array.isArray(roundData.items) ? roundData.items : (Array.isArray(roundData) ? roundData : [])
              
              return (
                <div key={index}>
                  <h4 className="font-semibold text-lg text-gray-900 mb-3">{roundTitle}</h4>
                  <ul className="space-y-2">
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>7-Day Preparation Plan</CardTitle>
          <button
            onClick={() => handleCopy('plan')}
            className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copySuccess.plan ? 'Copied!' : 'Copy'}
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayPlan.map((dayPlan, index) => {
              const day = dayPlan.day || `Day ${index + 1}`
              const focus = dayPlan.focus || dayPlan.title || ''
              const tasks = Array.isArray(dayPlan.tasks) ? dayPlan.tasks : []
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{day}: {focus}</h4>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-gray-700 text-sm">{task}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card className="mb-6">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>10 Likely Interview Questions</CardTitle>
          <button
            onClick={() => handleCopy('questions')}
            className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copySuccess.questions ? 'Copied!' : 'Copy'}
          </button>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-3">
            {questions.map((question, index) => (
              <li key={index} className="text-gray-700">
                {question}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Export Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCopy('plan')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy 7-day Plan
            </button>
            <button
              onClick={() => handleCopy('checklist')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Round Checklist
            </button>
            <button
              onClick={() => handleCopy('questions')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy 10 Questions
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download as TXT
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Action Next Box */}
      {weakSkills.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Action Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Top 3 skills to focus on:</p>
                <div className="flex flex-wrap gap-2">
                  {weakSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-700 font-medium">Start Day 1 plan now.</p>
                <p className="text-sm text-gray-600 mt-1">
                  Focus on building these foundational skills to improve your readiness score.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Results
