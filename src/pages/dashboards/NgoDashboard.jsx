import { useEffect, useState, useCallback } from 'react'
import { foodAPI } from '../../api/axiosConfig'
import { useAuth } from '../../hooks/useAuth'
import FoodCard from '../../components/common/FoodCard'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

const TYPE_FILTERS = ['all', 'cooked', 'raw', 'packaged', 'beverages', 'bakery', 'dairy']

export default function NgoDashboard() {
  const { user, notifications } = useAuth()
  const [listings, setListings]   = useState([])
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(true)
  const [coords, setCoords]       = useState(null)
  const [toast, setToast]         = useState('')
  const [radius, setRadius]       = useState(5)

  // Get user geolocation
  useEffect(() => {
    if (user?.location?.coordinates) {
      const [lng, lat] = user.location.coordinates
      if (lng !== 0 || lat !== 0) { setCoords({ longitude: lng, latitude: lat }); return }
    }
    navigator.geolocation?.getCurrentPosition(({ coords: c }) =>
      setCoords({ longitude: c.longitude, latitude: c.latitude })
    )
  }, [user])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let data
      if (coords) {
        const res = await foodAPI.getNearby({ ...coords, radius })
        data = res.data.listings
      } else {
        const res = await foodAPI.getAll({ status: 'available' })
        data = res.data.listings
      }
      setListings(data)
    } catch {
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [coords, radius])

  useEffect(() => { load() }, [load])

  // Re-fetch on new-listing socket event
  useEffect(() => {
    const latest = notifications[0]
    if (latest?.event === 'new-listing') load()
  }, [notifications, load])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleAccept = async (id) => {
    try {
      await foodAPI.accept(id)
      setListings((p) => p.filter((l) => l._id !== id))
      showToast('✅ Donation accepted! A volunteer will be notified.')
    } catch (err) {
      showToast('⚠️ ' + (err.response?.data?.message || 'Failed to accept'))
    }
  }

  const filtered = filter === 'all' ? listings : listings.filter((l) => l.type === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-700 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-slide-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="section-label">NGO Dashboard</p>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Browse and accept nearby food donations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Available', value: listings.filter((l) => l.status === 'available').length, icon: '🍽️' },
          { label: 'Within Radius', value: filtered.length, icon: '📍' },
          { label: 'Accepted Today', value: 0, icon: '✅' },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <p className="font-display text-2xl font-bold text-green-800">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Type filter */}
        <div className="flex gap-2 flex-wrap flex-1">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-green-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Radius selector */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📍 Radius:</span>
          {[3, 5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                radius === r ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-green-600'
              }`}
            >
              {r}km
            </button>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={load}>↻ Refresh</Button>
      </div>

      {/* Listings */}
      {loading ? (
        <Loader text="Finding nearby food…" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="font-medium">No available donations nearby right now.</p>
          <p className="text-sm mt-1">Try increasing the radius or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((l) => (
            <FoodCard key={l._id} listing={l} userRole="ngo" onAccept={handleAccept} />
          ))}
        </div>
      )}
    </div>
  )
}
