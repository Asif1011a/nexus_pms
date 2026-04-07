import { useState } from 'react'
import { useApp, MEMBER_COLORS } from '../context/AppContext'

const ROLES = ['Project Manager', 'Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer', 'Data Analyst', 'Product Manager']

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
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

function MemberForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', email: '', role: 'Frontend Developer', color: 'bg-blue-500', initials: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleNameChange = (val) => {
    const parts = val.trim().split(' ')
    const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : val.substring(0, 2).toUpperCase()
    setForm(f => ({ ...f, name: val, initials }))
  }
  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
        <input required value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="John Doe" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
        <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@company.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
        <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Avatar Color</label>
        <div className="flex gap-2 flex-wrap">
          {MEMBER_COLORS.map(c => (
            <button type="button" key={c} onClick={() => set('color', c)} className={`w-8 h-8 rounded-full ${c} border-2 transition-all ${form.color === c ? 'border-slate-900 scale-110' : 'border-transparent'}`} />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors">
          {initial ? 'Update Member' : 'Add Member'}
        </button>
      </div>
    </form>
  )
}

function MemberCard({ member, tasks, projects, onEdit, onDelete }) {
  const memberTasks = tasks.filter(t => t.assignee === member.id)
  const activeTasks = memberTasks.filter(t => t.status !== 'done').length
  const completedTasks = memberTasks.filter(t => t.status === 'done').length
  const memberProjects = projects.filter(p => p.members.includes(member.id))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${member.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md`}>
            {member.initials}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{member.name}</h3>
            <p className="text-slate-500 text-sm">{member.role}</p>
            <p className="text-slate-400 text-xs mt-0.5">{member.email}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button onClick={onDelete} className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Active', value: activeTasks, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Done', value: completedTasks, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Projects', value: memberProjects.length, color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Projects */}
      {memberProjects.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Projects</p>
          <div className="flex flex-wrap gap-1.5">
            {memberProjects.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-2.5 py-1">
                <div className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                <span className="text-xs text-slate-600 font-medium truncate max-w-24">{p.name}</span>
              </div>
            ))}
            {memberProjects.length > 3 && (
              <span className="text-xs text-slate-400 px-2 py-1">+{memberProjects.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400">Joined {member.joined}</span>
        <div className={`w-2 h-2 rounded-full bg-emerald-400`} title="Online" />
      </div>
    </div>
  )
}

export default function Team() {
  const { state, dispatch } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = state.members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (form) => {
    dispatch({ type: 'ADD_MEMBER', payload: form })
    setShowAdd(false)
  }
  const handleEdit = (form) => {
    dispatch({ type: 'UPDATE_MEMBER', payload: { ...editMember, ...form } })
    setEditMember(null)
  }
  const handleDelete = (id) => {
    if (window.confirm('Remove this team member?')) dispatch({ type: 'DELETE_MEMBER', payload: id })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 w-56" />
          </div>
          <span className="text-sm text-slate-500">{filtered.length} members</span>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-violet-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            tasks={state.tasks}
            projects={state.projects}
            onEdit={() => setEditMember(member)}
            onDelete={() => handleDelete(member.id)}
          />
        ))}
      </div>

      {showAdd && (
        <Modal title="Add Team Member" onClose={() => setShowAdd(false)}>
          <MemberForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {editMember && (
        <Modal title="Edit Member" onClose={() => setEditMember(null)}>
          <MemberForm initial={editMember} onSave={handleEdit} onCancel={() => setEditMember(null)} />
        </Modal>
      )}
    </div>
  )
}
