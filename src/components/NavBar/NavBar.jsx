import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { usePush } from '../../hooks/usePush'
import { Logo } from '../Logo/Logo'

const linkClasses = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm font-medium transition ${
    isActive ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
  }`

export function NavBar({ onNovoEvento, onCriarPorTexto }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [textoRapido, setTextoRapido] = useState('')
  const { suportado, ativado, carregando, ativar, desativar } = usePush()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSubmitTextoRapido = (e) => {
    e.preventDefault()
    if (!textoRapido.trim()) return
    onCriarPorTexto(textoRapido)
    setTextoRapido('')
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
        <NavLink to="/app/tarefas" className={linkClasses}>
          Tarefas
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        {onNovoEvento && onCriarPorTexto && (
          <form onSubmit={handleSubmitTextoRapido} className="hidden items-center gap-1.5 sm:flex">
            <input
              value={textoRapido}
              onChange={(e) => setTextoRapido(e.target.value)}
              placeholder="✨ Criar por texto (ex: reunião amanhã 15h)"
              className="w-64 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!textoRapido.trim()}
              className="rounded-full border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-40"
            >
              Criar
            </button>
          </form>
        )}
        {onNovoEvento && (
          <button
            onClick={onNovoEvento}
            className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90"
          >
            + Novo Evento
          </button>
        )}
        {suportado && !carregando && (
          <button
            onClick={ativado ? desativar : ativar}
            title={ativado ? 'Desativar notificações push' : 'Ativar notificações push'}
            className={`rounded-full border border-white/10 px-2.5 py-1.5 text-xs hover:bg-white/10 ${
              ativado ? 'text-indigo-300' : 'text-slate-400'
            }`}
          >
            {ativado ? '🔔 Notificações ativas' : '🔕 Ativar notificações'}
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
