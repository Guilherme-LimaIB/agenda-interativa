import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

const linkClasses = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-800'
  }`

export function NavBar({ onNovoEvento }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-gray-900">📅 Nossa Agenda</span>
        <NavLink to="/" end className={linkClasses}>
          Minha Agenda
        </NavLink>
        <NavLink to="/compartilhada" className={linkClasses}>
          Compartilhada
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        {onNovoEvento && (
          <button
            onClick={onNovoEvento}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Novo Evento
          </button>
        )}
        <span className="text-sm text-gray-500">{user?.email}</span>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800">
          Sair
        </button>
      </div>
    </nav>
  )
}
