/**
 * ExpiryBadge
 * Green  → > 8 hours left
 * Yellow → 2–8 hours left
 * Red    → < 2 hours left (urgent)
 */
export default function ExpiryBadge({ expiresAt, className = '' }) {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const hoursLeft = (expiry - now) / (1000 * 60 * 60)

  if (hoursLeft <= 0) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 ${className}`}>
        ⛔ Expired
      </span>
    )
  }

  const fmt = hoursLeft < 1
    ? `${Math.round(hoursLeft * 60)}m left`
    : hoursLeft < 24
    ? `${Math.round(hoursLeft)}h left`
    : `${Math.round(hoursLeft / 24)}d left`

  if (hoursLeft < 2) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse-soft ${className}`}>
        🔴 {fmt}
      </span>
    )
  }
  if (hoursLeft < 8) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 ${className}`}>
        🟡 {fmt}
      </span>
    )
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 ${className}`}>
      🟢 {fmt}
    </span>
  )
}
