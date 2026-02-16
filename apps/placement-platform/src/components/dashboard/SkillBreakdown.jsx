import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

const skillData = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
]

function SkillBreakdown() {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={skillData}>
          <PolarGrid />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#373092"
            fill="#373092"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SkillBreakdown
