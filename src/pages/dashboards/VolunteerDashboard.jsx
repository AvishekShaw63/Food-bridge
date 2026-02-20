import { useEffect, useState } from 'react'
import { foodAPI } from '../../api/axiosConfig'
import { useAuth } from '../../hooks/useAuth'
import ExpiryBadge from '../../components/common/ExpiryBadge'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'

const STATUS_META = {
  accepted:  { label: 'Awaiting Pickup', color: 'bg-amber-100 text-amber-700',  icon: '⏳' },
  picked:    { label: 'In Transit',       color: 'bg-blue-100 text-blue-700',   icon: '🚴' },
  delivered: { label: 'Delivered',        color: 'bg-green-100 text-green-700', icon: '✅' },
}

const FOOD_EMOJI = { cooked:'🍲', raw:'🥦', packaged:'📦', beverages:'🥤', bakery:'🍞', dairy:'🥛', other:'🍽️' }

function TaskCard({ task, onPickup, onDeliver }) {
  const meta = STATUS_META[task.status] || STATUS_META.accepted

  return (
    <div className="card p-5 flex flex-col sm:flex-row gap-4 hover:shadow-card-hover transition-shadow duration-200">
      {/* Emoji */}
      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 self-start">
        {FOOD_EMOJI[task.type] || '🍽️'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <h3 className="font-display font-bold text-gray-900">{task.name}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.color}`}>
            {meta.icon} {meta.label}
          </span>
          <ExpiryBadge expiresAt={task.expiresAt} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            📦 From: <strong className="text-gray-700 truncate">{task.donor?.organization || task.donor?.name}</strong>
          </span>
          <span className="flex items-center gap-1">
            📍 {task.donor?.location?.address || task.location?.address}
          </span>
          {task.acceptedBy && (
            <span className="flex items-center gap-1">
              🏢 To: <strong className="text-gray-700">{task.acceptedBy.organization || task.acceptedBy.name}</strong>
            </span>
          )}
          <span className="flex items-center gap-1">
            🍽️ {task.quantity?.value} {task.quantity?.unit} — {task.type}
          </span>
        </div>

        {task.deliveryNotes && (
          <p className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
            📝 {task.deliveryNotes}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex sm:flex-col gap-2 items-end self-start sm:self-center">
        {task.status === 'accepted' && (
          <Button size="sm" variant="amber" onClick={() => onPickup(task._id)}>
            📦 Mark Picked
          </Button>
        )}
        {task.status === 'picked' && (
          <Button size="sm" onClick={() => onDeliver(task._id)}>
            🎉 Mark Delivered
          </Button>
        )}
        {task.status === 'delivered' && (
          <span className="text-xs text-green-600 font-bold">Completed ✓</span>
        )}
      </div>
    </div>
  )
}

export default function VolunteerDashboard() {
  const { user, notifications } = useAuth()
  const [tasks, setTasks]     = useState([])
  const [available, setAvailable] = useState([])
  const [tab, setTab]         = useState('my-tasks')
  const [loading, setLoading] = useState(true)
  const [toast, setToast]     = useState('')

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const loadTasks = async () => {
    try {
      const { data } = await foodAPI.getVolunteerTasks()
      setTasks(data.tasks)
    } catch { setTasks([]) }
  }

  const loadAvailable = async () => {
    try {
      const { data } = await foodAPI.getAll({ status: 'accepted' })
      setAvailable(data.listings.filter((l) => !l.assignedVolunteer))
    } catch { setAvailable([]) }
  }

  useEffect(() => {
    Promise.all([loadTasks(), loadAvailable()]).finally(() => setLoading(false))
  }, [])

  // Re-check on new-task notification
  useEffect(() => {
    const latest = notifications[0]
    if (latest?.event === 'new-task') loadAvailable()
  }, [notifications])

  const handleAssign = async (id) => {
    try {
      await foodAPI.assignVolunteer(id)
      showToast('🚴 You are now assigned to this delivery!')
      await Promise.all([loadTasks(), loadAvailable()])
    } catch (err) {
      showToast('⚠️ ' + (err.response?.data?.message || 'Failed'))
    }
  }

  const handlePickup = async (id) => {
    try {
      await foodAPI.markPickedUp(id)
      showToast('📦 Marked as picked up!')
      loadTasks()
    } catch (err) { showToast('⚠️ ' + (err.response?.data?.message || 'Failed')) }
  }

  const handleDeliver = async (id) => {
    try {
      await foodAPI.markDelivered(id)
      showToast('🎉 Delivery complete! Thank you for helping!')
      loadTasks()
    } catch (err) { showToast('⚠️ ' + (err.response?.data?.message || 'Failed')) }
  }

  const pending   = tasks.filter((t) => t.status === 'accepted')
  const transit   = tasks.filter((t) => t.status === 'picked')
  const delivered = tasks.filter((t) => t.status === 'delivered')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-700 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-slide-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <p className="section-label">Volunteer Dashboard</p>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          Hello, {user?.name?.split(' ')[0]} 🚴
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your deliveries and pick up new tasks</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending',     value: pending.length,   icon: '⏳', color: 'text-amber-700' },
          { label: 'In Transit',  value: transit.length,   icon: '🚴', color: 'text-blue-700'  },
          { label: 'Delivered',   value: delivered.length, icon: '✅', color: 'text-green-700' },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <p className={`font-display text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-px">
        {[
          { id: 'my-tasks', label: `My Tasks (${tasks.length})` },
          { id: 'available', label: `Available Tasks (${available.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading tasks…" />
      ) : tab === 'my-tasks' ? (
        tasks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🚴</p>
            <p className="font-medium">No tasks yet.</p>
            <p className="text-sm mt-1">Head to "Available Tasks" to pick up a delivery.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((t) => (
              <TaskCard key={t._id} task={t} onPickup={handlePickup} onDeliver={handleDeliver} />
            ))}
          </div>
        )
      ) : (
        available.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-medium">No available tasks right now.</p>
            <p className="text-sm mt-1">Check back soon — new donations are posted regularly!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {available.map((l) => (
              <div key={l._id} className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-3 items-center">
                  <span className="text-3xl">{FOOD_EMOJI[l.type] || '🍽️'}</span>
                  <div>
                    <h4 className="font-bold text-gray-900">{l.name}</h4>
                    <p className="text-sm text-gray-500">{l.quantity?.value} {l.quantity?.unit} · {l.location?.city}</p>
                    <ExpiryBadge expiresAt={l.expiresAt} className="mt-1" />
                  </div>
                </div>
                <Button size="sm" variant="amber" onClick={() => handleAssign(l._id)}>
                  🚴 Accept Task
                </Button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
