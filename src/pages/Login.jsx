import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/dashboard'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-green-50">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="card p-8 animate-fade-up">
          <div className="text-center mb-8">
            <span className="text-4xl">🌿</span>
            <h1 className="font-display text-2xl font-bold text-gray-900 mt-3">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your FoodBridge account</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label-base" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input-base"
                placeholder="you@example.com"
                value={form.email}
                onChange={change}
              />
            </div>

            <div>
              <label className="label-base" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-base"
                placeholder="••••••••"
                value={form.password}
                onChange={change}
              />
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-green-50 rounded-xl border border-green-100 text-xs text-green-800">
            <p className="font-bold mb-1">🧪 Demo accounts (password: Test1234)</p>
            <p>donor@test.com · ngo@test.com · volunteer@test.com</p>
          </div>

          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
