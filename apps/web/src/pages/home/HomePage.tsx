import { Button } from '@erenvault/ui'
import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, LineChart, PiggyBank, Sparkles, Target } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ErenMascot } from '@/components/brand/ErenMascot'
import { PageShell } from '@/components/layout/PageShell'

const features = [
  {
    num: '01',
    icon: LineChart,
    title: 'Resumo do mês',
    description: 'Veja saldo, entradas e saídas de forma simples, num só lugar.',
  },
  {
    num: '02',
    icon: Target,
    title: 'Metas',
    description: 'Defina objetivos — viagem, reserva, presentes — e acompanhe o progresso.',
  },
  {
    num: '03',
    icon: CreditCard,
    title: 'Cartões',
    description: 'Organize faturas e gastos por cartão, sem planilha.',
  },
  {
    num: '04',
    icon: PiggyBank,
    title: 'Extratos',
    description: 'Importe movimentações do banco e mantenha tudo organizado.',
  },
  {
    num: '05',
    icon: Sparkles,
    title: 'Dicas do Eren',
    description: 'Sugestões gentis para economizar e planejar melhor.',
  },
] as const

const bentoStats = [
  { label: 'Saldo', value: 'R$ 4.280', sub: 'exemplo' },
  { label: 'Economia', value: '18%', sub: 'exemplo' },
  { label: 'Metas', value: '2/3', sub: 'exemplo' },
] as const

export function HomePage() {
  return (
    <PageShell width="wide" className="space-y-14 lg:space-y-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <p className="label-caps">Finanças pessoais</p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-[3.25rem]">
            O cofre do{' '}
            <span className="italic text-gradient-eren">Eren</span>
            <br />
            para o seu dinheiro
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted">
            Um lugar calmo para acompanhar gastos, metas e cartões. O Eren — nosso gatinho preto —
            inspira este app feito com carinho para a família.
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" className="gap-2 rounded-lg">
              Entrar no cofre
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="relative"
        >
          <div className="panel overflow-hidden p-6 sm:p-8">
            <p className="label-caps text-center text-muted">Como pode ficar</p>
            <ErenMascot className="mx-auto mt-4 h-36 w-full max-w-[220px] sm:h-44" />
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {bentoStats.map(({ label, value, sub }) => (
                <div key={label} className="panel-inset px-2 py-3 text-center sm:px-3">
                  <p className="label-caps">{label}</p>
                  <p className="mt-1 font-display text-lg font-semibold text-fg sm:text-xl">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted">{sub}</p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full bg-primary/20 blur-2xl"
            aria-hidden
          />
        </motion.div>
      </section>

      <section className="border-t border-border/60 pt-12">
        <div className="mb-10">
          <p className="label-caps">Recursos</p>
          <h2 className="font-display text-2xl font-semibold text-fg sm:text-3xl">
            O que você pode fazer aqui
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Tudo pensado para ser claro, sem complicação — ideal para o dia a dia.
          </p>
        </div>

        <ol className="divide-y divide-border/60">
          {features.map(({ num, icon: Icon, title, description }, index) => (
            <motion.li
              key={num}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.04 }}
              className="group grid gap-4 py-6 sm:grid-cols-[4rem_2.5rem_1fr] sm:items-start sm:gap-6 sm:py-8"
            >
              <span className="font-display text-3xl font-light text-border transition group-hover:text-primary/60">
                {num}
              </span>
              <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-fg">{title}</h3>
                <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted">{description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="panel flex flex-col items-start justify-between gap-6 bg-gradient-to-r from-card via-card to-primary/5 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="label-caps text-primary">Comece hoje</p>
          <p className="mt-2 font-display text-xl font-semibold text-fg">
            Abra seu cofre e organize suas finanças com o Eren
          </p>
        </div>
        <Link to="/login">
          <Button variant="primary" className="shrink-0 gap-2 rounded-lg">
            Entrar
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </section>
    </PageShell>
  )
}
