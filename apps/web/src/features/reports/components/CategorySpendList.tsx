import type { CategorySpendRow } from '@/features/reports/computeSpendingByCategory'
import { formatCurrency } from '@/utils/money'

type CategorySpendListProps = {
  rows: CategorySpendRow[]
  emptyMessage: string
}

export function CategorySpendList({ rows, emptyMessage }: CategorySpendListProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-4" role="list">
      {rows.map((row) => (
        <li key={row.categoryId ?? '__none__'}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 truncate font-medium text-fg">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: row.color ?? '#94a3b8' }}
                aria-hidden
              />
              {row.name}
            </span>
            <span className="shrink-0 text-muted">
              {formatCurrency(row.amountCents)}
              <span className="ml-1 text-xs">({Math.round(row.share * 100)}%)</span>
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-fg/8"
            role="progressbar"
            aria-valuenow={Math.round(row.share * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${row.name}: ${Math.round(row.share * 100)}%`}
          >
            <div
              className="h-full rounded-full transition-[width]"
              style={{
                width: `${Math.round(row.share * 100)}%`,
                backgroundColor: row.color ?? '#94a3b8',
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
