import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/common/Loader'

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their correct dashboard
    const dashMap = { donor: '/dashboard/donor', ngo: '/dashboard/ngo', volunteer: '/dashboard/volunteer' }
    return <Navigate to={dashMap[user.role] || '/'} replace />
  }

  return <Outlet />
}
