/**
 * exportUtils.js
 * Utilities for exporting app data as CSV, JSON, or triggering browser print.
 */

/** Trigger a file download in the browser — reliable cross-browser version */
function triggerDownload(content, filename, mimeType, addBOM = false) {
  // Prepend UTF-8 BOM for CSV so Excel/Windows opens it correctly
  const payload = addBOM ? '\uFEFF' + content : content
  const blob = new Blob([payload], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.setAttribute('download', filename) // setAttribute is more reliable than .download
  document.body.appendChild(a)
  a.click()

  // Small delay before cleanup so the browser has time to start the download
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 200)
}

/** Convert an array of objects to a CSV string */
function toCSV(rows, columns) {
  const header = columns.map(c => `"${c.label}"`).join(',')
  const body = rows.map(row =>
    columns.map(c => {
      const val = c.get ? c.get(row) : row[c.key]
      return `"${String(val ?? '').replace(/"/g, '""')}"`
    }).join(',')
  )
  return [header, ...body].join('\r\n')
}

// ── CSV Exports ──────────────────────────────────────────────────────────────

export function exportProjectsCSV(projects) {
  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Status', key: 'status' },
    { label: 'Priority', key: 'priority' },
    { label: 'Progress (%)', key: 'progress' },
    { label: 'Category', key: 'category' },
    { label: 'Start Date', key: 'startDate' },
    { label: 'Due Date', key: 'dueDate' },
  ]
  const csv = toCSV(projects, columns)
  triggerDownload(csv, 'nexus_projects.csv', 'text/csv;charset=utf-8;', true)
}

export function exportTasksCSV(tasks, projects, members) {
  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Title', key: 'title' },
    { label: 'Description', key: 'description' },
    { label: 'Status', key: 'status' },
    { label: 'Priority', key: 'priority' },
    { label: 'Project', get: row => projects.find(p => p.id === row.projectId)?.name ?? '' },
    { label: 'Assignee', get: row => members.find(m => m.id === row.assignee)?.name ?? 'Unassigned' },
    { label: 'Due Date', key: 'dueDate' },
    { label: 'Labels', get: row => (row.labels || []).join('; ') },
  ]
  const csv = toCSV(tasks, columns)
  triggerDownload(csv, 'nexus_tasks.csv', 'text/csv;charset=utf-8;', true)
}

export function exportMembersCSV(members) {
  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Tasks', key: 'tasks' },
    { label: 'Projects', key: 'projects' },
    { label: 'Joined', key: 'joined' },
  ]
  const csv = toCSV(members, columns)
  triggerDownload(csv, 'nexus_team.csv', 'text/csv;charset=utf-8;', true)
}

// ── JSON Export ───────────────────────────────────────────────────────────────

export function exportAllJSON(state) {
  const payload = {
    exportedAt: new Date().toISOString(),
    projects: state.projects,
    tasks: state.tasks,
    members: state.members,
  }
  const json = JSON.stringify(payload, null, 2)
  triggerDownload(json, 'nexus_backup.json', 'application/json')
}

// ── Print / PDF ───────────────────────────────────────────────────────────────

export function printTable(title, rows, columns) {
  const tableRows = rows.map(row =>
    `<tr>${columns.map(c => `<td>${c.get ? c.get(row) : (row[c.key] ?? '')}</td>`).join('')}</tr>`
  ).join('')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; }
        h1 { font-size: 20px; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; font-size: 13px; }
        th { background: #7c3aed; color: white; padding: 8px 12px; text-align: left; }
        td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) td { background: #f8fafc; }
        p.meta { color: #64748b; font-size: 12px; margin-bottom: 16px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="meta">Exported from TaskFlow · ${new Date().toLocaleString()}</p>
      <table>
        <thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body>
    </html>
  `
  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => win.print(), 500)
}

export function exportProjectsPrint(projects) {
  printTable('Projects Report', projects, [
    { label: 'Name', key: 'name' },
    { label: 'Status', key: 'status' },
    { label: 'Priority', key: 'priority' },
    { label: 'Progress', get: p => `${p.progress}%` },
    { label: 'Category', key: 'category' },
    { label: 'Due Date', key: 'dueDate' },
  ])
}

export function exportTasksPrint(tasks, projects, members) {
  printTable('Tasks Report', tasks, [
    { label: 'Title', key: 'title' },
    { label: 'Status', key: 'status' },
    { label: 'Priority', key: 'priority' },
    { label: 'Project', get: t => projects.find(p => p.id === t.projectId)?.name ?? '' },
    { label: 'Assignee', get: t => members.find(m => m.id === t.assignee)?.name ?? 'Unassigned' },
    { label: 'Due Date', key: 'dueDate' },
  ])
}
