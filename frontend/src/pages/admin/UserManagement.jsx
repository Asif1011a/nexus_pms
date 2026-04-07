import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const DEPARTMENTS = ['Management', 'Engineering', 'Design', 'Quality', 'Operations', 'Marketing', 'Finance', 'HR', 'General']

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

function UserForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', email: '', password: 'Nexus@123', role: 'user', jobTitle: '', department: 'Engineering', active: true })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Smith"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
          <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@nexus.io"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
          <input value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="Developer"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
          <select value={form.department} onChange={e => set('department', e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
          <select value={String(form.active)} onChange={e => set('active', e.target.value === 'true')}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      {!initial && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Initial Password</label>
          <input value={form.password} onChange={e => set('password', e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
          <p className="text-xs text-slate-400 mt-1">User can change this after logging in</p>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors">
          {initial ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  )
}

export default function UserManagement() {
  const { users, updateUser, deleteUser, addUserByAdmin, session } = useAuth()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [feedback, setFeedback] = useState('')

  const flash = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000) }

  const filtered = users.filter(u => {
    if (filter === 'admin' && u.role !== 'admin') return false
    if (filter === 'user' && u.role !== 'user') return false
    if (filter === 'inactive' && u.active) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleAdd = async (form) => {
    const result = await addUserByAdmin(form)
    if (!result.success) { flash('❌ ' + result.error); return }
    setShowAdd(false)
    flash('✅ User created successfully')
  }

  const handleEdit = async (form) => {
    await updateUser(editUser.id, form)
    setEditUser(null)
    flash('✅ User updated successfully')
  }

  const handleToggle = async (u) => {
    if (u.id === session?.id) { flash('❌ You cannot deactivate your own account'); return }
    await updateUser(u.id, { active: !u.active })
    flash(`✅ "${u.name}" ${u.active ? 'deactivated' : 'activated'}`)
  }

  const handleDelete = async (u) => {
    if (u.id === session?.id) { flash('❌ You cannot delete your own account'); return }
    if (window.confirm(`Delete "${u.name}"? This cannot be undone.`)) {
      await deleteUser(u.id)
      flash('✅ User deleted')
    }
  }

  const handleRoleToggle = async (u) => {
    if (u.id === session?.id) { flash('❌ You cannot change your own role'); return }
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    await updateUser(u.id, { role: newRole })
    flash(`✅ "${u.name}" is now ${newRole}`)
  }

  return (
    <div className="space-y-5">
      {/* Feedback */}
      {feedback && (
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium text-slate-800 shadow-sm flex items-center gap-2 animate-pulse">
          {feedback}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active', value: users.filter(u => u.active).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Inactive', value: users.filter(u => !u.active).length, color: 'text-slate-500', bg: 'bg-slate-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-slate-500 text-sm font-medium mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'admin', label: 'Admins' },
            { key: 'user', label: 'Users' },
            { key: 'inactive', label: 'Inactive' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === f.key ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 w-52" />
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-violet-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${u.color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{u.name}{u.id === session?.id && <span className="ml-2 text-xs text-violet-600 font-medium">(you)</span>}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{u.department}</p>
                    <p className="text-xs text-slate-400">{u.jobTitle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleRoleToggle(u)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold border transition-all hover:scale-105 ${u.role === 'admin' ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditUser(u)} title="Edit"
                        className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button onClick={() => handleToggle(u)} title={u.active ? 'Deactivate' : 'Activate'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${u.active ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-600' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'}`}>
                        {u.active
                          ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                        }
                      </button>
                      <button onClick={() => handleDelete(u)} title="Delete"
                        className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <p className="font-medium">No users found</p>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)}>
          <UserForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {editUser && (
        <Modal title="Edit User" onClose={() => setEditUser(null)}>
          <UserForm initial={editUser} onSave={handleEdit} onCancel={() => setEditUser(null)} />
        </Modal>
      )}
    </div>
  )
}
