import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { foodAPI } from '../../api/axiosConfig'
import { useAuth } from '../../hooks/useAuth'
import FoodCard from '../../components/common/FoodCard'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

const STATUS_FILTERS = ['all', 'available', 'accepted', 'picked', 'delivered', 'expired']

const STAT_CARDS = (listings) => [
  { label: 'Total Donations', value: listings.length, icon: '🍽️', color: 'bg-green-50 text-green-700' },
  { label: 'Active',          value: listings.filter((l) => l.status === 'available').length, icon: '🟢', color: 'bg-emerald-50 text-emerald-700' },
  { label: 'In Progress',     value: listings.filter((l) => ['accepted','picked'].includes(l.status)).length, icon: '🚴', color: 'bg-amber-50 text-amber-700' },
  { label: 'Delivered',       value: listings.filter((l) => l.status === 'delivered').length, icon: '✅', color: 'bg-purple-50 text-purple-700' },
]

export default function DonorDashboard() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [filter, setFilter]     = useState('all')
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await foodAPI.getAll(params)
      setListings(data.listings)
    } catch {
      // Keep empty
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [filter]) // eslint-disable-line

  const handleDelete = async (id) => {
    if (!confirm('Cancel this donation?')) return
    try {
      await foodAPI.delete(id)
      setListings((p) => p.filter((l) => l._id !== id))
    } catch {/* ignore */}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="section-label">Donor Dashboard</p>
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage your food donations and track their impact</p>
        </div>
        <Link to="/food/add">
          <Button leftIcon={<span>+</span>} size="lg">Post New Donation</Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS(listings).map((s) => (
          <div key={s.label} className={`card p-5 flex items-center gap-4 ${s.color}`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs font-medium opacity-80">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Listings */}
      {loading ? (
        <Loader text="Loading your donations…" />
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-medium">No donations {filter !== 'all' ? `with status "${filter}"` : 'yet'}.</p>
          <Link to="/food/add" className="mt-4 inline-block">
            <Button variant="outline" size="sm" className="mt-4">Post your first donation</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((l) => (
            <div key={l._id} className="relative">
              <FoodCard listing={l} showActions={false} />
              {l.status === 'available' && (
                <button
                  onClick={() => handleDelete(l._id)}
                  className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-red-500 text-xs font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
