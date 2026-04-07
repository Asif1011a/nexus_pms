import { useEffect, useRef } from 'react'
import { useToast } from '../context/ToastContext'
import { useApp } from '../context/AppContext'

const REALTIME_EVENTS = [
  { type: 'activity', title: 'Marcus Williams', message: 'Pushed a commit to Backend API branch.' },
  { type: 'activity', title: 'Emily Davis', message: 'Updated the UI mockups for Mobile Banking App.' },
  { type: 'info',     title: 'Reminder',      message: 'Payment Gateway task is due in 2 days.' },
  { type: 'activity', title: 'Ryan Park',      message: 'Completed QA testing on Authentication Module.' },
  { type: 'warning',  title: 'Overdue Task',   message: 'Product Search & Filters is past its due date.' },
  { type: 'activity', title: 'Lisa Thompson',  message: 'Deployed new build to staging environment.' },
  { type: 'info',     title: 'Project Update', message: 'E-Commerce Platform progress reached 70%.' },
  { type: 'activity', title: 'Alex Johnson',   message: 'Added 3 new tasks to Healthcare Dashboard.' },
  { type: 'success',  title: 'Milestone Hit',  message: 'Marketing Website is 100% complete 🎉' },
  { type: 'activity', title: 'Sarah Chen',     message: 'Left a comment on Shopping Cart Feature.' },
]

let eventIndex = 0

export function useRealTimeNotifications() {
  const { addToast } = useToast()
  const { state } = useApp()
  const firedDue = useRef(false)

  useEffect(() => {
    // On mount: check for overdue or soon-due tasks and fire a warning
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

    // Simulate real-time team activity at random intervals (30s–90s)
    const fire = () => {
      const event = REALTIME_EVENTS[eventIndex % REALTIME_EVENTS.length]
      eventIndex++
      addToast({ ...event, duration: 6000 })

      // Schedule next event
      const delay = 30000 + Math.random() * 60000 // 30s–90s
      return setTimeout(fire, delay)
    }

    // First simulated event after 20 seconds
    const first = setTimeout(fire, 20000)

    return () => clearTimeout(first)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
