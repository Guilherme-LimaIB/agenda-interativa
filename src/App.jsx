import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Compartilhada } from './pages/Compartilhada'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Tarefas } from './pages/Tarefas'

function TelaCarregando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
      Carregando...
    </div>
  )
}

function RotaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <TelaCarregando />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RotaPublica({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <TelaCarregando />
  if (user) return <Navigate to="/app" replace />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RotaPublica>
              <Landing />
            </RotaPublica>
          }
        />
        <Route
          path="/login"
          element={
            <RotaPublica>
              <Login />
            </RotaPublica>
          }
        />
        <Route
          path="/signup"
          element={
            <RotaPublica>
              <Signup />
            </RotaPublica>
          }
        />
        <Route
          path="/app"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/app/compartilhada"
          element={
            <RotaProtegida>
              <Compartilhada />
            </RotaProtegida>
          }
        />
        <Route
          path="/app/tarefas"
          element={
            <RotaProtegida>
              <Tarefas />
            </RotaProtegida>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
