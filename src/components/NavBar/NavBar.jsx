import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../Logo/Logo'

const linkClasses = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
  }`

export function NavBar({ onNovoEvento }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/5 px-6 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <Logo />
        <NavLink to="/app" end className={linkClasses}>
          Minha Agenda
        </NavLink>
        <NavLink to="/app/compartilhada" className={linkClasses}>
          Compartilhada
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        {onNovoEvento && (
          <button
            onClick={onNovoEvento}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90"
          >
            + Novo Evento
          </button>
        )}
        <span className="text-sm text-slate-400">{user?.email}</span>
        <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-white">
          Sair
        </button>
      </div>
    </nav>
  )
}
