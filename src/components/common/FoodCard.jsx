import ExpiryBadge from './ExpiryBadge'
import Button from './Button'

const FOOD_EMOJIS = {
  cooked: '🍲', raw: '🥦', packaged: '📦',
  beverages: '🥤', bakery: '🍞', dairy: '🥛', other: '🍽️',
}

const STATUS_STYLES = {
  available: 'bg-green-100 text-green-700',
  accepted:  'bg-amber-100 text-amber-700',
  picked:    'bg-blue-100 text-blue-700',
  delivered: 'bg-purple-100 text-purple-700',
  expired:   'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-600',
}

export default function FoodCard({
  listing,
  onAccept,
  onAssign,
  onPickup,
  onDeliver,
  showActions = true,
  userRole,
}) {
  const {
    _id, name, type, category, quantity, status,
    location, donor, expiresAt, imageUrl, distance,
  } = listing

  const emoji = FOOD_EMOJIS[type] || '🍽️'

  return (
    <article className="card overflow-hidden hover:shadow-card-hover transition-shadow duration-300 flex flex-col">
      {/* Image / Emoji banner */}
      <div className="relative h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">{emoji}</span>
        )}

        {/* Expiry badge — top right */}
        <div className="absolute top-3 right-3">
          <ExpiryBadge expiresAt={expiresAt} />
        </div>

        {/* Category pill — top left */}
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-600">
          {category === 'veg' ? '🌿 Veg' : category === 'non-veg' ? '🍗 Non-Veg' : '🌱 Vegan'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display font-semibold text-gray-900 text-base leading-snug">{name}</h3>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">📦 {quantity.value} {quantity.unit}</span>
            <span className="flex items-center gap-1">🏷️ {type}</span>
            {donor?.organization && (
              <span className="flex items-center gap-1">🏪 {donor.organization}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Distance or address */}
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            📍 {distance ? `${(distance / 1000).toFixed(1)} km` : location?.city || 'Nearby'}
          </span>

          {/* Status */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[status] || STATUS_STYLES.available}`}>
            {status}
          </span>
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="mt-auto pt-1 flex gap-2">
            {userRole === 'ngo' && status === 'available' && (
              <Button size="sm" className="flex-1" onClick={() => onAccept?.(_id)}>
                ✅ Accept Donation
              </Button>
            )}
            {userRole === 'volunteer' && status === 'accepted' && !listing.assignedVolunteer && (
              <Button size="sm" variant="amber" className="flex-1" onClick={() => onAssign?.(_id)}>
                🚴 Take Delivery
              </Button>
            )}
            {userRole === 'volunteer' && status === 'accepted' && listing.assignedVolunteer && (
              <Button size="sm" variant="amber" className="flex-1" onClick={() => onPickup?.(_id)}>
                📦 Mark Picked Up
              </Button>
            )}
            {userRole === 'volunteer' && status === 'picked' && (
              <Button size="sm" className="flex-1" onClick={() => onDeliver?.(_id)}>
                🎉 Mark Delivered
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
