import { Button } from '@erenvault/ui'
import { ArrowRight, Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useProfile } from '@/hooks/useProfile'
import { computeMonthlySummary, useMonthTransactions } from '@/hooks/useTransactions'
import { formatCurrency, getCurrentMonthRange } from '@/utils/money'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: transactions = [], isLoading: txLoading } = useMonthTransactions()
  const { label: monthLabel } = getCurrentMonthRange()

  const summary = computeMonthlySummary(transactions)

  const displayName =
    profile?.displayName ??
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Amigo'

  const recent = transactions.slice(0, 5)

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Seu cofre</p>
        <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
          Olá, {profileLoading ? '…' : displayName}
        </h1>
        <p className="mt-2 text-sm capitalize text-muted">Resumo de {monthLabel}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-5 sm:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Wallet className="size-5" aria-hidden />
            </span>
            <div>
              <p className="label-caps">Saldo do mês</p>
              <p className="stat-value mt-1">
                {txLoading ? '…' : formatCurrency(summary.balanceCents)}
              </p>
            </div>
          </div>
        </div>

        <div className="panel-inset flex flex-col justify-center p-5">
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="size-4" aria-hidden />
            <p className="label-caps">Entradas</p>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-fg">
            {txLoading ? '…' : formatCurrency(summary.incomeCents)}
          </p>
        </div>

        <div className="panel-inset flex flex-col justify-center p-5">
          <div className="flex items-center gap-2 text-muted">
            <TrendingDown className="size-4" aria-hidden />
            <p className="label-caps">Saídas</p>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-fg">
            {txLoading ? '…' : formatCurrency(summary.expenseCents)}
          </p>
        </div>
      </div>

      <section className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-fg">Últimos lançamentos</h2>
          <Link to="/transacoes">
            <Button variant="ghost" size="sm" className="gap-2">
              Ver todos
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        {txLoading ? (
          <p className="mt-6 text-sm text-muted">Carregando…</p>
        ) : recent.length === 0 ? (
          <div className="mt-6 text-center">
            <Receipt className="mx-auto size-10 text-muted/50" aria-hidden />
            <p className="mt-3 text-sm text-muted">Nenhum lançamento ainda neste mês.</p>
            <Link to="/transacoes" className="mt-4 inline-block">
              <Button variant="primary" size="sm" className="rounded-lg">
                Registrar primeiro lançamento
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border/60">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3 text-sm">
                <span className="truncate text-fg">{t.description}</span>
                <span className={t.type === 'income' ? 'text-emerald-400' : 'text-muted'}>
                  {t.type === 'income' ? '+' : '−'}
                  {formatCurrency(t.amountCents)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  )
}
