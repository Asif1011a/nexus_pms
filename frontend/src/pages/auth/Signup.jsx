import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Signup({ onNavigate }) {
  const { signup } = useAuth()
  const [step, setStep] = useState(1) // 1: details, 2: success
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', jobTitle: '', department: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim() || form.name.trim().split(' ').length < 2) e.name = 'Please enter your full name (first & last).'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(form.password)) e.password = 'Password needs at least one uppercase letter.'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await signup(form)
    setLoading(false)
    if (!result.success) { setErrors({ email: result.error }); return }
    setStep(2)
  }

  const strengthScore = () => {
    let s = 0
    if (form.password.length >= 8) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[0-9]/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s
  }
  const strength = strengthScore()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength]

  if (step === 2) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created! 🎉</h2>
        <p className="text-slate-500 text-sm mb-2">Welcome to Nexus, <span className="font-semibold text-slate-800">{form.name}!</span></p>
        <p className="text-slate-400 text-sm mb-8">Your account has been created with <span className="font-medium text-violet-600">User</span> role. An admin can upgrade your access if needed.</p>
        <button onClick={() => onNavigate('login')} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">
          Sign In Now →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">Nexus</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm">Join your team on Nexus</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Smith"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 ${errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`} />
              {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 ${errors.email ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`} />
              {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Job + Dept */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                <input value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="Developer"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                <input value={form.department} onChange={e => set('department', e.target.value)} placeholder="Engineering"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters"
                  className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 ${errors.password ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`} />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Strength: <span className="font-semibold">{strengthLabel}</span></p>
                </div>
              )}
              {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password *</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat your password"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 ${errors.confirm ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`} />
              {errors.confirm && <p className="text-xs text-rose-600 mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-100">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</>
                : 'Create Account'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="text-violet-600 hover:text-violet-700 font-semibold">Sign in</button>
        </p>
      </div>
    </div>
  )
}
