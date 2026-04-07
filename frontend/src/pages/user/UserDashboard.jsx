import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export default function UserDashboard() {
  const { state } = useApp()
  const { currentUser } = useAuth()

  const myTasks = state.tasks.filter(t => t.assignee === currentUser?.id)
  const myProjects = state.projects.filter(p => p.members?.includes(currentUser?.id))
  const todayTasks = myTasks.filter(t => t.status !== 'done')
  const doneTasks = myTasks.filter(t => t.status === 'done')
  const inProgress = myTasks.filter(t => t.status === 'in-progress')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-sm font-medium">{greeting}! 👋</p>
            <h2 className="text-2xl font-bold mt-1">{currentUser?.name}</h2>
            <p className="text-violet-200 text-sm mt-1">{currentUser?.jobTitle} · {currentUser?.department}</p>
          </div>
          <div className={`w-16 h-16 ${currentUser?.color} rounded-2xl border-4 border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
            {currentUser?.initials}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { label: 'Total Tasks', value: myTasks.length },
            { label: 'In Progress', value: inProgress.length },
            { label: 'Completed', value: doneTasks.length },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-violet-200 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My Active Tasks */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900">My Active Tasks</h3>
            <span className="text-xs text-slate-400">{todayTasks.length} pending</span>
          </div>
          {todayTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">All caught up! 🎉</p>
              <p className="text-slate-400 text-sm">No pending tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.slice(0, 6).map(task => {
                const project = state.projects.find(p => p.id === task.projectId)
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                      {project && <p className="text-xs text-slate-400 truncate">{project.name}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>{task.status.replace('-', ' ')}</span>
                      {task.dueDate && <span className="text-xs text-slate-400">{task.dueDate}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* My Projects */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-5">My Projects</h3>
          <div className="space-y-4">
            {myProjects.length === 0 && (
              <p className="text-slate-400 text-sm">You're not assigned to any projects.</p>
            )}
            {myProjects.map(p => (
              <div key={p.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${p.color} flex-shrink-0`} />
                  <p className="text-sm font-semibold text-slate-800 truncate flex-1">{p.name}</p>
                  <span className={`text-xs font-medium ${
                    p.status === 'in-progress' ? 'text-blue-600' :
                    p.status === 'completed' ? 'text-emerald-600' : 'text-slate-500'
                  }`}>{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`${p.color} h-1.5 rounded-full transition-all`} style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'To Do', value: myTasks.filter(t => t.status === 'todo').length, color: 'border-slate-300 bg-slate-50', badge: 'bg-slate-500' },
          { label: 'In Progress', value: inProgress.length, color: 'border-blue-200 bg-blue-50', badge: 'bg-blue-500' },
          { label: 'Completed', value: doneTasks.length, color: 'border-emerald-200 bg-emerald-50', badge: 'bg-emerald-500' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border ${s.color} p-5 flex items-center gap-4`}>
            <div className={`w-10 h-10 ${s.badge} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
              {s.value}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{s.label}</p>
              <p className="text-xs text-slate-500">{s.value} task{s.value !== 1 ? 's' : ''}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
