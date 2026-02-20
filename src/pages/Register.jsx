import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'

const ROLES = [
  { id: 'donor',     icon: '🍽️', label: 'Donor',     desc: 'I have surplus food to donate' },
  { id: 'ngo',       icon: '🏢', label: 'NGO',       desc: 'We distribute food to those in need' },
  { id: 'volunteer', icon: '🚴', label: 'Volunteer', desc: 'I deliver food to NGOs & shelters' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()
  const [params]      = useSearchParams()

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', organization: '',
    role: params.get('role') || 'donor',
    location: { coordinates: [0, 0], address: '', city: '' },
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const changeLocation = (e) =>
    setForm((p) => ({ ...p, location: { ...p.location, [e.target.name]: e.target.value } }))

  const getGeo = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setForm((p) => ({
        ...p,
        location: { ...p.location, coordinates: [coords.longitude, coords.latitude] },
      }))
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-green-50">
      <div className="w-full max-w-lg">
        <div className="card p-8 animate-fade-up">
          <div className="text-center mb-8">
            <span className="text-4xl">🌿</span>
            <h1 className="font-display text-2xl font-bold text-gray-900 mt-3">Join FoodBridge</h1>
            <p className="text-gray-400 text-sm mt-1">Create your free account and start making an impact</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="label-base mb-3">I want to join as</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: r.id }))}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    form.role === r.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl mb-1">{r.icon}</span>
                  <span className="text-xs font-bold text-gray-800">{r.label}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-base">Full Name *</label>
                <input name="name" required className="input-base" placeholder="Ravi Sharma" value={form.name} onChange={change} />
              </div>
              <div>
                <label className="label-base">Phone</label>
                <input name="phone" className="input-base" placeholder="9876543210" value={form.phone} onChange={change} />
              </div>
            </div>

            <div>
              <label className="label-base">Email *</label>
              <input name="email" type="email" required className="input-base" placeholder="you@example.com" value={form.email} onChange={change} />
            </div>

            <div>
              <label className="label-base">Password *</label>
              <input name="password" type="password" required minLength={8} className="input-base" placeholder="Min 8 chars, uppercase + number" value={form.password} onChange={change} />
            </div>

            {(form.role === 'donor' || form.role === 'ngo') && (
              <div>
                <label className="label-base">Organization / Business Name</label>
                <input name="organization" className="input-base" placeholder="Hotel / NGO / Restaurant name" value={form.organization} onChange={change} />
              </div>
            )}

            <div>
              <label className="label-base">Address</label>
              <input name="address" className="input-base" placeholder="Street address" value={form.location.address} onChange={changeLocation} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">City</label>
                <input name="city" className="input-base" placeholder="Mumbai" value={form.location.city} onChange={changeLocation} />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={getGeo}>
                  📍 Auto-detect
                </Button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Create Account →
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
