import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AddFood from './pages/AddFood'

import DonorDashboard    from './pages/dashboards/DonorDashboard'
import NgoDashboard      from './pages/dashboards/NgoDashboard'
import VolunteerDashboard from './pages/dashboards/VolunteerDashboard'

import ProtectedRoute from './routes/ProtectedRoute'

const DashboardRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const map = { donor: '/dashboard/donor', ngo: '/dashboard/ngo', volunteer: '/dashboard/volunteer' }
  return <Navigate to={map[user.role] || '/login'} replace />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Smart dashboard redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Role-protected dashboards */}
          <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
            <Route path="/dashboard/donor"  element={<DonorDashboard />} />
            <Route path="/food/add"         element={<AddFood />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ngo']} />}>
            <Route path="/dashboard/ngo"    element={<NgoDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
            <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
