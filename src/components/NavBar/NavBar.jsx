import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { usePush } from '../../hooks/usePush'
import { Logo } from '../Logo/Logo'
import { Button } from '../ui/Button'
import { NavigationItem } from '../ui/NavigationItem'

export function NavBar({ onNovoEvento, onCriarPorTexto }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [textoRapido, setTextoRapido] = useState('')
  const { suportado, ativado, carregando, erro: erroPush, ativar, desativar } = usePush()

  useEffect(() => {
    if (erroPush) window.alert(erroPush)
  }, [erroPush])

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
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-6 py-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Logo />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <NavigationItem to="/app" end>
            Hoje
          </NavigationItem>
          <NavigationItem to="/app/calendario">Minha Agenda</NavigationItem>
          <NavigationItem to="/app/compartilhada">Compartilhada</NavigationItem>
          <NavigationItem to="/app/tarefas">Tarefas</NavigationItem>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {onCriarPorTexto && (
          <form onSubmit={handleSubmitTextoRapido} className="hidden items-center gap-1.5 sm:flex">
            <input
              value={textoRapido}
              onChange={(e) => setTextoRapido(e.target.value)}
              placeholder="Criar por texto (ex: reunião amanhã 15h)"
              className="fd-ui w-64 border-b border-line bg-transparent px-1 py-1.5 text-ink placeholder:text-muted focus:border-signal focus:outline-none"
            />
            <Button type="submit" variant="ghost" disabled={!textoRapido.trim()}>
              Criar
            </Button>
          </form>
        )}
        {onNovoEvento && (
          <Button variant="primary" onClick={onNovoEvento}>
            + Novo evento
          </Button>
        )}
        {suportado && !carregando && (
          <button
            onClick={ativado ? desativar : ativar}
            title={ativado ? 'Desativar notificações push' : 'Ativar notificações push'}
            className={`fd-meta uppercase ${ativado ? 'text-signal' : 'text-muted hover:text-ink'}`}
          >
            {ativado ? 'Notificações ativas' : 'Ativar notificações'}
          </button>
        )}
        <span className="fd-meta text-muted">{user?.email}</span>
        <button onClick={handleLogout} className="fd-ui text-muted hover:text-ink">
          Sair
        </button>
      </div>
    </nav>
  )
}
