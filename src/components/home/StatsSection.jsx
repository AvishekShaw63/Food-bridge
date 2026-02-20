import { useEffect, useRef, useState } from 'react'
import { statsAPI } from '../../api/axiosConfig'

function Counter({ target, prefix = '', suffix = '', duration = 1800 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const start = Date.now()
          const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl font-bold text-green-800 leading-none tabular-nums">
      {prefix}{value.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

const STATIC_STATS = [
  { icon: '🗑️', prefix: '', target: 67, suffix: 'M+', label: 'Tons food wasted globally/year', sub: 'The Scale' },
  { icon: '😔', prefix: '', target: 25, suffix: ' Cr', label: 'People hungry in India daily', sub: 'The Crisis' },
  { icon: '💸', prefix: '₹', target: 92000, suffix: ' Cr', label: 'Annual economic food loss', sub: 'The Cost' },
]

export default function StatsSection() {
  const [platformStats, setPlatformStats] = useState(null)

  useEffect(() => {
    statsAPI.getGlobal()
      .then(({ data }) => setPlatformStats(data.stats))
      .catch(() => {})
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-label">The Problem We're Solving</p>
          <h2 className="section-title">The Scale of Food Waste in India</h2>
          <p className="section-subtitle mx-auto mt-3">
            Understanding the magnitude helps us act with urgency. Every statistic represents real lives.
          </p>
        </div>

        {/* Problem stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {STATIC_STATS.map((s) => (
            <div key={s.label} className="card p-7 text-center hover:-translate-y-1 transition-transform duration-300">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">{s.sub}</p>
              <div className="text-4xl mb-3">{s.icon}</div>
              <Counter prefix={s.prefix} target={s.target} suffix={s.suffix} />
              <p className="text-sm text-gray-500 mt-3 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Platform impact */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-8 text-center text-white">
          <p className="text-xs font-bold tracking-widest uppercase text-green-200 mb-2">Our Impact So Far</p>
          <h3 className="font-display text-2xl font-bold mb-6">FoodBridge Platform Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Meals Saved', value: platformStats?.totalMealsSaved || 4821, suffix: '+' },
              { label: 'Donations', value: platformStats?.totalDonations || 1240, suffix: '+' },
              { label: 'Active NGOs', value: platformStats?.totalNGOs || 83, suffix: '' },
              { label: 'Volunteers', value: platformStats?.totalVolunteers || 256, suffix: '+' },
            ].map((s) => (
              <div key={s.label}>
                <Counter target={s.value} suffix={s.suffix} duration={2000} />
                <p className="text-green-200 text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
