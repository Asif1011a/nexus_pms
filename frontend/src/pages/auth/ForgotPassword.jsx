import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPassword({ onNavigate }) {
  const { forgotPassword, verifyOTP, resetPassword } = useAuth()
  const [step, setStep] = useState(1) // 1=email, 2=otp, 3=newpw, 4=done
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [pw, setPw] = useState({ new: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleEmail = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await forgotPassword(email)
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    setDemoOtp(result.otp) // show OTP on screen for demo
    setStep(2)
  }

  const handleOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await verifyOTP(email, otp)
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    setStep(3)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (pw.new.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (pw.new !== pw.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const result = await resetPassword(email, otp, pw.new)
    setLoading(false)
    if (!result.success) { setError(result.error); return }
    setStep(4)
  }

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  )

  const steps = ['Email', 'Verify OTP', 'New Password', 'Done']

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="font-bold text-xl text-slate-900">Nexus</span>
        </div>

        {/* Progress stepper */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex flex-col items-center ${i < steps.length - 1 ? 'mr-0' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? 'bg-emerald-500 text-white' :
                  step === i + 1 ? 'bg-violet-600 text-white' :
                  'bg-slate-200 text-slate-500'
                }`}>
                  {step > i + 1
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    : i + 1
                  }
                </div>
                <span className={`text-xs mt-1 font-medium ${step === i + 1 ? 'text-violet-600' : 'text-slate-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 mb-5 rounded-full transition-all ${step > i + 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          {error && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-rose-500 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmail} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-violet-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Forgot Password?</h2>
                <p className="text-slate-500 text-sm mt-1">Enter your email and we'll send an OTP</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@nexus.io"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</> : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleOTP} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-amber-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Enter OTP</h2>
                <p className="text-slate-500 text-sm mt-1">Sent to <span className="font-semibold">{email}</span></p>
              </div>

              {/* Demo OTP banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-700 font-medium uppercase tracking-wide mb-1">Demo Mode — Your OTP</p>
                <p className="text-3xl font-bold text-amber-800 tracking-[0.3em]">{demoOtp}</p>
                <p className="text-xs text-amber-600 mt-1">In production, this would be emailed to you</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">6-Digit OTP</label>
                <input required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000" maxLength={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Verifying...</> : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => { setStep(1); setError('') }} className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors">← Back to email</button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-violet-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Set New Password</h2>
                <p className="text-slate-500 text-sm mt-1">Create a strong new password</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={pw.new} onChange={e => setPw(p => ({ ...p, new: e.target.value }))} placeholder="Min. 8 characters"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><EyeIcon /></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                <input type="password" required value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Resetting...</> : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
              <p className="text-slate-500 text-sm mb-8">Your password has been updated successfully. You can now sign in with your new password.</p>
              <button onClick={() => onNavigate('login')} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors">
                Back to Sign In →
              </button>
            </div>
          )}
        </div>

        {step < 4 && (
          <p className="text-center text-sm text-slate-500 mt-5">
            Remembered your password?{' '}
            <button onClick={() => onNavigate('login')} className="text-violet-600 hover:text-violet-700 font-semibold">Sign in</button>
          </p>
        )}
      </div>
    </div>
  )
}
