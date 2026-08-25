import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo/Logo'
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-indigo-600/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-pink-600/20 blur-[100px]" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <Link to="/" className="mb-6 inline-flex">
          <Logo />
        </Link>
        <h1 className="font-display mb-4 text-lg font-bold text-white">Criar conta</h1>
        {erro && <p className="mb-4 text-sm text-pink-400">{erro}</p>}
        {sucesso && (
          <p className="mb-4 text-sm text-emerald-400">Confira seu email para confirmar a conta.</p>
        )}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-slate-300">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm text-slate-300">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-50"
        >
          {carregando ? 'Criando...' : 'Criar conta'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
