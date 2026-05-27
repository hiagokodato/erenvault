import { PageShell } from '@/components/layout/PageShell'
import { ErenMascot } from '@/components/brand/ErenMascot'
import { Skeleton, SkeletonLine } from '@/components/skeleton/Skeleton'
import { InsightCard } from '@/features/insights/components/InsightCard'
import { useFinancialInsights } from '@/hooks/useFinancialInsights'
import { formatCurrency } from '@/utils/money'

export function InsightsPage() {
  const { insights, context, monthLabel, previousMonthLabel, isLoading } = useFinancialInsights()

  return (
    <PageShell width="wide" className="space-y-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="label-caps">Inteligência financeira</p>
          <h1 className="font-display text-3xl font-semibold text-fg">Conselhos do Eren</h1>
          <p className="mt-2 text-sm capitalize text-muted">
            Análise de {monthLabel} · comparado com {previousMonthLabel}
          </p>
        </div>
        <ErenMascot className="hidden h-24 w-auto opacity-90 sm:block" />
      </header>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="panel-inset p-4 text-center">
              <p className="label-caps">
                <SkeletonLine className="mx-auto" />
              </p>
              <Skeleton className="mx-auto mt-2 h-7 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="panel-inset p-4 text-center">
            <p className="label-caps">Entradas</p>
            <p className="mt-1 font-display text-xl font-semibold text-emerald-400">
              {formatCurrency(context.incomeCents)}
            </p>
          </div>
          <div className="panel-inset p-4 text-center">
            <p className="label-caps">Saídas</p>
            <p className="mt-1 font-display text-xl font-semibold text-fg">
              {formatCurrency(context.expenseCents)}
            </p>
          </div>
          <div className="panel-inset p-4 text-center">
            <p className="label-caps">Saldo</p>
            <p className="mt-1 font-display text-xl font-semibold text-primary">
              {formatCurrency(context.balanceCents)}
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <ul className="space-y-4" aria-label="Carregando insights">
          {[0, 1].map((i) => (
            <li key={i} className="panel p-5">
              <div className="flex gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-3">
                  <SkeletonLine className="w-3/4" />
                  <SkeletonLine className="w-full" />
                  <SkeletonLine className="w-11/12" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : insights.length === 0 ? (
        <div className="panel p-8 text-center">
          <p className="text-sm text-muted">
            Sem insights por enquanto. Cadastre lançamentos para começar.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-muted">
        Insights gerados localmente a partir dos seus lançamentos, metas e cartões — sem enviar
        dados para serviços externos.
      </p>
    </PageShell>
  )
}
