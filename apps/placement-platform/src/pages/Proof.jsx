import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import {
  getStepsCompletion,
  updateStepCompletion,
  areAllStepsCompleted,
  getProofSubmission,
  saveProofSubmission,
  validateURL
} from '../utils/proofSubmission'
import { areAllTestsPassed } from '../utils/testChecklist'
import { CheckCircle2, XCircle, Copy, Check } from 'lucide-react'

function Proof() {
  const [steps, setSteps] = useState([])
  const [submission, setSubmission] = useState({
    lovableLink: '',
    githubLink: '',
    deployedLink: ''
  })
  const [errors, setErrors] = useState({})
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const stepsData = getStepsCompletion()
    const submissionData = getProofSubmission()
    setSteps(stepsData)
    setSubmission(submissionData)
  }

  const handleStepToggle = (stepId, currentStatus) => {
    updateStepCompletion(stepId, !currentStatus)
    loadData()
  }

  const handleLinkChange = (field, value) => {
    setSubmission(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleLinkBlur = (field, value) => {
    const trimmedValue = value.trim()
    if (trimmedValue) {
      const validation = validateURL(trimmedValue)
      if (!validation.valid) {
        setErrors(prev => ({
          ...prev,
          [field]: validation.error
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }))
        const updated = {
          ...submission,
          [field]: trimmedValue
        }
        setSubmission(updated)
        saveProofSubmission(updated)
      }
    } else {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
      const updated = {
        ...submission,
        [field]: ''
      }
      setSubmission(updated)
      saveProofSubmission(updated)
    }
  }

  const handleCopySubmission = async () => {
    const allStepsCompleted = areAllStepsCompleted()
    const allTestsPassed = areAllTestsPassed()
    const allLinksProvided = !!(
      submission.lovableLink &&
      submission.githubLink &&
      submission.deployedLink
    )

    const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${submission.lovableLink || 'Not provided'}
GitHub Repository: ${submission.githubLink || 'Not provided'}
Live Deployment: ${submission.deployedLink || 'Not provided'}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence

Completion Status:
- Steps Completed: ${allStepsCompleted ? 'Yes' : 'No'}
- Tests Passed: ${allTestsPassed ? 'Yes' : 'No'}
- Proof Links Provided: ${allLinksProvided ? 'Yes' : 'No'}
------------------------------------------`

    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (e) {
        alert('Failed to copy. Please copy manually.')
      }
      document.body.removeChild(textArea)
    }
  }

  const allStepsCompleted = areAllStepsCompleted()
  const allTestsPassed = areAllTestsPassed()
  const allLinksProvided = !!(
    submission.lovableLink &&
    submission.githubLink &&
    submission.deployedLink &&
    !errors.lovableLink &&
    !errors.githubLink &&
    !errors.deployedLink
  )

  const canShip = allStepsCompleted && allTestsPassed && allLinksProvided

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Build Proof</h2>
        <button
          onClick={handleCopySubmission}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {copySuccess ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Final Submission
            </>
          )}
        </button>
      </div>

      {/* Step Completion Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step Completion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  step.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => handleStepToggle(step.id, step.completed)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                  <span className="font-medium text-gray-900">{step.label}</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    step.completed ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {step.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Artifact Inputs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Artifact Inputs (Required for Ship Status)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lovable Project Link *
            </label>
            <input
              type="url"
              value={submission.lovableLink}
              onChange={(e) => handleLinkChange('lovableLink', e.target.value)}
              onBlur={(e) => handleLinkBlur('lovableLink', e.target.value)}
              placeholder="https://lovable.dev/project/..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.lovableLink ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.lovableLink && (
              <p className="text-sm text-red-600 mt-1">{errors.lovableLink}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub Repository Link *
            </label>
            <input
              type="url"
              value={submission.githubLink}
              onChange={(e) => handleLinkChange('githubLink', e.target.value)}
              onBlur={(e) => handleLinkBlur('githubLink', e.target.value)}
              placeholder="https://github.com/username/repo"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.githubLink ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.githubLink && (
              <p className="text-sm text-red-600 mt-1">{errors.githubLink}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deployed URL *
            </label>
            <input
              type="url"
              value={submission.deployedLink}
              onChange={(e) => handleLinkChange('deployedLink', e.target.value)}
              onBlur={(e) => handleLinkBlur('deployedLink', e.target.value)}
              placeholder="https://your-app.vercel.app"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.deployedLink ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.deployedLink && (
              <p className="text-sm text-red-600 mt-1">{errors.deployedLink}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className={canShip ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
        <CardContent className="py-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Steps Completed:</span>
              <span className={allStepsCompleted ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                {allStepsCompleted ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Tests Passed:</span>
              <span className={allTestsPassed ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                {allTestsPassed ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Proof Links Provided:</span>
              <span className={allLinksProvided ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                {allLinksProvided ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Ship Status:</span>
                <span className={canShip ? 'text-green-600 font-bold text-lg' : 'text-amber-600 font-semibold'}>
                  {canShip ? 'Shipped' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Proof
