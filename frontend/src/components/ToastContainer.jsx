import { useState, useRef, useEffect } from 'react'
import { useToast } from '../context/ToastContext'

const ICONS = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
  activity: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
}

const STYLES = {
  success: { icon: 'bg-emerald-500 text-white', bar: 'bg-emerald-400', border: 'border-emerald-100' },
  error:   { icon: 'bg-rose-500 text-white',    bar: 'bg-rose-400',    border: 'border-rose-100' },
  warning: { icon: 'bg-amber-500 text-white',   bar: 'bg-amber-400',   border: 'border-amber-100' },
  info:    { icon: 'bg-blue-500 text-white',     bar: 'bg-blue-400',    border: 'border-blue-100' },
  activity:{ icon: 'bg-violet-500 text-white',  bar: 'bg-violet-400',  border: 'border-violet-100' },
}

function Toast({ toast, onRemove, onPause, onResume }) {
  const [progress, setProgress] = useState(100)
  const startRef = useRef(Date.now())
  const remaining = useRef(toast.duration)
  const pausedAt = useRef(null)
  const rafRef = useRef(null)
  const style = STYLES[toast.type] || STYLES.info

  useEffect(() => {
    if (toast.duration <= 0) return
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.max(0, 100 - (elapsed / toast.duration) * 100)
      setProgress(pct)
      if (pct > 0) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [toast.duration])

  const handleMouseEnter = () => {
    cancelAnimationFrame(rafRef.current)
    pausedAt.current = Date.now()
    remaining.current -= (Date.now() - startRef.current)
    onPause(toast.id)
  }

  const handleMouseLeave = () => {
    startRef.current = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.max(0, progress - (elapsed / remaining.current) * progress)
      setProgress(pct)
      if (pct > 0) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    onResume(toast.id, remaining.current)
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex gap-3 items-start bg-white border ${style.border} rounded-2xl shadow-xl p-4 min-w-[300px] max-w-[380px] overflow-hidden cursor-default select-none transition-all duration-300 ${
        toast.leaving
          ? 'opacity-0 translate-x-[110%] scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      }`}
      style={{ boxShadow: '0 8px 32px -4px rgba(0,0,0,0.14), 0 2px 8px -2px rgba(0,0,0,0.08)' }}
    >
      {/* Type icon */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${style.icon}`}>
        {ICONS[toast.type] || ICONS.info}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        {toast.title && (
          <p className="text-sm font-bold text-slate-800 leading-tight">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => onRemove(toast.id)}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Progress bar */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 rounded-b-2xl overflow-hidden">
          <div
            className={`h-full ${style.bar} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function ToastContainer() {
  const { toasts, removeToast, pauseToast, resumeToast } = useToast()

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{ alignItems: 'flex-end' }}
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            toast={toast}
            onRemove={removeToast}
            onPause={pauseToast}
            onResume={resumeToast}
          />
        </div>
      ))}
    </div>
  )
}
