import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
        navigate('/')
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-xl font-semibold text-gray-900">📅 Criar conta</h1>
        {erro && <p className="mb-4 text-sm text-red-600">{erro}</p>}
        {sucesso && (
          <p className="mb-4 text-sm text-green-600">Confira seu email para confirmar a conta.</p>
        )}
        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-700">Email</label>
          <input
            type="email"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm text-gray-700">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? 'Criando...' : 'Criar conta'}
        </button>
        <p className="mt-4 text-center text-sm text-gray-500">
          Já tem conta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  )
}
