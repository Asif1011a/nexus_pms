import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-violet-500/20 rounded-full flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 text-violet-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <span className="text-slate-300 text-sm">{text}</span>
    </div>
  )
}

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
    else setForm(f => ({ ...f, email: 'sarah@nexus.io', password: 'User@123' }))
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 flex-col justify-between p-14 relative overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-700/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-700/15 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">Nexus</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            <span className="text-violet-400 text-xs font-medium">Project Management Reimagined</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Manage Work<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              Like Never Before
            </span>
          </h1>
          <p className="text-slate-400 text-base mb-10 leading-relaxed max-w-md">
            Nexus brings your projects, tasks, and team into a single powerful workspace — built for speed and clarity.
          </p>
          <div className="space-y-3 mb-12">
            {['Real-time team collaboration', 'Visual Kanban task boards', 'Advanced analytics & reports', 'Role-based access control'].map(f => (
              <FeatureItem key={f} text={f} />
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[{ val: '99.9%', label: 'Uptime' }, { val: '10k+', label: 'Projects' }, { val: '50k+', label: 'Teams' }].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-white font-bold text-xl">{s.val}</p>
                <p className="text-slate-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-400">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <p className="text-slate-300 text-sm italic leading-relaxed">"Nexus transformed how our team works. Project delivery is 40% faster and our team loves it."</p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AJ</div>
            <div>
              <p className="text-white text-sm font-semibold">Alex Johnson</p>
              <p className="text-slate-500 text-xs">Project Manager, Nexus</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Login Form ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">Nexus</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your Nexus account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-rose-500 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p className="text-sm text-rose-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@nexus.io"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button type="button" onClick={() => onNavigate('forgot')} className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input id="remember" type="checkbox" checked={form.rememberMe} onChange={e => set('rememberMe', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">Keep me signed in</label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
            >
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
              Sign up for free
            </button>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => fillDemo('admin')} className="flex items-center gap-2 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl px-3 py-2.5 text-xs font-medium text-violet-700 transition-colors">
                <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs">A</div>
                Admin Demo
              </button>
              <button onClick={() => fillDemo('user')} className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-3 py-2.5 text-xs font-medium text-blue-700 transition-colors">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">U</div>
                User Demo
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">Click to auto-fill credentials</p>
          </div>
        </div>
      </div>
    </div>
  )
}
