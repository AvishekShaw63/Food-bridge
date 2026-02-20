const STEPS = [
  {
    n: '01',
    icon: '📸',
    title: 'Donor Posts Surplus',
    description:
      'Hotels, restaurants, and households log surplus food with details: quantity, type, expiry time, and pickup location.',
    color: 'from-green-100 to-green-50',
    accent: 'text-green-700',
  },
  {
    n: '02',
    icon: '🔔',
    title: 'NGO Gets Notified',
    description:
      'Nearby NGOs receive real-time alerts and can browse available donations by distance and expiry — then accept with one tap.',
    color: 'from-emerald-100 to-emerald-50',
    accent: 'text-emerald-700',
  },
  {
    n: '03',
    icon: '🚴',
    title: 'Volunteer Delivers',
    description:
      'A verified volunteer picks up the food and delivers it to the NGO or shelter. Every step is tracked end-to-end.',
    color: 'from-teal-100 to-teal-50',
    accent: 'text-teal-700',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="section-label">Simple & Fast</p>
          <h2 className="section-title">How FoodBridge Works</h2>
          <p className="section-subtitle mx-auto mt-3">
            Three steps. Zero waste. Maximum impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-0.5 bg-green-100 z-0" />

          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="relative z-10 flex flex-col items-center text-center"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Step circle */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-sm border border-white`}>
                <span className="text-2xl">{step.icon}</span>
              </div>

              {/* Step number */}
              <span className={`text-xs font-black tracking-widest uppercase ${step.accent} mb-2`}>
                Step {step.n}
              </span>

              <h3 className="font-display font-bold text-gray-900 text-lg mb-3">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Visual flow bar */}
        <div className="mt-16 bg-green-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-green-700 font-medium">
          <span className="bg-green-200 px-3 py-1 rounded-lg">📦 Food Posted</span>
          <span className="text-green-400">→</span>
          <span className="bg-green-200 px-3 py-1 rounded-lg">✅ NGO Accepts</span>
          <span className="text-green-400">→</span>
          <span className="bg-green-200 px-3 py-1 rounded-lg">🚴 Pickup</span>
          <span className="text-green-400">→</span>
          <span className="bg-green-700 text-white px-3 py-1 rounded-lg">🎉 Delivered</span>
        </div>
      </div>
    </section>
  )
}
