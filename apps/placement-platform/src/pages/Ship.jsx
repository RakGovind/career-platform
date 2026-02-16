import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { areAllTestsPassed } from '../utils/testChecklist'
import { areAllStepsCompleted, areAllProofLinksProvided } from '../utils/proofSubmission'
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react'

function Ship() {
  const navigate = useNavigate()
  const [isLocked, setIsLocked] = useState(true)
  const [status, setStatus] = useState({
    stepsCompleted: false,
    testsPassed: false,
    linksProvided: false
  })

  useEffect(() => {
    checkLockStatus()
    // Check periodically in case checklist is updated in another tab
    const interval = setInterval(checkLockStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  const checkLockStatus = () => {
    const stepsCompleted = areAllStepsCompleted()
    const testsPassed = areAllTestsPassed()
    const linksProvided = areAllProofLinksProvided()
    
    const allConditionsMet = stepsCompleted && testsPassed && linksProvided
    
    setStatus({
      stepsCompleted,
      testsPassed,
      linksProvided
    })
    setIsLocked(!allConditionsMet)
  }

  const handleGoToTests = () => {
    navigate('/prp/07-test')
  }

  const handleGoToProof = () => {
    navigate('/prp/proof')
  }

  if (isLocked) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ship</h2>
        
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Shipping Locked
                </h3>
                <p className="text-gray-700 mb-4">
                  Complete all requirements before shipping:
                </p>
                <div className="space-y-2 mb-6 text-left max-w-md mx-auto">
                  <div className={`flex items-center gap-2 ${status.stepsCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                    {status.stepsCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    <span>All 8 steps completed</span>
                  </div>
                  <div className={`flex items-center gap-2 ${status.testsPassed ? 'text-green-600' : 'text-gray-600'}`}>
                    {status.testsPassed ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    <span>All 10 checklist items passed</span>
                  </div>
                  <div className={`flex items-center gap-2 ${status.linksProvided ? 'text-green-600' : 'text-gray-600'}`}>
                    {status.linksProvided ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    <span>All 3 proof links provided</span>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  {!status.testsPassed && (
                    <button
                      onClick={handleGoToTests}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                      Go to Test Checklist
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                  {!status.linksProvided && (
                    <button
                      onClick={handleGoToProof}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
                    >
                      Go to Proof Page
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Ship</h2>
      
      <Card className="border-green-200 bg-green-50 mb-6">
        <CardContent className="py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Status: Shipped
              </h3>
              <p className="text-gray-700">
                All requirements have been met. The platform is ready for deployment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Message */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-xl font-semibold text-gray-900">
              You built a real product.
            </p>
            <p className="text-lg text-gray-700">
              Not a tutorial. Not a clone.
            </p>
            <p className="text-lg text-gray-700">
              A structured tool that solves a real problem.
            </p>
            <div className="pt-4 border-t border-gray-200 mt-4">
              <p className="text-xl font-bold text-primary">
                This is your proof of work.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Ship
