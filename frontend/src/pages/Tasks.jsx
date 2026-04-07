import { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'

const PRIORITY_OPTIONS = ['high', 'medium', 'low']
const priorityColors = {
  high: 'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}
const COLUMNS = [
  { key: 'todo', label: 'To Do', color: 'bg-slate-400', headerBg: 'bg-slate-50 border-slate-200' },
  { key: 'in-progress', label: 'In Progress', color: 'bg-blue-500', headerBg: 'bg-blue-50 border-blue-200' },
  { key: 'done', label: 'Done', color: 'bg-emerald-500', headerBg: 'bg-emerald-50 border-emerald-200' },
]

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function TaskForm({ initial, projectId, members, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', status: 'todo', priority: 'medium',
    assignee: '', dueDate: '', labels: [], projectId: projectId || ''
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = (e) => { e.preventDefault(); onSave(form) }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Task Title *</label>
        <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter task title" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the task..." rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
          <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Assignee</label>
          <select value={form.assignee} onChange={e => set('assignee', Number(e.target.value))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800">
            <option value="">Unassigned</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Due Date</label>
        <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-800" />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors">
          {initial ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}

function TaskDetail({ task, project, assignee, onEdit, onDelete, onClose }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${priorityColors[task.priority]}`}>{task.priority} priority</span>
        {task.labels?.map(l => (
          <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 font-medium">{l}</span>
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{task.description || 'No description provided.'}</p>
      <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 text-sm">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Project</p>
          <p className="text-slate-800 font-medium">{project?.name || '—'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Due Date</p>
          <p className="text-slate-800 font-medium">{task.dueDate || '—'}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Assignee</p>
          {assignee ? (
            <div className="flex items-center gap-2">
              <div className={`w-5 h-5 ${assignee.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{assignee.initials[0]}</div>
              <span className="text-slate-800 font-medium text-xs">{assignee.name}</span>
            </div>
          ) : <p className="text-slate-400">Unassigned</p>}
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Status</p>
          <p className="text-slate-800 font-medium capitalize">{task.status.replace('-', ' ')}</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button onClick={onDelete} className="px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium">Delete</button>
        <button onClick={onEdit} className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors font-medium">Edit Task</button>
      </div>
    </div>
  )
}

function KanbanCard({ task, members, projects, onEdit, onDelete, onDragStart }) {
  const assignee = members.find(m => m.id === task.assignee)
  const project = projects.find(p => p.id === task.projectId)
  const [showDetail, setShowDetail] = useState(false)

  return (
    <>
      <div
        draggable
        onDragStart={() => onDragStart(task.id)}
        onClick={() => setShowDetail(true)}
        className="bg-white border border-slate-200 rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-violet-200 transition-all duration-150 group"
      >
        <div className="flex items-start justify-between mb-2 gap-2">
          <p className="text-sm font-semibold text-slate-800 leading-snug flex-1">{task.title}</p>
          <button onClick={e => { e.stopPropagation(); onEdit() }} className="text-slate-300 hover:text-violet-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
            </svg>
          </button>
        </div>
        {task.description && <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">{task.description}</p>}
        {task.labels?.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {task.labels.map(l => (
              <span key={l} className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">{l}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${priorityColors[task.priority]}`}>{task.priority}</span>
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                {task.dueDate}
              </span>
            )}
            {assignee && (
              <div title={assignee.name} className={`w-6 h-6 ${assignee.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                {assignee.initials[0]}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <Modal title={task.title} onClose={() => setShowDetail(false)}>
          <TaskDetail
            task={task}
            project={project}
            assignee={assignee}
            onEdit={() => { setShowDetail(false); onEdit() }}
            onDelete={() => { setShowDetail(false); onDelete() }}
            onClose={() => setShowDetail(false)}
          />
        </Modal>
      )}
    </>
  )
}

export default function Tasks() {
  const { state, dispatch } = useApp()
  const [selectedProject, setSelectedProject] = useState('all')
  const [dragId, setDragId] = useState(null)
  const [addModal, setAddModal] = useState(null) // column status
  const [editTask, setEditTask] = useState(null)
  const dragOverCol = useRef(null)

  const filtered = selectedProject === 'all'
    ? state.tasks
    : state.tasks.filter(t => t.projectId === Number(selectedProject))

  const handleDrop = (status) => {
    if (dragId) {
      dispatch({ type: 'MOVE_TASK', payload: { id: dragId, status } })
      setDragId(null)
    }
  }

  const handleAddTask = (form) => {
    dispatch({ type: 'ADD_TASK', payload: { ...form, status: addModal, projectId: Number(form.projectId) || null, labels: [] } })
    setAddModal(null)
  }

  const handleEditTask = (form) => {
    dispatch({ type: 'UPDATE_TASK', payload: { ...editTask, ...form, projectId: Number(form.projectId) || editTask.projectId } })
    setEditTask(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) dispatch({ type: 'DELETE_TASK', payload: id })
  }

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Projects</option>
            {state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="flex gap-2 text-xs text-slate-500">
            {COLUMNS.map(col => (
              <span key={col.key} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                {filtered.filter(t => t.status === col.key).length} {col.label}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => setAddModal('todo')} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-violet-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">
        {COLUMNS.map(col => {
          const colTasks = filtered.filter(t => t.status === col.key)
          return (
            <div
              key={col.key}
              onDragOver={e => { e.preventDefault(); dragOverCol.current = col.key }}
              onDrop={() => handleDrop(col.key)}
              className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 min-h-96"
            >
              {/* Column Header */}
              <div className={`px-4 py-3 flex items-center justify-between border-b ${col.headerBg}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h3 className="font-semibold text-slate-800 text-sm">{col.label}</h3>
                  <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {colTasks.length}
                  </span>
                </div>
                <button onClick={() => setAddModal(col.key)} className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 hover:border-violet-200 flex items-center justify-center transition-colors text-slate-400 hover:text-violet-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 text-slate-300 text-sm rounded-xl border-2 border-dashed border-slate-200">
                    Drop tasks here
                  </div>
                )}
                {colTasks.map(task => (
                  <KanbanCard
                    key={task.id}
                    task={task}
                    members={state.members}
                    projects={state.projects}
                    onDragStart={setDragId}
                    onEdit={() => setEditTask(task)}
                    onDelete={() => handleDelete(task.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      {addModal && (
        <Modal title={`Add task to ${COLUMNS.find(c => c.key === addModal)?.label}`} onClose={() => setAddModal(null)}>
          <TaskForm
            projectId={selectedProject !== 'all' ? selectedProject : ''}
            members={state.members}
            onSave={handleAddTask}
            onCancel={() => setAddModal(null)}
          />
        </Modal>
      )}
      {editTask && (
        <Modal title="Edit Task" onClose={() => setEditTask(null)}>
          <TaskForm
            initial={editTask}
            projectId={editTask.projectId}
            members={state.members}
            onSave={handleEditTask}
            onCancel={() => setEditTask(null)}
          />
        </Modal>
      )}
    </div>
  )
}
