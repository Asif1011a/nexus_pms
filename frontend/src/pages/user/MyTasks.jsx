import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../utils/api'

const COLUMNS = [
  { key: 'todo',        label: 'To Do',       color: 'bg-slate-400',   headerBg: 'bg-slate-50 border-slate-200' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500',    headerBg: 'bg-blue-50 border-blue-200' },
  { key: 'done',        label: 'Done',        color: 'bg-emerald-500', headerBg: 'bg-emerald-50 border-emerald-200' },
]
const priorityColors = {
  high:   'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low:    'bg-emerald-100 text-emerald-700 border-emerald-200',
}
const statusLabel = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' }

function MessageModal({ task, newStatus, onSend, onSkip }) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    setSending(true)
    await onSend(message.trim())
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-violet-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Notify Admin</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Task moved to <span className="font-semibold text-violet-600">{statusLabel[newStatus]}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Task info */}
        <div className="px-6 pt-4">
          <div className="bg-slate-50 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Task</p>
            <p className="text-sm font-semibold text-slate-800">{task.title}</p>
          </div>

          <label className="block text-sm font-medium text-slate-700 mb-2">
            Write a message to the admin
          </label>
          <textarea
            autoFocus
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={`e.g. "I've completed the UI part, waiting for API review..."`}
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
          <p className="text-xs text-slate-400 mt-1.5">{message.length}/300 characters</p>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            Skip
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {sending
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
              : <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                  Send to Admin
                </>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyTasks() {
  const { state, dispatch } = useApp()
  const { currentUser } = useAuth()
  const [dragId, setDragId] = useState(null)
  const dragOverCol = useRef(null)
  const [pendingMove, setPendingMove] = useState(null) // { taskId, newStatus, task }
  const [toast, setToast] = useState('')

  const myTasks = state.tasks.filter(t => t.assignee === currentUser?.id)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleDrop = (status) => {
    if (!dragId) return
    const task = myTasks.find(t => t.id === dragId)
    if (!task || task.status === status) { setDragId(null); return }
    // Move the task immediately in UI
    dispatch({ type: 'MOVE_TASK', payload: { id: dragId, status } })
    // Then prompt for message
    setPendingMove({ taskId: dragId, newStatus: status, task })
    setDragId(null)
  }

  const handleSendMessage = async (message) => {
    const { task, newStatus } = pendingMove
    try {
      await api.post('/notifications/send-to-admins', {
        message: `Moved "${task.title}" to ${statusLabel[newStatus]}. ${message}`,
        type: 'task',
      })
      showToast('✅ Message sent to admin!')
    } catch {
      showToast('⚠️ Task moved but message failed to send.')
    }
    setPendingMove(null)
  }

  const handleSkip = () => {
    setPendingMove(null)
  }

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl z-50 animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
          <p className="text-sm text-slate-500">{myTasks.length} tasks assigned to you</p>
        </div>
        <div className="flex gap-3 text-xs text-slate-500">
          {COLUMNS.map(col => (
            <span key={col.key} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <span className="font-medium">{myTasks.filter(t => t.status === col.key).length}</span>
              {col.label}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {COLUMNS.map(col => {
          const colTasks = myTasks.filter(t => t.status === col.key)
          return (
            <div
              key={col.key}
              onDragOver={e => { e.preventDefault(); dragOverCol.current = col.key }}
              onDrop={() => handleDrop(col.key)}
              className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 min-h-80"
            >
              <div className={`px-4 py-3 flex items-center gap-2 border-b ${col.headerBg}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-slate-800 text-sm">{col.label}</h3>
                <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ml-auto">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 text-slate-300 text-sm rounded-xl border-2 border-dashed border-slate-200">
                    Drop tasks here
                  </div>
                )}
                {colTasks.map(task => {
                  const project = state.projects.find(p => p.id === task.projectId)
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDragId(task.id)}
                      className="bg-white border border-slate-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-violet-200 transition-all duration-150"
                    >
                      <p className="text-sm font-semibold text-slate-800 leading-snug mb-2">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
                      )}
                      {project && (
                        <div className="flex items-center gap-1.5 mb-3">
                          <div className={`w-2 h-2 rounded-full ${project.color}`} />
                          <span className="text-xs text-slate-500 truncate">{project.name}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                            {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {myTasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-slate-600 font-semibold">No tasks assigned to you</p>
          <p className="text-slate-400 text-sm mt-1">Ask your project manager to assign tasks</p>
        </div>
      )}

      {/* Message Modal */}
      {pendingMove && (
        <MessageModal
          task={pendingMove.task}
          newStatus={pendingMove.newStatus}
          onSend={handleSendMessage}
          onSkip={handleSkip}
        />
      )}
    </div>
  )
}
