import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Compartilhada } from './pages/Compartilhada'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

function RotaProtegida({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="p-4 text-sm text-gray-500">Carregando...</p>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/compartilhada"
          element={
            <RotaProtegida>
              <Compartilhada />
            </RotaProtegida>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
