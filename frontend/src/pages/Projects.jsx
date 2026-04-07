import { useState } from 'react'
import { useApp, MEMBER_COLORS } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const STATUS_OPTIONS = ['in-progress', 'planning', 'completed', 'on-hold']
const PRIORITY_OPTIONS = ['high', 'medium', 'low']
const CATEGORY_OPTIONS = ['Web Development', 'Mobile', 'Analytics', 'AI/ML', 'Internal Tools', 'Design', 'Other']

const statusColors = {
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'planning': 'bg-amber-100 text-amber-700 border-amber-200',
  'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'on-hold': 'bg-slate-100 text-slate-600 border-slate-200',
}
const priorityColors = {
  high: 'bg-rose-100 text-rose-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-emerald-100 text-emerald-700',
}

const emptyForm = { name: '', description: '', status: 'planning', priority: 'medium', color: 'bg-violet-500', dueDate: '', startDate: '', category: 'Web Development', members: [] }

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ProjectForm({ initial, onSave, onCancel, allUsers }) {
  const [form, setForm] = useState(initial || emptyForm)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  const toggleMember = (userId) => {
    const current = form.members || []
    const updated = current.includes(userId)
      ? current.filter(id => id !== userId)
      : [...current, userId]
    set('members', updated)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Name *</label>
        <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Enter project name" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the project..." rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
          <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Date</label>
          <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
        <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
        <div className="flex gap-2 flex-wrap">
          {MEMBER_COLORS.map(c => (
            <button type="button" key={c} onClick={() => set('color', c)} className={`w-7 h-7 rounded-full ${c} border-2 transition-all ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
          ))}
        </div>
      </div>

      {/* Progress slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-slate-700">Completion Progress</label>
          <span className={`text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-lg ${
            (form.progress || 0) === 100 ? 'bg-emerald-100 text-emerald-700' :
            (form.progress || 0) >= 50 ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {form.progress ?? 0}%
          </span>
        </div>
        <input
          type="range" min={0} max={100} step={5}
          value={form.progress ?? 0}
          onChange={e => set('progress', Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-600"
          style={{ background: `linear-gradient(to right, #7c3aed ${form.progress ?? 0}%, #e2e8f0 ${form.progress ?? 0}%)` }}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1 px-0.5">
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
          <div className={`${form.color} h-1.5 rounded-full transition-all duration-300`} style={{ width: `${form.progress ?? 0}%` }} />
        </div>
      </div>

      {/* ── Team Member Picker ─────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Assign Members
          <span className="ml-2 text-xs text-slate-400 font-normal">{(form.members || []).length} selected</span>
        </label>
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[52px]">
          {allUsers.length === 0 && <p className="text-xs text-slate-400 self-center">No users available</p>}
          {allUsers.map(u => {
            const selected = (form.members || []).includes(u.id)
            return (
              <button
                type="button"
                key={u.id}
                onClick={() => toggleMember(u.id)}
                title={`${u.name} — ${u.jobTitle || u.role}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selected
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                  selected ? 'bg-white/20' : u.color
                }`}>
                  {u.initials?.substring(0, 2) || '??'}
                </div>
                {u.name}
                {selected && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 ml-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-slate-400 mt-1.5">Click a member to assign / unassign them to this project.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors">
          {initial ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  )
}

/** Quick standalone member manager — used from the card ⋮ menu */
function MemberManager({ project, allUsers, onSave, onCancel }) {
  const [selected, setSelected] = useState(project.members || [])
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Select team members to assign to <span className="font-semibold text-slate-800">{project.name}</span>.</p>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {allUsers.map(u => {
          const on = selected.includes(u.id)
          return (
            <button key={u.id} type="button" onClick={() => toggle(u.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${on ? 'bg-violet-50 border-violet-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <div className={`w-9 h-9 ${u.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {(u.initials || '??').substring(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${on ? 'text-violet-800' : 'text-slate-800'}`}>{u.name}</p>
                <p className="text-xs text-slate-400 truncate">{u.jobTitle || u.role} · {u.department}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${on ? 'bg-violet-600 border-violet-600' : 'border-slate-300'}`}>
                {on && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
              </div>
            </button>
          )
        })}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-slate-400">{selected.length} member{selected.length !== 1 ? 's' : ''} selected</span>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
          <button onClick={() => onSave(selected)} className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors">Save Members</button>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, members, allUsers, onEdit, onDelete, onViewTasks, onManageMembers }) {
  const projectMembers = allUsers.filter(u => (project.members || []).includes(u.id))
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className={`h-1.5 ${project.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 truncate">{project.name}</h3>
            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{project.description}</p>
          </div>
          <div className="relative flex-shrink-0">
            <button onClick={() => setShowMenu(!showMenu)} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors opacity-0 group-hover:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-slate-100 rounded-xl shadow-lg z-20 overflow-hidden w-44">
                <button onClick={() => { onViewTasks(); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">View Tasks</button>
                <button onClick={() => { onManageMembers(); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-50 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  Manage Members
                </button>
                <button onClick={() => { onEdit(); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">Edit Project</button>
                <button onClick={() => { onDelete(); setShowMenu(false) }} className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusColors[project.status]}`}>
            {project.status.replace('-', ' ')}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityColors[project.priority]}`}>
            {project.priority}
          </span>
          <span className="text-xs text-slate-400 ml-auto">{project.category}</span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-slate-700">{project.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div className={`${project.color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {projectMembers.length === 0 && (
              <span className="text-xs text-slate-400 italic">No members</span>
            )}
            {projectMembers.slice(0, 4).map(m => (
              <div key={m.id} title={m.name} className={`w-7 h-7 ${m.color} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                {(m.initials || '??').substring(0, 2)}
              </div>
            ))}
            {projectMembers.length > 4 && (
              <div className="w-7 h-7 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-slate-600 text-xs font-bold">
                +{projectMembers.length - 4}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            <span>{project.dueDate || 'No deadline'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const { state, dispatch, setCurrentPage } = useApp()
  const { users } = useAuth()
  const { addToast } = useToast()
  const [filter, setFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [manageProject, setManageProject] = useState(null)

  const allUsers = users.filter(u => u.active)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'in-progress', label: 'Active' },
    { key: 'planning', label: 'Planning' },
    { key: 'completed', label: 'Completed' },
    { key: 'on-hold', label: 'On Hold' },
  ]

  const filtered = filter === 'all' ? state.projects : state.projects.filter(p => p.status === filter)

  const handleAdd = (form) => {
    dispatch({ type: 'ADD_PROJECT', payload: { ...form, members: form.members || [] } })
    setShowAdd(false)
    addToast({ type: 'success', title: 'Project Created', message: `"${form.name}" added to workspace.` })
  }
  const handleEdit = (form) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { ...editProject, ...form } })
    setEditProject(null)
    addToast({ type: 'success', title: 'Project Updated', message: `"${form.name}" saved successfully.` })
  }
  const handleDelete = (id) => {
    const proj = state.projects.find(p => p.id === id)
    if (window.confirm('Delete this project and all its tasks?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: id })
      addToast({ type: 'error', title: 'Project Deleted', message: `"${proj?.name}" and its tasks removed.` })
    }
  }
  const handleMembersSave = (members) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { ...manageProject, members } })
    setManageProject(null)
    addToast({ type: 'success', title: 'Members Updated', message: `${members.length} member${members.length !== 1 ? 's' : ''} assigned to "${manageProject.name}".` })
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === f.key ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
              {f.label}
              <span className={`ml-1.5 text-xs ${filter === f.key ? 'text-violet-200' : 'text-slate-400'}`}>
                {f.key === 'all' ? state.projects.length : state.projects.filter(p => p.status === f.key).length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-violet-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25m19.5 0v.243a2.25 2.25 0 0 1-2.182 2.247H4.432A2.25 2.25 0 0 1 2.25 14.493V14.25" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No projects found</p>
          <p className="text-slate-400 text-sm mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              members={state.members}
              allUsers={allUsers}
              onEdit={() => setEditProject(project)}
              onDelete={() => handleDelete(project.id)}
              onViewTasks={() => setCurrentPage('tasks')}
              onManageMembers={() => setManageProject(project)}
            />
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAdd && (
        <Modal title="New Project" onClose={() => setShowAdd(false)}>
          <ProjectForm onSave={handleAdd} onCancel={() => setShowAdd(false)} allUsers={allUsers} />
        </Modal>
      )}

      {/* Edit Project Modal */}
      {editProject && (
        <Modal title="Edit Project" onClose={() => setEditProject(null)}>
          <ProjectForm initial={editProject} onSave={handleEdit} onCancel={() => setEditProject(null)} allUsers={allUsers} />
        </Modal>
      )}

      {/* Quick Member Manager Modal */}
      {manageProject && (
        <Modal title={`Members — ${manageProject.name}`} onClose={() => setManageProject(null)}>
          <MemberManager
            project={manageProject}
            allUsers={allUsers}
            onSave={handleMembersSave}
            onCancel={() => setManageProject(null)}
          />
        </Modal>
      )}
    </div>
  )
}
