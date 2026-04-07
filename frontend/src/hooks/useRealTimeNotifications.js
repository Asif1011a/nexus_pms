import { useEffect, useRef } from 'react'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

export function useRealTimeNotifications() {
  const { addToast } = useToast()
  const { state } = useApp()
  const firedDue = useRef(false)

  useEffect(() => {
    // Only fire overdue alerts once per session
    if (!firedDue.current) {
      firedDue.current = true
      const today = new Date()
      const overdue = state.tasks.filter(t => {
        if (t.status === 'done' || !t.dueDate) return false
        return new Date(t.dueDate) < today
      })
      if (overdue.length > 0) {
        setTimeout(() => {
          addToast({
            type: 'warning',
            title: `${overdue.length} Overdue Task${overdue.length > 1 ? 's' : ''}`,
            message: `"${overdue[0].title}"${overdue.length > 1 ? ` and ${overdue.length - 1} more` : ''} past due date.`,
            duration: 8000,
          })
        }, 2000)
      }
    }
    
    // Hardcoded simulation removed. Notifications only trigger for real database events now.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tasks.length])
}
