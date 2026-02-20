import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span>🌿</span> FoodBridge
            </div>
            <p className="text-sm text-green-400 leading-relaxed">
              Connecting surplus food with hunger relief. Every meal saved is a life touched.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-green-500 mb-4">Platform</p>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Home', '/'],
                ['Donate Food', '/food/add'],
                ['Login', '/login'],
                ['Register', '/register'],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-green-500 mb-4">Impact</p>
            <ul className="space-y-2 text-sm text-green-300">
              <li>🍽️ 67M+ tons food wasted globally</li>
              <li>😔 25 Crore hungry in India</li>
              <li>💸 ₹92,000 Cr annual loss</li>
              <li>🌱 Join the solution today</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-600">
          <span>© {new Date().getFullYear()} FoodBridge. Built with ❤️ for a hunger-free India.</span>
          <span>Reducing food waste · Relieving hunger · Building community</span>
        </div>
      </div>
    </footer>
  )
}
