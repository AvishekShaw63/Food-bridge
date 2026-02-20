import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'

export default function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const handleDonate = () => isAuthenticated && user.role === 'donor'
    ? navigate('/food/add')
    : navigate('/register?role=donor')

  const handleRequest = () => isAuthenticated
    ? navigate('/dashboard')
    : navigate('/register?role=ngo')

  return (
    <section className="hero-clip relative min-h-[88vh] bg-gradient-to-br from-green-800 via-green-600 to-emerald-500 flex items-center overflow-hidden">
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-rule='evenodd'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Blob decoration */}
      <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] bg-green-900/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-5 py-2 text-sm text-green-100 font-medium mb-8 animate-fade-up">
          <span>🌱</span>
          <span>Fighting hunger, reducing waste — together</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-up animate-delay-100">
          Turn <em className="not-italic text-green-300">Surplus</em>
          <br />
          into Support
        </h1>

        <p className="text-green-100 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed font-light animate-fade-up animate-delay-200">
          Every day, tons of food is wasted while millions sleep hungry. FoodBridge connects donors, NGOs, and volunteers to ensure no meal goes to waste.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animate-delay-300">
          <Button
            size="lg"
            variant="white"
            leftIcon={<span>🤲</span>}
            onClick={handleDonate}
          >
            Donate Food
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="!text-white !border-white/40 !border-2 hover:!bg-white/15"
            leftIcon={<span>🙏</span>}
            onClick={handleRequest}
          >
            Request Food
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="!text-white !border-white/40 !border-2 hover:!bg-white/15"
            leftIcon={<span>📍</span>}
            onClick={() => document.getElementById('nearby')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Find Nearby
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-white/40 text-xs animate-fade-up animate-delay-500">
          <span>scroll to explore</span>
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
