import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { exportAllJSON, exportProjectsCSV, exportTasksCSV, exportMembersCSV } from '../utils/exportUtils'

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)} className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-slate-300'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

export default function Settings() {
  const { state } = useApp()
  const { currentUser, updateUser } = useAuth()
  const { addToast } = useToast()
  const user = currentUser
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Single profile form state — uses jobTitle (not role which is the auth role)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    jobTitle: user?.jobTitle || '',
    phone: user?.phone || '',
    department: user?.department || '',
  })

  // Re-sync form whenever the logged-in user identity changes
  useEffect(() => {
    if (!currentUser) return
    setProfile({
      name: currentUser.name || '',
      email: currentUser.email || '',
      jobTitle: currentUser.jobTitle || '',
      phone: currentUser.phone || '',
      department: currentUser.department || '',
    })
  }, [currentUser?.id])

  const [notifications, setNotifications] = useState({
    taskDue: true, projectUpdate: true, teamMention: true, weeklyReport: false, emailNotifs: true,
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [saved, setSaved] = useState('')
  const [pwError, setPwError] = useState('')

  const handleProfileSave = async (e) => {
    e.preventDefault()
    await updateUser(user.id, {
      name: profile.name,
      email: profile.email,
      jobTitle: profile.jobTitle,
      phone: profile.phone,
      department: profile.department,
    })
    addToast({ type: 'success', title: 'Profile Saved', message: 'Your profile details have been updated.' })
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    setPwError('')
    if (!passwords.current) { setPwError('Please enter your current password.'); return }
    if (passwords.new.length < 8) { setPwError('New password must be at least 8 characters.'); return }
    if (passwords.new !== passwords.confirm) { setPwError('New passwords do not match.'); return }
    const result = await updateUser(user.id, { password: passwords.new, currentPassword: passwords.current })
    if (result && !result.success) { setPwError(result.error || 'Failed to update password.'); return }
    setPasswords({ current: '', new: '', confirm: '' })
    addToast({ type: 'success', title: 'Password Changed', message: 'Your password has been updated successfully.' })
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-6">Profile Settings</h2>
        <form onSubmit={handleProfileSave} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className={`w-20 h-20 ${user.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
              {user.initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-sm text-slate-500">{user.role === 'admin' ? '👑 Administrator' : '👤 ' + (user.jobTitle || 'Member')}</p>
              <p className="text-xs text-slate-400 mt-1">Avatar auto-generated from your name</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
              <input value={profile.jobTitle} onChange={e => setProfile(p => ({ ...p, jobTitle: e.target.value }))} placeholder="e.g. Frontend Developer" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <input value={profile.department} onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Engineering" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
            <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-violet-100">
              Save Changes
            </button>
            {saved === 'profile' && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Profile saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-6">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { key: 'taskDue', label: 'Task Due Reminders', desc: 'Get notified before task deadlines' },
            { key: 'projectUpdate', label: 'Project Updates', desc: 'When projects are updated or status changes' },
            { key: 'teamMention', label: 'Team Mentions', desc: 'When someone mentions you in a comment' },
            { key: 'weeklyReport', label: 'Weekly Summary', desc: 'Weekly productivity digest via email' },
            { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive notifications via email' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle
                checked={notifications[item.key]}
                onChange={v => setNotifications(n => ({ ...n, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 text-lg mb-6">Security</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
            <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <input type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} placeholder="Min. 8 characters" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          {pwError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-rose-500 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-rose-700">{pwError}</p>
            </div>
          )}
          <div className="flex items-center gap-3">
            <button type="submit" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors">
              Update Password
            </button>
            {saved === 'password' && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Password updated!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
        <h2 className="font-bold text-rose-700 text-lg mb-2">Danger Zone</h2>
        <p className="text-slate-500 text-sm mb-5">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(m => !m)}
              className="flex items-center gap-2 px-5 py-2.5 border border-violet-300 text-violet-700 hover:bg-violet-50 text-sm font-medium rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Export All Data
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {showExportMenu && (
              <div className="absolute left-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden w-56 py-1">
                {[
                  { label: '📦 Full Backup (JSON)', fn: () => exportAllJSON(state) },
                  { label: '📊 Projects (CSV)', fn: () => exportProjectsCSV(state.projects) },
                  { label: '✅ Tasks (CSV)', fn: () => exportTasksCSV(state.tasks, state.projects, state.members) },
                  { label: '👥 Team Members (CSV)', fn: () => exportMembersCSV(state.members) },
                ].map(a => (
                  <button key={a.label} onClick={() => { a.fn(); setShowExportMenu(false) }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors" onClick={() => alert('Account deletion disabled in demo.')}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
