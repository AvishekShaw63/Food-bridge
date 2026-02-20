import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { foodAPI } from '../../api/axiosConfig'
import FoodCard from '../common/FoodCard'
import Button from '../common/Button'
import Loader from '../common/Loader'

const MOCK = [
  { _id: '1', name: 'Wedding Biryani', type: 'cooked', category: 'non-veg', quantity: { value: 20, unit: 'kg' }, status: 'available', expiresAt: new Date(Date.now() + 3 * 3600000).toISOString(), location: { city: 'Mumbai' }, donor: { organization: 'Taj Hotel' }, distance: 800 },
  { _id: '2', name: 'Artisan Bread Loaves', type: 'bakery', category: 'veg', quantity: { value: 15, unit: 'units' }, status: 'available', expiresAt: new Date(Date.now() + 18 * 3600000).toISOString(), location: { city: 'Mumbai' }, donor: { organization: 'Mumbai Bakehouse' }, distance: 1200 },
  { _id: '3', name: 'Fresh Vegetables', type: 'raw', category: 'vegan', quantity: { value: 12, unit: 'kg' }, status: 'available', expiresAt: new Date(Date.now() + 36 * 3600000).toISOString(), location: { city: 'Pune' }, donor: { organization: 'Sharma Farms' }, distance: 2100 },
  { _id: '4', name: 'Paneer Curry', type: 'cooked', category: 'veg', quantity: { value: 8, unit: 'kg' }, status: 'available', expiresAt: new Date(Date.now() + 1.5 * 3600000).toISOString(), location: { city: 'Mumbai' }, donor: { organization: 'Annapurna Caterers' }, distance: 500 },
]

export default function NearbyPreview() {
  const [listings, setListings] = useState(MOCK)
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Try to get user location and fetch real nearby listings
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        setLoading(true)
        const { data } = await foodAPI.getNearby({
          longitude: coords.longitude,
          latitude:  coords.latitude,
          radius:    5,
        })
        if (data.listings?.length > 0) setListings(data.listings.slice(0, 4))
      } catch {
        // Fall back to mock data silently
      } finally {
        setLoading(false)
      }
    }, () => {}) // ignore geolocation errors
  }, [])

  return (
    <section id="nearby" className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="section-label">Live Near You</p>
            <h2 className="section-title">Available Donations</h2>
            <p className="section-subtitle mt-2">Food ready for pickup — claim before it expires.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/register')}>
            View All →
          </Button>
        </div>

        {loading ? (
          <Loader text="Finding nearby food…" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {listings.map((l) => (
              <FoodCard key={l._id} listing={l} showActions={false} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => navigate('/register')}>
            🌿 Join FoodBridge — It's Free
          </Button>
        </div>
      </div>
    </section>
  )
}
