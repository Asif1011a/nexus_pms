const BASE = 'http://localhost:5000/api'

function getToken() {
  try {
    const s = localStorage.getItem('nexus_token')
    return s || null
  } catch { return null }
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  get:    (path)         => request(path),
  post:   (path, body)   => request(path, { method: 'POST',   body }),
  put:    (path, body)   => request(path, { method: 'PUT',    body }),
  delete: (path)         => request(path, { method: 'DELETE' }),
}
