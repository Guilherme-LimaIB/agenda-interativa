import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo/Logo'
import { Button } from '../components/ui/Button'
import { ErrorState } from '../components/ui/ErrorState'
import { signup } from '../services/authService'

export function Signup() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const data = await signup(email, senha)
      if (data.session) {
        navigate('/app')
      } else {
        setSucesso(true)
      }
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-line bg-surface p-8">
        <Link to="/" className="mb-8 inline-flex">
          <Logo />
        </Link>
        <h1 className="fd-heading-lg mb-4">Criar conta</h1>
        {erro && <ErrorState message={erro} className="mb-4" />}
        {sucesso && <p className="fd-ui mb-4 text-signal">Confira seu email para confirmar a conta.</p>}
        <div className="mb-4">
          <label className="fd-ui mb-1 block text-muted">Email</label>
          <input
            type="email"
            required
            className="fd-body w-full border-b border-line bg-transparent px-1 py-2 text-ink placeholder:text-muted focus:border-signal focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="fd-ui mb-1 block text-muted">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            className="fd-body w-full border-b border-line bg-transparent px-1 py-2 text-ink placeholder:text-muted focus:border-signal focus:outline-none"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" disabled={carregando} className="w-full">
          {carregando ? 'Criando...' : 'Criar conta'}
        </Button>
        <p className="fd-body mt-4 text-center text-muted">
          Já tem conta?{' '}
          <Link to="/login" className="text-signal hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
