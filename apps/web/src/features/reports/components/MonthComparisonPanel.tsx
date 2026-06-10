import type { ComparisonMetric } from '@/features/reports/computeMonthComparison'
import { formatCurrency } from '@/utils/money'

type MonthComparisonPanelProps = {
  currentLabel: string
  previousLabel: string
  metrics: ComparisonMetric[]
}

function formatDeltaPercent(value: number | null): string {
  if (value === null) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value}%`
}

function deltaTone(metric: ComparisonMetric): string {
  if (metric.deltaCents === 0) return 'text-muted'

  if (metric.key === 'expense') {
    return metric.deltaCents > 0 ? 'text-red-400' : 'text-emerald-400'
  }

  return metric.deltaCents > 0 ? 'text-emerald-400' : 'text-red-400'
}

export function MonthComparisonPanel({
  currentLabel,
  previousLabel,
  metrics,
}: MonthComparisonPanelProps) {
  return (
    <section className="panel p-6">
      <h2 className="font-display text-lg font-semibold text-fg">Comparativo mensal</h2>
      <p className="mt-1 text-sm text-muted capitalize">
        <span>{currentLabel}</span> vs <span>{previousLabel}</span>
      </p>

      <ul className="mt-6 space-y-4">
        {metrics.map((metric) => (
          <li
            key={metric.key}
            className="grid gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0 sm:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="label-caps">{metric.label}</p>
              <p className="mt-1 font-display text-xl font-semibold text-fg">
                {formatCurrency(metric.currentCents)}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Mês anterior: {formatCurrency(metric.previousCents)}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className={`text-sm font-medium ${deltaTone(metric)}`}>
                {metric.deltaCents >= 0 ? '+' : '−'}
                {formatCurrency(Math.abs(metric.deltaCents))}
              </p>
              <p className={`text-xs ${deltaTone(metric)}`}>
                {formatDeltaPercent(metric.deltaPercent)} vs mês anterior
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
