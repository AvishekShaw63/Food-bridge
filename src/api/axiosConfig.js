import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fb_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fb_token')
      localStorage.removeItem('fb_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Scoped API helpers ────────────────────────────────────────

export const authAPI = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  getMe:          ()     => api.get('/auth/me'),
  updateLocation: (data) => api.put('/auth/update-location', data),
}

export const foodAPI = {
  create:          (data)   => api.post('/food', data),
  getAll:          (params) => api.get('/food', { params }),
  getNearby:       (params) => api.get('/food/nearby', { params }),
  getById:         (id)     => api.get(`/food/${id}`),
  update:          (id, data) => api.put(`/food/${id}`, data),
  delete:          (id)     => api.delete(`/food/${id}`),
  accept:          (id)     => api.post(`/food/${id}/accept`),
  assignVolunteer: (id)     => api.post(`/food/${id}/assign`),
  markPickedUp:    (id)     => api.post(`/food/${id}/pickup`),
  markDelivered:   (id)     => api.post(`/food/${id}/deliver`),
  getVolunteerTasks: (params) => api.get('/food/volunteer/tasks', { params }),
}

export const statsAPI = {
  getGlobal:      () => api.get('/stats'),
  getLeaderboard: () => api.get('/stats/leaderboard'),
}

export default api
