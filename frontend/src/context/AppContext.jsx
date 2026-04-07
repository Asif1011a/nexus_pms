import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'

const AppContext = createContext()

export const MEMBER_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-fuchsia-500',
]

// Normalize MongoDB _id → id so all existing page components keep working
function norm(obj) {
  if (!obj) return obj
  return { ...obj, id: obj._id || obj.id }
}
function normList(arr) {
  return (arr || []).map(item => {
    const n = norm(item)
    // Normalize nested populated objects
    if (n.members) n.members = n.members.map(m => (typeof m === 'object' ? norm(m) : m))
    if (n.assignee && typeof n.assignee === 'object') n.assignee = norm(n.assignee)
    if (n.projectId && typeof n.projectId === 'object') n.projectId = norm(n.projectId)
    if (n.userId && typeof n.userId === 'object') n.userId = norm(n.userId)
    return n
  })
}

// For tasks: assignee and projectId come back as populated objects or ObjectIds.
// Pages compare t.assignee === member.id (number/string), so we flatten to the id string.
function flattenTask(t) {
  const n = norm(t)
  if (n.assignee && typeof n.assignee === 'object') n.assignee = n.assignee._id || n.assignee.id
  if (n.projectId && typeof n.projectId === 'object') n.projectId = n.projectId._id || n.projectId.id
  return n
}

// For projects: members array may be populated objects — flatten to id strings for member pickers
function flattenProject(p) {
  const n = norm(p)
  if (n.members) {
    n.members = n.members.map(m => (typeof m === 'object' ? (m._id || m.id) : m))
  }
  return n
}

export function AppProvider({ children }) {
  const [state, setState] = useState({
    projects: [], tasks: [], members: [], notifications: [], activities: [],
  })
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [dataLoaded, setDataLoaded] = useState(false)

  const loadAll = useCallback(async () => {
    try {
      const [pRes, tRes, uRes, nRes, aRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks'),
        api.get('/users'),
        api.get('/notifications'),
        api.get('/activities'),
      ])
      setState({
        projects:      (pRes.projects      || []).map(flattenProject),
        tasks:         (tRes.tasks         || []).map(flattenTask),
        members:       normList(uRes.users  || []),
        notifications: normList(nRes.notifications || []),
        activities:    normList(aRes.activities    || []),
      })
    } catch (err) {
      console.error('Failed to load app data:', err.message)
    } finally {
      setDataLoaded(true)
    }
  }, [])

  // Manual fetch for members if needed (e.g. from Team page)
  const fetchUsers = useCallback(async () => {
    try {
      const uRes = await api.get('/users')
      setState(s => ({ ...s, members: normList(uRes.users || []) }))
    } catch (err) { console.error('Failed to fetch users:', err.message) }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Dispatch: mirrors the old reducer actions but calls the API ──────────────
  const dispatch = useCallback(async (action) => {
    try {
      switch (action.type) {

        case 'ADD_PROJECT': {
          const res = await api.post('/projects', action.payload)
          setState(s => ({ ...s, projects: [...s.projects, flattenProject(res.project)] }))
          break
        }
        case 'UPDATE_PROJECT': {
          const { id, _id, ...updates } = action.payload
          const pid = id || _id
          const res = await api.put(`/projects/${pid}`, updates)
          setState(s => ({ ...s, projects: s.projects.map(p => p.id === pid ? flattenProject(res.project) : p) }))
          break
        }
        case 'DELETE_PROJECT': {
          await api.delete(`/projects/${action.payload}`)
          setState(s => ({
            ...s,
            projects: s.projects.filter(p => p.id !== action.payload),
            tasks:    s.tasks.filter(t => t.projectId !== action.payload),
          }))
          break
        }

        case 'ADD_TASK': {
          const res = await api.post('/tasks', action.payload)
          setState(s => ({ ...s, tasks: [...s.tasks, flattenTask(res.task)] }))
          break
        }
        case 'UPDATE_TASK': {
          const { id, _id, ...updates } = action.payload
          const tid = id || _id
          const res = await api.put(`/tasks/${tid}`, updates)
          setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === tid ? flattenTask(res.task) : t) }))
          break
        }
        case 'DELETE_TASK': {
          await api.delete(`/tasks/${action.payload}`)
          setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== action.payload) }))
          break
        }
        case 'MOVE_TASK': {
          const { id, status } = action.payload
          const res = await api.put(`/tasks/${id}`, { status })
          setState(s => ({ ...s, tasks: s.tasks.map(t => t.id === id ? flattenTask(res.task) : t) }))
          break
        }

        // Members in AppContext = Users from the API
        case 'ADD_MEMBER': {
          // Members added via Team page — create as user via admin endpoint
          const res = await api.post('/users', { ...action.payload, password: 'Nexus@123', role: 'user' })
          const newMember = norm(res.user)
          setState(s => ({ ...s, members: [...s.members, newMember] }))
          break
        }
        case 'UPDATE_MEMBER': {
          const { id, _id, ...updates } = action.payload
          const mid = id || _id
          const res = await api.put(`/users/${mid}`, updates)
          const updated = norm(res.user)
          setState(s => ({ ...s, members: s.members.map(m => m.id === mid ? updated : m) }))
          break
        }
        case 'DELETE_MEMBER': {
          await api.delete(`/users/${action.payload}`)
          setState(s => ({ ...s, members: s.members.filter(m => m.id !== action.payload) }))
          break
        }

        case 'MARK_NOTIFICATION_READ': {
          await api.put(`/notifications/${action.payload}/read`, {})
          setState(s => ({
            ...s,
            notifications: s.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n),
          }))
          break
        }
        case 'MARK_ALL_READ': {
          await api.put('/notifications/read-all', {})
          setState(s => ({
            ...s,
            notifications: s.notifications.map(n => ({ ...n, read: true })),
          }))
          break
        }

        default:
          console.warn('Unknown dispatch action:', action.type)
      }
    } catch (err) {
      console.error(`dispatch ${action.type} failed:`, err.message)
    }
  }, [])

  // No longer blocking the whole app with return null
  // This allows Sidebar/Header to show up immediately

  return (
    <AppContext.Provider value={{ state, dispatch, currentPage, setCurrentPage, dataLoaded, fetchUsers }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
