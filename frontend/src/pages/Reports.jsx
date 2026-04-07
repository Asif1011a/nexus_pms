import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { exportProjectsCSV, exportTasksCSV, exportMembersCSV, exportAllJSON, exportProjectsPrint, exportTasksPrint } from '../utils/exportUtils'

function BarChart({ data, maxValue }) {
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-slate-700">{item.value}</span>
          <div className="w-full flex items-end" style={{ height: '120px' }}>
            <div
              className={`w-full ${item.color} rounded-t-lg transition-all duration-700`}
              style={{ height: `${(item.value / Math.max(maxValue, 1)) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 text-center leading-tight">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  let offset = 0
  const r = 45
  const cx = 60
  const cy = 60
  const circumference = 2 * Math.PI * r

  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="18" />
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.value / total : 0
        const dash = pct * circumference
        const gap = circumference - dash
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="18"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circumference}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
          />
        )
        offset += pct
        return el
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="font-bold" style={{ fontSize: '18px', fontWeight: 700, fill: '#1e293b' }}>
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fontSize: '9px', fill: '#94a3b8' }}>Total</text>
    </svg>
  )
}

function ExportMenu({ state }) {
  const [open, setOpen] = useState(false)
  const { projects, tasks, members } = state

  const actions = [
    { label: '📊 Projects — CSV', fn: () => exportProjectsCSV(projects) },
    { label: '✅ Tasks — CSV', fn: () => exportTasksCSV(tasks, projects, members) },
    { label: '👥 Team — CSV', fn: () => exportMembersCSV(members) },
    { label: '📦 Full Backup — JSON', fn: () => exportAllJSON(state) },
    { label: '🖨️ Print Projects Report', fn: () => exportProjectsPrint(projects) },
    { label: '🖨️ Print Tasks Report', fn: () => exportTasksPrint(tasks, projects, members) },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-violet-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Export / Download
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden w-56 py-1">
          {actions.map(a => (
            <button
              key={a.label}
              onClick={() => { a.fn(); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Reports() {
  const { state } = useApp()
  const { projects, tasks, members } = state

  const statusCounts = {
    'In Progress': projects.filter(p => p.status === 'in-progress').length,
    'Planning': projects.filter(p => p.status === 'planning').length,
    'Completed': projects.filter(p => p.status === 'completed').length,
    'On Hold': projects.filter(p => p.status === 'on-hold').length,
  }

  const taskByPriority = [
    { label: 'High', value: tasks.filter(t => t.priority === 'high').length, color: 'bg-rose-500' },
    { label: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: 'bg-amber-500' },
    { label: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: 'bg-emerald-500' },
  ]

  const donutData = [
    { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#94a3b8' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#3b82f6' },
    { label: 'Done', value: tasks.filter(t => t.status === 'done').length, color: '#10b981' },
  ]

  const memberPerformance = members.map(m => ({
    ...m,
    total: tasks.filter(t => t.assignee === m.id).length,
    done: tasks.filter(t => t.assignee === m.id && t.status === 'done').length,
  })).sort((a, b) => b.done - a.done)

  const completionRate = Math.round((tasks.filter(t => t.status === 'done').length / Math.max(tasks.length, 1)) * 100)

  return (
    <div className="space-y-6">
      {/* Export toolbar */}
      <div className="flex justify-end">
        <ExportMenu state={state} />
      </div>
      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, sub: 'Tasks done', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Projects', value: projects.filter(p => p.status === 'in-progress').length, sub: 'In progress', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Progress', value: `${Math.round(projects.reduce((s, p) => s + p.progress, 0) / Math.max(projects.length, 1))}%`, sub: 'Across projects', color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Overdue Tasks', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length, sub: 'Need attention', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-slate-500 text-sm font-medium mb-2">{kpi.label}</p>
            <p className={`text-3xl font-bold ${kpi.color} mb-1`}>{kpi.value}</p>
            <p className="text-slate-400 text-xs">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Project Status */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-6">Project Status Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([label, count]) => {
              const pct = Math.round((count / Math.max(projects.length, 1)) * 100)
              const color = { 'In Progress': 'bg-blue-500', 'Planning': 'bg-amber-500', 'Completed': 'bg-emerald-500', 'On Hold': 'bg-slate-400' }[label]
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-slate-700 font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="font-bold text-slate-900">{count}</span>
                      <span className="text-xs w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`${color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-6">Task Distribution</h2>
          <div className="flex items-center gap-8 justify-center">
            <DonutChart segments={donutData} size={140} />
            <div className="space-y-3">
              {donutData.map(seg => (
                <div key={seg.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="text-sm text-slate-600">{seg.label}</span>
                  <span className="font-bold text-slate-900 ml-auto pl-4">{seg.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tasks by Priority */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-6">Tasks by Priority</h2>
          <BarChart data={taskByPriority} maxValue={Math.max(...taskByPriority.map(d => d.value), 1)} />
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-5">Team Performance</h2>
          <div className="space-y-4">
            {memberPerformance.slice(0, 5).map(m => {
              const pct = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${m.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-800 truncate">{m.name}</span>
                      <span className="text-slate-500 text-xs ml-2 flex-shrink-0">{m.done}/{m.total} tasks</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className={`${m.color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-9 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Project Progress Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">Project Progress Overview</h2>
          <div className="flex gap-2">
            <button onClick={() => exportProjectsCSV(projects)} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-violet-700 border border-slate-200 hover:border-violet-300 px-3 py-1.5 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              CSV
            </button>
            <button onClick={() => exportProjectsPrint(projects)} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-violet-700 border border-slate-200 hover:border-violet-300 px-3 py-1.5 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
              </svg>
              Print PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3 pr-4">Progress</th>
                <th className="pb-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${p.color}`} />
                      <span className="text-sm font-medium text-slate-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-500">{p.category}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${{
                      'in-progress': 'bg-blue-100 text-blue-700',
                      'planning': 'bg-amber-100 text-amber-700',
                      'completed': 'bg-emerald-100 text-emerald-700',
                      'on-hold': 'bg-slate-100 text-slate-600',
                    }[p.status]}`}>{p.status.replace('-', ' ')}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${{
                      high: 'bg-rose-100 text-rose-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-emerald-100 text-emerald-700'
                    }[p.priority]}`}>{p.priority}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5">
                        <div className={`${p.color} h-1.5 rounded-full`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 font-medium">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-slate-500">{p.dueDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
