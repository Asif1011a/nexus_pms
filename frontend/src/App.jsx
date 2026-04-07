import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import { ToastProvider } from './context/ToastContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ToastContainer from './components/ToastContainer'

// Admin pages
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Tasks from './pages/Tasks'
import Team from './pages/Team'
import Calendar from './pages/Calendar'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import UserManagement from './pages/admin/UserManagement'

// User pages
import UserDashboard from './pages/user/UserDashboard'
import MyTasks from './pages/user/MyTasks'

// Auth pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

// ── Auth Router (shown when not logged in) ────────────────────────────────────
function AuthRouter() {
  const [page, setPage] = useState('login')
  if (page === 'signup') return <Signup onNavigate={setPage} />
  if (page === 'forgot') return <ForgotPassword onNavigate={setPage} />
  return <Login onNavigate={setPage} />
}

// ── Admin App ─────────────────────────────────────────────────────────────────
function AdminApp() {
  const { currentPage } = useApp()
  const pages = {
    dashboard: <Dashboard />,
    projects: <Projects />,
    tasks: <Tasks />,
    team: <Team />,
    calendar: <Calendar />,
    reports: <Reports />,
    users: <UserManagement />,
    settings: <Settings />,
  }
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8f7f5' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 content-area">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 page-enter">
          {pages[currentPage] || <Dashboard />}
        </main>
      </div>
    </div>
  )
}

// ── User App ──────────────────────────────────────────────────────────────────
function UserApp() {
  const { currentPage } = useApp()
  const pages = {
    dashboard: <UserDashboard />,
    'my-tasks': <MyTasks />,
    calendar: <Calendar />,
    settings: <Settings />,
  }
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f1117' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 content-area">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 page-enter">
          {pages[currentPage] || <UserDashboard />}
        </main>
      </div>
    </div>
  )
}

// ── App Gate: decides which experience to show ────────────────────────────────
function AppGate() {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated) return <AuthRouter />
  if (isAdmin) return <AppProvider><AdminApp /></AppProvider>
  return <AppProvider><UserApp /></AppProvider>
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppGate />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  )
}
