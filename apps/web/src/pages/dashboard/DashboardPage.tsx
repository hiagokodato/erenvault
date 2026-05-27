import { Button } from '@erenvault/ui'
import { ArrowRight, CreditCard, Receipt, Sparkles, Target, TrendingUp, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/layout/PageShell'
import { InsightCard } from '@/features/insights/components/InsightCard'
import { computeCardsSummary, getCardUsagePercent } from '@/features/credit-cards/api/creditCards'
import { computeGoalsSummary, getGoalProgress } from '@/features/goals/api/goals'
import { useAuth } from '@/features/auth/context/useAuth'
import { useCreditCards } from '@/hooks/useCreditCards'
import { useFinancialInsights } from '@/hooks/useFinancialInsights'
import { useGoals } from '@/hooks/useGoals'
import { useProfile } from '@/hooks/useProfile'
import { computeMonthlySummary, useMonthTransactions } from '@/hooks/useTransactions'
import { formatCurrency, getCurrentMonthRange } from '@/utils/money'

export function DashboardPage() {
  const { user } = useAuth()
  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: transactions = [], isLoading: txLoading } = useMonthTransactions()
  const { data: goals = [], isLoading: goalsLoading } = useGoals()
  const { data: cards = [], isLoading: cardsLoading } = useCreditCards()
  const { insights, isLoading: insightsLoading } = useFinancialInsights()
  const { label: monthLabel } = getCurrentMonthRange()

  const summary = computeMonthlySummary(transactions)
  const goalsSummary = computeGoalsSummary(goals)
  const cardsSummary = computeCardsSummary(cards)

  const displayName =
    profile?.displayName ??
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Amigo'

  const recent = transactions.slice(0, 5)
  const topGoals = goals.slice(0, 3)
  const topCards = cards.slice(0, 3)
  const topInsights = insights.slice(0, 2)

  return (
    <PageShell width="wide" className="space-y-8">
      <header>
        <p className="label-caps">Seu cofre</p>
        <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
          Olá, {profileLoading ? '…' : displayName}
        </h1>
        <p className="mt-2 text-sm capitalize text-muted">Resumo de {monthLabel}</p>
      </header>

      {(insightsLoading || topInsights.length > 0) && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" aria-hidden />
              <h2 className="font-display text-lg font-semibold text-fg">Conselhos do Eren</h2>
            </div>
            <Link to="/insights">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todos
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          {insightsLoading ? (
            <p className="text-sm text-muted">Analisando…</p>
          ) : (
            <ul className="space-y-3">
              {topInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </ul>
          )}
        </section>
      )}

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
            <Target className="size-4" aria-hidden />
            <p className="label-caps">Metas</p>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-fg">
            {goalsLoading
              ? '…'
              : goalsSummary.total === 0
                ? '—'
                : `${goalsSummary.completed}/${goalsSummary.total}`}
          </p>
          <p className="mt-0.5 text-xs text-muted">concluídas</p>
        </div>
      </div>

      {cards.length > 0 && (
        <section className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-fg">Cartões</h2>
            <Link to="/cartoes">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todos
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-2 text-sm text-muted">
            {cardsLoading
              ? '…'
              : `${formatCurrency(cardsSummary.totalUsedCents)} usados de ${formatCurrency(cardsSummary.totalLimitCents)}`}
          </p>
          <ul className="mt-4 space-y-4">
            {topCards.map((card) => {
              const usage = getCardUsagePercent(card)
              return (
                <li key={card.id}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex items-center gap-2 font-medium text-fg">
                      <CreditCard className="size-4 text-muted" aria-hidden />
                      {card.name}
                    </span>
                    <span className="text-muted">{usage}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${usage}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {topGoals.length > 0 && (
        <section className="panel p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-fg">Suas metas</h2>
            <Link to="/metas">
              <Button variant="ghost" size="sm" className="gap-2">
                Ver todas
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {topGoals.map((goal) => {
              const progress = getGoalProgress(goal)
              return (
                <li key={goal.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-fg">{goal.title}</span>
                    <span className="text-muted">{progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-full rounded-full bg-primary/80"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

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
