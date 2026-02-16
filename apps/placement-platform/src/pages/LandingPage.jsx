import { useNavigate } from 'react-router-dom'
import { Code, Video, TrendingUp } from 'lucide-react'

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Code,
      title: 'Practice Problems',
      description: 'Solve coding challenges and improve your problem-solving skills',
    },
    {
      icon: Video,
      title: 'Mock Interviews',
      description: 'Simulate real interview scenarios with AI-powered mock sessions',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics and insights',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ace Your Placement
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Practice, assess, and prepare for your dream job
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2024 Placement Readiness Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
