import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Login({ onNavigate }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (!result.success) setError(result.error)
  }

  const fillDemo = (role) => {
    if (role === 'admin') setForm(f => ({ ...f, email: 'admin@nexus.io', password: 'Admin@123' }))
    else setForm(f => ({ ...f, email: 'jaswan@nexus.io', password: 'User@123' }))
  }

  return (
    <div className="min-h-screen flex bg-white" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-[48%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6d28d9, transparent)' }} />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
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

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-100 border border-violet-200 rounded-full px-4 py-1.5">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            <span className="text-violet-700 text-xs font-semibold">Project Management Reimagined</span>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-violet-950 leading-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
              Manage Work<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                Like Never Before
              </span>
            </h1>
            <p className="text-violet-700/70 text-sm leading-relaxed max-w-sm">
              Nexus brings your projects, tasks, and team into a single powerful workspace — built for speed and clarity.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              'Real-time team collaboration',
              'Visual Kanban task boards',
              'Advanced analytics & reports',
              'Role-based access control',
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-violet-900 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[{ val: '99.9%', label: 'Uptime' }, { val: '10k+', label: 'Projects' }, { val: '50k+', label: 'Teams' }].map(s => (
              <div key={s.label} className="bg-white/60 backdrop-blur border border-violet-100 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-violet-900 font-extrabold text-xl" style={{ letterSpacing: '-0.03em' }}>{s.val}</p>
                <p className="text-violet-500 text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/70 backdrop-blur border border-violet-100 rounded-2xl p-5 shadow-sm">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <p className="text-slate-600 text-sm italic leading-relaxed">"Nexus transformed how our team works. Project delivery is 40% faster and our team loves it."</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">AJ</div>
            <div>
              <p className="text-slate-800 text-sm font-semibold">Alex Johnson</p>
              <p className="text-slate-400 text-xs">Project Manager, Nexus</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-10 lg:hidden">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">Nexus</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1.5" style={{ letterSpacing: '-0.03em' }}>Welcome back 👋</h2>
            <p className="text-slate-400 text-sm">Sign in to your Nexus workspace to continue.</p>
          </div>

          {/* Demo quick-access */}
          <div className="grid grid-cols-2 gap-2 mb-7">
            <button onClick={() => fillDemo('admin')}
              className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl px-3 py-2.5 transition-all group">
              <div className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
              <div className="text-left">
                <p className="text-xs font-bold text-violet-700">Admin Demo</p>
                <p className="text-[10px] text-violet-400">admin@nexus.io</p>
              </div>
            </button>
            <button onClick={() => fillDemo('user')}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-3 py-2.5 transition-all group">
              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">U</div>
              <div className="text-left">
                <p className="text-xs font-bold text-blue-700">User Demo</p>
                <p className="text-[10px] text-blue-400">jaswan@nexus.io</p>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-rose-500 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-rose-600 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@nexus.io"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400 focus:bg-white transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button type="button" onClick={() => onNavigate('forgot')}
                  className="text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400 focus:bg-white transition-all"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500 transition-colors">
                  {showPassword
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input id="remember" type="checkbox" checked={form.rememberMe} onChange={e => set('rememberMe', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 accent-violet-600 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-500 cursor-pointer select-none">Keep me signed in</label>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? '#a78bfa' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(124, 58, 237, 0.35)',
              }}
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-violet-600 hover:text-violet-700 font-bold transition-colors">
              Create one free
            </button>
          </p>

          {/* Footer */}
          <p className="text-center text-[11px] text-slate-300 mt-8">
            © 2025 Nexus Workspace · All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}
