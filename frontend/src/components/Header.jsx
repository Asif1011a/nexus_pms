import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const PAGE_TITLES = {
  dashboard: 'Dashboard', projects: 'Projects', tasks: 'Tasks',
  'my-tasks': 'My Tasks', team: 'Team', calendar: 'Calendar',
  reports: 'Reports', settings: 'Settings', users: 'User Management',
}

const PAGE_SUBTITLES = {
  dashboard: 'Welcome back! Here\'s what\'s happening.',
  projects: 'Manage and track all your projects.',
  tasks: 'Organize your work with the Kanban board.',
  'my-tasks': 'Your personal task board.',
  team: 'Manage your team members and roles.',
  calendar: 'View deadlines and upcoming milestones.',
  reports: 'Analytics and insights about your projects.',
  settings: 'Manage your account and preferences.',
  users: 'Manage user accounts and permissions.',
}

/** Hook that calls `handler` when a click happens outside `ref` */
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

export default function Header() {
  const { currentPage, state, dispatch } = useApp()
  const { currentUser } = useAuth()
  const [showNotifs, setShowNotifs] = useState(false)
  const [search, setSearch] = useState('')
  const unread = state.notifications.filter(n => !n.read).length
  const notifRef = useRef(null)

  // Close notification panel when clicking outside
  useClickOutside(notifRef, () => setShowNotifs(false))

  // Live search results: filter projects and tasks
  const searchResults = search.trim().length > 1
    ? [
        ...state.projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => ({ type: 'project', label: p.name, sub: p.status })),
        ...state.tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase())).map(t => ({ type: 'task', label: t.title, sub: t.status })),
      ].slice(0, 6)
    : []

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{PAGE_TITLES[currentPage]}</h1>
        <p className="text-slate-500 text-sm">{PAGE_SUBTITLES[currentPage]}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Search */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects & tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-60 transition-all"
          />
          {searchResults.length > 0 && (
            <div className="absolute left-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
              {searchResults.map((r, i) => (
                <div key={i} onClick={() => setSearch('')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === 'project' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                    {r.type}
                  </span>
                  <span className="text-sm text-slate-800 font-medium truncate flex-1">{r.label}</span>
                  <span className="text-xs text-slate-400">{r.sub}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => setShowNotifs(v => !v)}
            className="relative w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                  {unread > 0 && (
                    <span className="bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{unread}</span>
                  )}
                </div>
                <button onClick={() => dispatch({ type: 'MARK_ALL_READ' })} className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {state.notifications.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-8">No notifications</p>
                )}
                {state.notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: n.id })}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${!n.read ? 'bg-violet-50/40' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-violet-500' : 'bg-slate-200'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{n.message}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-slate-100 text-center">
                <button onClick={() => setShowNotifs(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with name */}
        <div className="flex items-center gap-2.5 pl-1 border-l border-slate-200 ml-1">
          <div className={`w-9 h-9 ${currentUser?.color || 'bg-violet-500'} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
            {currentUser?.initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">{currentUser?.role === 'admin' ? '👑 Admin' : '👤 ' + (currentUser?.jobTitle || 'User')}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
