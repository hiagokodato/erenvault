import { Button } from '@erenvault/ui'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'

import { ErenMascot } from '@/components/brand/ErenMascot'
import { PageShell } from '@/components/layout/PageShell'
import { Skeleton, SkeletonLine } from '@/components/skeleton/Skeleton'
import { InsightCard } from '@/features/insights/components/InsightCard'
import type { FinancialInsight } from '@/features/insights/types'
import { useEnhanceInsightsApi } from '@/hooks/useEnhanceInsightsApi'
import { useFinancialInsights } from '@/hooks/useFinancialInsights'
import { isApiConfigured } from '@/utils/env'
import { formatCurrency } from '@/utils/money'

function mapApiInsights(texts: string[]): FinancialInsight[] {
  return texts.map((body, index) => ({
    id: `api-${index}`,
    title: 'Conselho do Eren (API)',
    body,
    tone: 'neutral' as const,
  }))
}

export function InsightsPage() {
  const { insights, context, monthLabel, previousMonthLabel, isLoading } = useFinancialInsights()
  const enhanceApi = useEnhanceInsightsApi()
  const [apiInsights, setApiInsights] = useState<FinancialInsight[] | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const apiEnabled = isApiConfigured()

  function handleEnhanceApi() {
    setApiError(null)
    enhanceApi.mutate(undefined, {
      onSuccess: (data) => setApiInsights(mapApiInsights(data.insights)),
      onError: (err) =>
        setApiError(err instanceof Error ? err.message : 'Não foi possível chamar a API.'),
    })
  }

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

      {apiEnabled && (
        <section className="panel flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-fg">Insights via API</h2>
            <p className="mt-1 text-sm text-muted">
              Gera conselhos no servidor (OpenAI opcional). Requer{' '}
              <code className="text-xs">npm run dev:api</code>.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="gap-2 self-start sm:self-auto"
            disabled={enhanceApi.isPending}
            onClick={handleEnhanceApi}
          >
            <Sparkles className="size-4" aria-hidden />
            {enhanceApi.isPending ? 'Gerando…' : 'Gerar com API'}
          </Button>
        </section>
      )}

      {apiError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {apiError}
        </p>
      )}

      {apiInsights && apiInsights.length > 0 && (
        <ul className="space-y-4">
          {apiInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </ul>
      )}

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

      <h2 className="font-display text-lg font-semibold text-fg">Análise local</h2>

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
        A análise local roda no navegador. A API (opcional) processa no servidor com sua chave
        OpenAI — nunca exposta no front.
      </p>
    </PageShell>
  )
}
