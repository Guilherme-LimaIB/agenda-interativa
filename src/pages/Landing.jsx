import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo/Logo'

const RECURSOS = [
  {
    icone: '🔁',
    titulo: 'Individual + Compartilhada',
    descricao:
      'Cada um com a própria agenda particular, e uma aba só de vocês dois pra ver os compromissos juntos, em tempo real.',
  },
  {
    icone: '📧',
    titulo: 'Lembretes por email',
    descricao: 'De 15 minutos a 1 dia antes de cada evento, direto na sua caixa de entrada — sem custo.',
  },
  {
    icone: '🔂',
    titulo: 'Eventos recorrentes',
    descricao: 'Compromisso que se repete toda semana, mês ou ano? Configure uma vez e esqueça.',
  },
  {
    icone: '🔍',
    titulo: 'Categorias e busca',
    descricao: 'Organize por categoria e cor, e encontre qualquer evento rapidinho pela busca.',
  },
]

const EVENTOS_PREVIA = [
  { titulo: 'Academia', hora: '07:00', cor: '#6366f1' },
  { titulo: 'Consulta médica', hora: '15:00', cor: '#ec4899' },
  { titulo: 'Jantar a dois', hora: '20:00', cor: '#22d3ee' },
]

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/30 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-600/25 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Logo />
          <div className="flex items-center gap-3">
            <a href="#recursos" className="hidden text-sm text-slate-300 hover:text-white sm:inline">
              Recursos
            </a>
            <Link to="/login" className="text-sm text-slate-300 hover:text-white">
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
            >
              Experimente Grátis
            </Link>
          </div>
        </nav>

        <main className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-24 lg:grid-cols-2 lg:pt-24">
          <div>
            <h1 className="font-display text-4xl leading-tight font-extrabold text-white sm:text-5xl">
              Sua agenda,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                a dois.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-400">
              Um calendário individual pra cada um, e um espaço compartilhado pra ver tudo junto — com lembretes
              automáticos e sincronização em tempo real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90"
              >
                Criar conta grátis
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Já tenho conta
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-white">Hoje · terça-feira</span>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">3 eventos</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {EVENTOS_PREVIA.map((evento) => (
                  <div
                    key={evento.titulo}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: evento.cor }} />
                    <span className="flex-1 text-sm font-medium text-slate-200">{evento.titulo}</span>
                    <span className="text-xs text-slate-500">{evento.hora}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500/15 to-pink-500/15 px-3 py-2.5 text-xs text-slate-300">
                💜 Compartilhado com você e seu par
              </div>
            </div>
          </div>
        </main>

        <section id="recursos" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RECURSOS.map((r) => (
              <div
                key={r.titulo}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:border-white/20"
              >
                <span className="text-2xl">{r.icone}</span>
                <h3 className="font-display mt-3 text-base font-bold text-white">{r.titulo}</h3>
                <p className="mt-1.5 text-sm text-slate-400">{r.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-slate-500">
          FlowDaily © 2026 — feito com 💜 pra organizar a vida a dois.
        </footer>
      </div>
    </div>
  )
}
