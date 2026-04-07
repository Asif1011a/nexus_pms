import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

function buildInitials(name) {
  const parts = (name || '').trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].substring(0, 2).toUpperCase()
  return (name || '??').substring(0, 2).toUpperCase()
}

// Normalize MongoDB _id → id so all existing frontend code keeps working
function normalize(user) {
  if (!user) return null
  return { ...user, id: user._id || user.id }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // On mount: restore session from token
  useEffect(() => {
    const token = localStorage.getItem('nexus_token')
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(data => setSession(normalize(data.user)))
      .catch(() => localStorage.removeItem('nexus_token'))
      .finally(() => setLoading(false))
  }, [])

  // Users are now fetched on-demand or by AppContext to reduce login latency

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password })
      localStorage.setItem('nexus_token', data.token)
      const user = normalize(data.user)
      setSession(user)
      return { success: true, user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const signup = async ({ name, email, password, jobTitle, department }) => {
    try {
      const data = await api.post('/auth/signup', { name, email, password, jobTitle, department })
      return { success: true, user: normalize(data.user) }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('nexus_token')
    setSession(null)
    setUsers([])
  }

  const forgotPassword = async (email) => {
    try {
      const data = await api.post('/auth/forgot-password', { email })
      return { success: true, otp: data.otp }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      await api.post('/auth/verify-otp', { email, otp })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const resetPassword = async (email, otp, newPassword) => {
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateUser = async (id, updates) => {
    try {
      const finalUpdates = updates.name
        ? { ...updates, initials: buildInitials(updates.name) }
        : updates
      const data = await api.put(`/users/${id}`, finalUpdates)
      const updated = normalize(data.user)
      setUsers(prev => prev.map(u => u.id === id ? updated : u))
      if (session?.id === id) setSession(updated)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const addUserByAdmin = async ({ name, email, password, jobTitle, department, role }) => {
    try {
      const data = await api.post('/users', { name, email, password, jobTitle, department, role })
      const newUser = normalize(data.user)
      setUsers(prev => [...prev, newUser])
      return { success: true, user: newUser }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{
      session, currentUser: session,
      users, isAuthenticated: !!session,
      isAdmin: session?.role === 'admin',
      login, signup, logout,
      forgotPassword, verifyOTP, resetPassword,
      updateUser, deleteUser, addUserByAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
