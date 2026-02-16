import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import OverallReadiness from '../components/dashboard/OverallReadiness'
import SkillBreakdown from '../components/dashboard/SkillBreakdown'
import ContinuePractice from '../components/dashboard/ContinuePractice'
import WeeklyGoals from '../components/dashboard/WeeklyGoals'
import UpcomingAssessments from '../components/dashboard/UpcomingAssessments'

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
      
      {/* Responsive grid: 2 columns on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Readiness - Full width on mobile, spans 2 columns on desktop */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <OverallReadiness />
          </CardContent>
        </Card>

        {/* Skill Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBreakdown />
          </CardContent>
        </Card>

        {/* Continue Practice */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <ContinuePractice />
          </CardContent>
        </Card>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyGoals />
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingAssessments />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
