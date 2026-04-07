import { useState } from 'react'
import { useApp } from '../context/AppContext'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
  const { state } = useApp()
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))

  // Collect all deadline events
  const events = {}
  state.projects.forEach(p => {
    if (p.dueDate) {
      const d = new Date(p.dueDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!events[day]) events[day] = []
        events[day].push({ type: 'project', name: p.name, color: p.color, status: p.status })
      }
    }
    if (p.startDate) {
      const d = new Date(p.startDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!events[day]) events[day] = []
        events[day].push({ type: 'start', name: `${p.name} (start)`, color: p.color, status: p.status })
      }
    }
  })
  state.tasks.forEach(t => {
    if (t.dueDate) {
      const d = new Date(t.dueDate)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate()
        if (!events[day]) events[day] = []
        events[day].push({ type: 'task', name: t.title, color: 'bg-violet-500', status: t.status })
      }
    }
  })

  // Build calendar grid
  const cells = []
  // Prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  // Next month padding
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false })
  }

  // Upcoming deadlines list
  const upcoming = state.projects
    .filter(p => p.dueDate)
    .map(p => ({ ...p, dateObj: new Date(p.dueDate) }))
    .filter(p => p.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">{MONTHS[month]} {year}</h2>
            <div className="flex items-center gap-2">
              <button onClick={goToday} className="text-sm text-violet-600 hover:text-violet-700 font-medium px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors">Today</button>
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider py-2">{d}</div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
            {cells.map((cell, idx) => {
              const isToday = cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const cellEvents = cell.current ? (events[cell.day] || []) : []
              return (
                <div key={idx} className={`bg-white min-h-20 p-2 ${!cell.current ? 'bg-slate-50' : ''}`}>
                  <div className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full mb-1 mx-auto
                    ${isToday ? 'bg-violet-600 text-white' : cell.current ? 'text-slate-800 hover:bg-slate-100' : 'text-slate-300'}`}>
                    {cell.day}
                  </div>
                  <div className="space-y-0.5">
                    {cellEvents.slice(0, 2).map((ev, i) => (
                      <div key={i} title={ev.name} className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${ev.color}`}>
                        {ev.type === 'task' ? '✓ ' : ev.type === 'start' ? '▶ ' : '⏎ '}{ev.name}
                      </div>
                    ))}
                    {cellEvents.length > 2 && (
                      <div className="text-xs text-slate-400 pl-1">+{cellEvents.length - 2} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-violet-500" /> Task deadline</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /> Project deadline</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500" /> Project start</div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcoming.length === 0 && <p className="text-sm text-slate-400">No upcoming deadlines</p>}
              {upcoming.map(p => {
                const daysLeft = Math.ceil((p.dateObj - today) / (1000 * 60 * 60 * 24))
                return (
                  <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${p.color} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.dueDate}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${daysLeft <= 7 ? 'bg-rose-100 text-rose-700' : daysLeft <= 30 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {daysLeft}d
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* This month summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-4">This Month</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Events', value: Object.values(events).flat().length, color: 'text-violet-600' },
                { label: 'Project Deadlines', value: Object.values(events).flat().filter(e => e.type === 'project').length, color: 'text-blue-600' },
                { label: 'Task Deadlines', value: Object.values(events).flat().filter(e => e.type === 'task').length, color: 'text-amber-600' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
