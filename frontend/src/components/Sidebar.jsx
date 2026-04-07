import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const ADMIN_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg> },
  { key: 'projects', label: 'Projects', badge: true, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0v.243a2.25 2.25 0 0 1-2.182 2.247H4.432A2.25 2.25 0 0 1 2.25 14.493V14.25" /></svg> },
  { key: 'tasks', label: 'Tasks', badge: true, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  { key: 'team', label: 'Team', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg> },
  { key: 'calendar', label: 'Calendar', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg> },
  { key: 'reports', label: 'Reports', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg> },
  { key: 'users', label: 'Users', adminOnly: true, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg> },
  { key: 'settings', label: 'Settings', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg> },
]

const USER_NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: ADMIN_NAV[0].icon },
  { key: 'my-tasks', label: 'My Tasks', badge: true, icon: ADMIN_NAV[2].icon },
  { key: 'calendar', label: 'Calendar', icon: ADMIN_NAV[4].icon },
  { key: 'settings', label: 'Settings', icon: ADMIN_NAV[7].icon },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, state } = useApp()
  const { currentUser, logout, isAdmin } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const projectCount = state.projects.filter(p => p.status !== 'completed').length
  const taskCount = isAdmin
    ? state.tasks.filter(t => t.status !== 'done').length
    : state.tasks.filter(t => t.assignee === currentUser?.id && t.status !== 'done').length

  const badges = { projects: projectCount, tasks: taskCount, 'my-tasks': taskCount }
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV

  return (
    <aside
      className={`${collapsed ? 'w-[60px]' : 'w-60'} flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 relative overflow-hidden sidebar-noise`}
      style={{ background: 'linear-gradient(180deg, #0f1117 0%, #12141c 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Ambient glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }} />

      {/* Logo / Header */}
      <div className={`flex items-center px-3 py-4 ${collapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-2.5">
          {/* Unique hexagonal-style logo mark */}
          <div className="w-8 h-8 flex-shrink-0 relative flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <span className="text-white font-bold text-base tracking-tight leading-none">Nexus</span>
              <span className="block text-[10px] text-violet-400/70 font-medium tracking-widest uppercase leading-none mt-0.5">Workspace</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />}
          </svg>
        </button>
      </div>

      {/* Role chip — angular, not a pill */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${
            isAdmin ? 'bg-violet-500/15 text-violet-300' : 'bg-sky-500/15 text-sky-300'
          }`}>
            {isAdmin ? '⬡' : '○'} {isAdmin ? 'Admin' : 'Member'}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="mx-3 mb-2" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {!collapsed && <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest px-3 mb-2 mt-1">Navigation</p>}
        {navItems.map(item => {
          const active = currentPage === item.key
          return (
            <button
              key={item.key}
              onClick={() => setCurrentPage(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative rounded-[10px]
                ${active ? 'nav-active text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
                ${collapsed ? 'justify-center' : ''}`}
            >
              <span className={`flex-shrink-0 transition-colors ${active ? 'text-violet-300' : 'group-hover:text-slate-200'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className={`flex-1 text-left text-[13px] ${active ? 'text-white font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              )}
              {!collapsed && item.badge && badges[item.key] > 0 && (
                <span className="mono text-[10px] font-bold text-slate-500 tabular-nums">
                  {badges[item.key]}
                </span>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-14 bg-[#1e2030] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-xl">
                  {item.label}{item.badge && badges[item.key] > 0 ? ` · ${badges[item.key]}` : ''}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* User Profile + Sign Out */}
      <div className="mx-3 mb-3" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
      <div className="px-2 pb-3 space-y-1">
        {/* User card */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-[10px] ${collapsed ? 'justify-center' : ''}`}
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className={`w-7 h-7 ${currentUser?.color || 'bg-violet-500'} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {(currentUser?.initials || '??').substring(0, 2)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-semibold truncate leading-tight">{currentUser?.name}</p>
              <p className="text-slate-500 text-[10px] truncate leading-tight">{currentUser?.jobTitle || currentUser?.email}</p>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          title="Sign out"
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium text-slate-600 hover:text-rose-400 hover:bg-rose-500/8 transition-all ${collapsed ? 'justify-center' : ''} group relative`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          {!collapsed && <span>Sign out</span>}
          {collapsed && (
            <div className="absolute left-14 bg-[#1e2030] border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
              Sign out
            </div>
          )}
        </button>

        {/* Version stamp */}
        {!collapsed && (
          <p className="text-center text-[9px] text-slate-700 font-mono tracking-widest pt-1">NEXUS v1.0 · 2025</p>
        )}
      </div>
    </aside>
  )
}
