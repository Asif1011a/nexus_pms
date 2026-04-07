import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const removeToast = useCallback((id) => {
    // Mark as leaving first (for exit animation)
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t))
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350)
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, duration, leaving: false }])
    if (duration > 0) {
      timers.current[id] = setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [removeToast])

  const pauseToast = useCallback((id) => {
    clearTimeout(timers.current[id])
  }, [])

  const resumeToast = useCallback((id, remaining) => {
    timers.current[id] = setTimeout(() => removeToast(id), remaining)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, pauseToast, resumeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
