import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { getTestChecklist, updateTestStatus, resetTestChecklist, getPassedCount, areAllTestsPassed } from '../utils/testChecklist'
import { CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'

function TestChecklist() {
  const [tests, setTests] = useState([])
  const [passedCount, setPassedCount] = useState(0)
  const [allPassed, setAllPassed] = useState(false)

  useEffect(() => {
    loadChecklist()
  }, [])

  const loadChecklist = () => {
    const checklist = getTestChecklist()
    setTests(checklist)
    setPassedCount(getPassedCount())
    setAllPassed(areAllTestsPassed())
  }

  const handleToggle = (testId, currentStatus) => {
    const newStatus = !currentStatus
    updateTestStatus(testId, newStatus)
    loadChecklist()
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all test checkboxes?')) {
      resetTestChecklist()
      loadChecklist()
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Test Checklist</h2>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Tests Passed: {passedCount} / 10
              </h3>
              {!allPassed && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Fix issues before shipping.</span>
                </div>
              )}
              {allPassed && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">All tests passed! Ready to ship.</span>
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Checklist
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Test List */}
      <Card>
        <CardHeader>
          <CardTitle>Test Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  test.passed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={test.passed}
                  onChange={() => handleToggle(test.id, test.passed)}
                  className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
                <div className="flex-1">
                  <label
                    className="font-medium text-gray-900 cursor-pointer"
                    onClick={() => handleToggle(test.id, test.passed)}
                  >
                    {test.label}
                  </label>
                  {test.hint && (
                    <p className="text-sm text-gray-600 mt-1">
                      💡 {test.hint}
                    </p>
                  )}
                </div>
                {test.passed && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestChecklist
