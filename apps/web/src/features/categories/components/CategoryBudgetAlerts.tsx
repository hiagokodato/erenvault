import type { CategoryBudgetStatus } from '@/features/categories/computeCategoryBudgets'
import { formatCurrency } from '@/utils/money'

type CategoryBudgetAlertsProps = {
  alerts: CategoryBudgetStatus[]
  monthLabel: string
}

export function CategoryBudgetAlerts({ alerts, monthLabel }: CategoryBudgetAlertsProps) {
  if (alerts.length === 0) return null

  return (
    <section className="panel p-6">
      <h2 className="font-display text-lg font-semibold text-fg">Orçamentos do mês</h2>
      <p className="mt-1 text-sm capitalize text-muted">
        Categorias perto ou acima do limite em {monthLabel}
      </p>
      <ul className="mt-4 space-y-4">
        {alerts.map((alert) => (
          <li key={alert.categoryId}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-fg">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: alert.color ?? '#94a3b8' }}
                  aria-hidden
                />
                {alert.name}
              </span>
              <span
                className={
                  alert.level === 'over'
                    ? 'text-red-400'
                    : alert.level === 'warning'
                      ? 'text-amber-400'
                      : 'text-muted'
                }
              >
                {formatCurrency(alert.spentCents)} / {formatCurrency(alert.budgetCents)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-fg/8">
              <div
                className={`h-full rounded-full ${
                  alert.level === 'over'
                    ? 'bg-red-400'
                    : alert.level === 'warning'
                      ? 'bg-amber-400'
                      : 'bg-primary/80'
                }`}
                style={{ width: `${Math.min(alert.percent, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {alert.level === 'over'
                ? `${alert.percent}% — acima do orçamento`
                : `${alert.percent}% do limite mensal`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
