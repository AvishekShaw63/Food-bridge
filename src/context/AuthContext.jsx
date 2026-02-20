import { createContext, useState, useEffect, useCallback } from 'react'
import { io } from 'socket.io-client'
import { authAPI } from '../api/axiosConfig'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(() => {
    try { return JSON.parse(localStorage.getItem('fb_user')) } catch { return null }
  })
  const [token, setToken]       = useState(() => localStorage.getItem('fb_token') || null)
  const [loading, setLoading]   = useState(true)
  const [socket, setSocket]     = useState(null)
  const [notifications, setNotifications] = useState([])

  // ── Rehydrate on mount ──────────────────────────────────────
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await authAPI.getMe()
        setUser(data.user)
        localStorage.setItem('fb_user', JSON.stringify(data.user))
      } catch {
        logout()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, []) // eslint-disable-line

  // ── Socket connection ───────────────────────────────────────
  useEffect(() => {
    if (!token) { socket?.disconnect(); setSocket(null); return }

    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    })

    s.on('connect', () => console.log('🔌 Socket connected'))
    s.on('disconnect', () => console.log('🔌 Socket disconnected'))

    // Real-time notification events
    const events = [
      'new-listing', 'listing-accepted', 'new-task',
      'food-picked', 'food-delivered', 'receive-message',
    ]
    events.forEach((evt) => {
      s.on(evt, (data) => {
        setNotifications((prev) => [
          { id: Date.now(), event: evt, ...data, read: false },
          ...prev.slice(0, 19),
        ])
      })
    })

    setSocket(s)
    return () => s.disconnect()
  }, [token])

  // ── Login ───────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials)
    localStorage.setItem('fb_token', data.token)
    localStorage.setItem('fb_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  // ── Register ─────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData)
    localStorage.setItem('fb_token', data.token)
    localStorage.setItem('fb_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }, [])

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('fb_token')
    localStorage.removeItem('fb_user')
    setToken(null)
    setUser(null)
    setNotifications([])
    socket?.disconnect()
  }, [socket])

  const markAllRead = () =>
    setNotifications((n) => n.map((x) => ({ ...x, read: true })))

  const value = {
    user, token, loading, socket,
    notifications, markAllRead,
    login, register, logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
