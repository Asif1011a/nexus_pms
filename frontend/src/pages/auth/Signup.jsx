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
    <div className="min-h-screen bg-white flex items-center justify-center p-8" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div className="bg-white rounded-[32px] shadow-2xl shadow-violet-100 p-10 max-w-md w-full text-center border border-slate-50">
        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-emerald-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3" style={{ letterSpacing: '-0.03em' }}>Account Created! 🎉</h2>
        <p className="text-slate-500 text-sm mb-2">Welcome to the Nexus workspace, <span className="font-bold text-violet-600">{form.name}!</span></p>
        <p className="text-slate-400 text-xs leading-relaxed mb-8 px-4">Your account is ready. You can now access your projects and collaborate with your team.</p>
        <button 
          onClick={() => onNavigate('login')} 
          className="w-full text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          Sign In Now →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-white" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden" 
        style={{ background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>
        
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6d28d9, transparent)' }} />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200"
            style={{ 
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <span className="text-violet-900 font-bold text-xl tracking-tight leading-none">Nexus</span>
            <span className="block text-[10px] text-violet-400 font-semibold tracking-widest uppercase leading-none mt-0.5">Workspace</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-violet-700 text-[10px] font-bold uppercase tracking-wider">Start your journey</span>
          </div>
          <h1 className="text-4xl font-extrabold text-violet-950 leading-tight mb-5" style={{ letterSpacing: '-0.03em' }}>
            Join the Next Generation of <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>Productivity.</span>
          </h1>
          <p className="text-violet-700/70 text-sm leading-relaxed max-w-sm mb-10">
            Create your Nexus workspace today and experience a faster, clearer way to manage your team and projects.
          </p>

          {/* Core Features */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { t: 'High Performance', d: 'Built with speed in mind for smooth interactions.' },
              { t: 'Beautiful Design', d: 'Modern UI that stays out of your way.' }
            ].map(f => (
              <div key={f.t} className="bg-white/60 backdrop-blur-sm border border-violet-100 rounded-2xl p-4 flex gap-4">
                <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-violet-900 font-bold text-sm">{f.t}</p>
                  <p className="text-violet-600/60 text-xs mt-0.5">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-violet-400 text-[11px] font-medium px-2">
          <span>© 2025 Nexus</span>
          <span>Terms & Privacy</span>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="mb-10 lg:text-left text-center">
             {/* Mobile logo */}
            <div className="flex items-center gap-2 justify-center mb-6 lg:hidden">
              <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900">Nexus</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1.5" style={{ letterSpacing: '-0.03em' }}>Create account 🚀</h2>
            <p className="text-slate-400 text-sm underline-offset-4 pointer-events-none">Join Nexus workspace today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name <span className="text-rose-400">*</span></label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Enter your full name" 
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-800 ${errors.name ? 'border-rose-400' : 'border-slate-200'}`} />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Work Email <span className="text-rose-400">*</span></label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" 
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-800 ${errors.email ? 'border-rose-400' : 'border-slate-200'}`} />
              {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Job + Dept Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Title</label>
                <input value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="Developer" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Department</label>
                <input value={form.department} onChange={e => set('department', e.target.value)} placeholder="Product" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-800" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Password <span className="text-rose-400">*</span></label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" 
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-800 ${errors.password ? 'border-rose-400' : 'border-slate-200'}`} />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors">
                  {showPw 
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
                  }
                </button>
              </div>
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-slate-100'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strength: <span className="text-slate-800">{strengthLabel}</span></p>
                </div>
              )}
              {errors.password && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm Password <span className="text-rose-400">*</span></label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat password" 
                className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-slate-800 ${errors.confirm ? 'border-rose-400' : 'border-slate-200'}`} />
              {errors.confirm && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-100 mt-2"
              style={{ background: loading ? '#a78bfa' : 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
              {loading
                ? <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Setting up...</>
                : 'Create Account →'
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="text-violet-600 hover:text-violet-700 font-bold transition-colors">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
