import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { foodAPI } from '../api/axiosConfig'
import Button from '../components/common/Button'

const TYPES = ['cooked', 'raw', 'packaged', 'beverages', 'bakery', 'dairy', 'other']
const UNITS = ['kg', 'g', 'litres', 'units', 'plates', 'packets']

export default function AddFood() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', description: '', type: 'cooked', category: 'veg',
    quantity: { value: '', unit: 'kg' },
    preparedAt: '', expiresAt: '', imageUrl: '', deliveryNotes: '',
    location: { coordinates: [0, 0], address: '', city: '', pincode: '' },
  })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const change = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  const changeQty = (e) => setForm((p) => ({ ...p, quantity: { ...p.quantity, [e.target.name]: e.target.value } }))
  const changeLoc = (e) => setForm((p) => ({ ...p, location: { ...p.location, [e.target.name]: e.target.value } }))

  const getGeo = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      setForm((p) => ({ ...p, location: { ...p.location, coordinates: [coords.longitude, coords.latitude] } }))
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await foodAPI.create(form)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard/donor'), 2000)
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? errs.map((e) => e.message).join('. ') : err.response?.data?.message || 'Failed to post donation.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-2xl font-bold text-green-800 mb-2">Donation Posted!</h2>
          <p className="text-gray-500">Redirecting to your dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="section-label">Donor</p>
        <h1 className="section-title">Post a Food Donation</h1>
        <p className="section-subtitle mt-2">Share surplus food — it takes less than 2 minutes.</p>
      </div>

      <div className="card p-8 animate-fade-up">
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          {/* Name + Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Food Name *</label>
              <input name="name" required className="input-base" placeholder="e.g. Biryani, Bread" value={form.name} onChange={change} />
            </div>
            <div>
              <label className="label-base">Food Type *</label>
              <select name="type" className="input-base" value={form.type} onChange={change}>
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">Quantity *</label>
              <input name="value" type="number" min="0.1" step="0.1" required className="input-base" placeholder="e.g. 10" value={form.quantity.value} onChange={changeQty} />
            </div>
            <div>
              <label className="label-base">Unit *</label>
              <select name="unit" className="input-base" value={form.quantity.unit} onChange={changeQty}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label-base">Category *</label>
            <div className="flex gap-3 mt-1">
              {['veg', 'non-veg', 'vegan'].map((c) => (
                <label key={c} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${form.category === c ? 'border-green-500 bg-green-50 text-green-800' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="category" value={c} className="hidden" checked={form.category === c} onChange={change} />
                  {c === 'veg' ? '🌿' : c === 'non-veg' ? '🍗' : '🌱'} {c}
                </label>
              ))}
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-base">Prepared At *</label>
              <input name="preparedAt" type="datetime-local" required className="input-base" value={form.preparedAt} onChange={change} />
            </div>
            <div>
              <label className="label-base">Expires At *</label>
              <input name="expiresAt" type="datetime-local" required className="input-base" value={form.expiresAt} onChange={change} />
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="label-base mb-0">Pickup Address *</label>
              <button type="button" className="text-xs text-green-600 font-semibold hover:underline" onClick={getGeo}>
                📍 Auto-detect
              </button>
            </div>
            <input name="address" required className="input-base" placeholder="Street address" value={form.location.address} onChange={changeLoc} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">City</label>
              <input name="city" className="input-base" placeholder="Mumbai" value={form.location.city} onChange={changeLoc} />
            </div>
            <div>
              <label className="label-base">Pincode</label>
              <input name="pincode" className="input-base" placeholder="400001" value={form.location.pincode} onChange={changeLoc} />
            </div>
          </div>

          {/* Image + Notes */}
          <div>
            <label className="label-base">Image URL (optional)</label>
            <input name="imageUrl" className="input-base" placeholder="https://…" value={form.imageUrl} onChange={change} />
          </div>

          <div>
            <label className="label-base">Delivery Notes</label>
            <textarea name="deliveryNotes" rows={3} className="input-base resize-none" placeholder="Allergies, packaging details, floor number…" value={form.deliveryNotes} onChange={change} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} size="lg" className="flex-1">
              🌿 Post Donation
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('/dashboard/donor')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
