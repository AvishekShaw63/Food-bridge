import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../common/Button'

const DASHBOARD_LINKS = {
  donor:     '/dashboard/donor',
  ngo:       '/dashboard/ngo',
  volunteer: '/dashboard/volunteer',
}

export default function Navbar() {
  const { user, logout, isAuthenticated, notifications } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen]   = useState(false)
  const navigate = useNavigate()

  const unread = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-green-800 hover:text-green-700 transition-colors">
          <span className="text-2xl">🌿</span>
          <span>FoodBridge</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-green-700 hover:bg-green-50'}`
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to={DASHBOARD_LINKS[user.role]}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-green-700 hover:bg-green-50'}`
              }
            >
              Dashboard
            </NavLink>
          )}

          {user?.role === 'donor' && (
            <NavLink
              to="/food/add"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-green-50 text-green-700' : 'text-gray-500 hover:text-green-700 hover:bg-green-50'}`
              }
            >
              + Donate Food
            </NavLink>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-xl hover:bg-green-50 text-gray-500 transition-colors"
                >
                  🔔
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">No notifications yet</p>
                    ) : (
                      <ul className="space-y-1 max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <li key={n.id} className={`text-sm px-3 py-2 rounded-xl ${n.read ? 'text-gray-400' : 'bg-green-50 text-gray-700 font-medium'}`}>
                            {n.message}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* User pill */}
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-xl">
                <span className="text-lg">{user.role === 'donor' ? '🍽️' : user.role === 'ngo' ? '🏢' : '🚴'}</span>
                <span className="text-sm font-semibold text-green-800">{user.name.split(' ')[0]}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/register')}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-green-50 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-green-100 px-4 py-4 flex flex-col gap-2 animate-fade-in">
          <Link to="/" className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50" onClick={() => setMobileOpen(false)}>Home</Link>
          {isAuthenticated && (
            <Link to={DASHBOARD_LINKS[user.role]} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          )}
          {user?.role === 'donor' && (
            <Link to="/food/add" className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50" onClick={() => setMobileOpen(false)}>+ Donate Food</Link>
          )}
          <hr className="border-green-100 my-1" />
          {isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate('/login'); setMobileOpen(false) }}>Login</Button>
              <Button size="sm" className="flex-1" onClick={() => { navigate('/register'); setMobileOpen(false) }}>Register</Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
