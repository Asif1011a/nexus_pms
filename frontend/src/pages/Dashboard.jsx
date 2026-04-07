import { useApp } from '../context/AppContext'
import { useRealTimeNotifications } from '../hooks/useRealTimeNotifications'

const statusColors = {
  'in-progress': 'bg-blue-100 text-blue-700',
  'planning': 'bg-amber-100 text-amber-700',
  'completed': 'bg-emerald-100 text-emerald-700',
  'on-hold': 'bg-slate-100 text-slate-600',
}
const priorityColors = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
}

function StatCard({ title, value, subtitle, accent, trend }) {
  return (
    <div className="card-lift stat-card-gradient rounded-2xl p-5 border border-stone-200/80 relative overflow-hidden">
      {/* Colored accent line at top — not full color fill */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: accent }} />
      <div className="flex items-end justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest mb-3">{title}</p>
          {trend !== undefined && (
            <p className={`text-[11px] font-bold mb-1 ${trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-rose-500' : 'text-stone-400'}`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '—'} {trend !== 0 ? `${Math.abs(trend)}%` : 'no change'}
            </p>
          )}
          <p className="text-stone-500 text-xs leading-tight">{subtitle}</p>
        </div>
        {/* Editorial large number — right-aligned */}
        <p className="stat-number text-5xl font-extrabold text-stone-800 tabular-nums leading-none flex-shrink-0"
          style={{ letterSpacing: '-0.05em' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

function ProgressBar({ value, color = 'bg-violet-500' }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5">
      <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  )
}

export default function Dashboard() {
  const { state, setCurrentPage, dataLoaded } = useApp()
  useRealTimeNotifications() // ← fires real-time team activity notifications
  const { projects, tasks, members, activities } = state

  if (!dataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Syncing your workspace...</p>
      </div>
    )
  }

  const totalProjects = projects.length
  const activeTasks = tasks.filter(t => t.status !== 'done').length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const totalMembers = members.length

  const todoCount = tasks.filter(t => t.status === 'todo').length
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
  const doneCount = tasks.filter(t => t.status === 'done').length
  const totalTasks = tasks.length

  const recentProjects = [...projects].slice(0, 4)

  return (
    <div className="space-y-6">
      {/* Stat Cards — editorial style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={totalProjects}
          subtitle={`${projects.filter(p => p.status === 'in-progress').length} active right now`}
          accent="linear-gradient(90deg, #7c3aed, #a78bfa)" trend={0} />
        <StatCard title="Active Tasks" value={activeTasks}
          subtitle={`${inProgressCount} in progress`}
          accent="linear-gradient(90deg, #2563eb, #60a5fa)" trend={0} />
        <StatCard title="Completed" value={completedTasks}
          subtitle={`${Math.round((completedTasks / Math.max(totalTasks,1)) * 100)}% completion rate`}
          accent="linear-gradient(90deg, #059669, #34d399)" trend={0} />
        <StatCard title="Team Size" value={totalMembers}
          subtitle="Across all projects"
          accent="linear-gradient(90deg, #d97706, #fbbf24)" trend={0} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Recent Projects</h2>
            <button onClick={() => setCurrentPage('projects')} className="text-violet-600 hover:text-violet-700 text-sm font-medium">View all →</button>
          </div>
          <div className="space-y-4">
            {recentProjects.map(project => {
              const projectMembers = members.filter(m => project.members.includes(m.id))
              return (
                <div key={project.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 ${project.color} rounded-xl flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">{project.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ml-2 flex-shrink-0 ${statusColors[project.status]}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <ProgressBar value={project.progress} />
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex -space-x-1">
                        {projectMembers.slice(0, 3).map(m => (
                          <div key={m.id} className={`w-5 h-5 ${m.color} rounded-full border border-white flex items-center justify-center text-white text-xs font-bold`}>
                            {m.initials[0]}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Task Distribution + Activity */}
        <div className="space-y-6">
          {/* Task Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Task Overview</h2>
            <div className="space-y-3">
              {[
                { label: 'To Do', count: todoCount, color: 'bg-slate-400', pct: Math.round((todoCount/Math.max(totalTasks,1))*100) },
                { label: 'In Progress', count: inProgressCount, color: 'bg-blue-500', pct: Math.round((inProgressCount/Math.max(totalTasks,1))*100) },
                { label: 'Completed', count: doneCount, color: 'bg-emerald-500', pct: Math.round((doneCount/Math.max(totalTasks,1))*100) },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">{item.count}</span>
                  </div>
                  <ProgressBar value={item.pct} color={item.color} />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activities.slice(0, 4).map(act => {
                const user = members.find(m => m.id === act.userId)
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`w-7 h-7 ${user?.color || 'bg-slate-400'} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {user?.initials || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">
                        <span className="font-medium">{user?.name}</span> {act.action}{' '}
                        {act.subject && <span className="text-violet-600 font-medium">{act.subject}</span>}
                        {act.project && <span className="text-slate-500"> in {act.project}</span>}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Priority Tasks */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900">High Priority Tasks</h2>
          <button onClick={() => setCurrentPage('tasks')} className="text-violet-600 hover:text-violet-700 text-sm font-medium">View all →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="pb-3 pr-4">Task</th>
                <th className="pb-3 pr-4">Project</th>
                <th className="pb-3 pr-4">Assignee</th>
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tasks.filter(t => t.priority === 'high' && t.status !== 'done').slice(0, 5).map(task => {
                const project = projects.find(p => p.id === task.projectId)
                const assignee = members.find(m => m.id === task.assignee)
                return (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="text-sm font-medium text-slate-800">{task.title}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-slate-500">{project?.name || '—'}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${assignee?.color || 'bg-slate-400'} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                          {assignee?.initials[0] || '?'}
                        </div>
                        <span className="text-xs text-slate-600">{assignee?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-slate-500">{task.dueDate}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
