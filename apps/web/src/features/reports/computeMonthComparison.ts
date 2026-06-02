import { computeMonthlySummary } from '@/features/transactions/api/transactions'
import type { Transaction } from '@erenvault/types'

export type ComparisonMetric = {
  key: 'income' | 'expense' | 'balance'
  label: string
  currentCents: number
  previousCents: number
  deltaCents: number
  deltaPercent: number | null
}

function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / previous) * 100)
}

export function computeMonthComparison(
  currentTransactions: Transaction[],
  previousTransactions: Transaction[],
): ComparisonMetric[] {
  const current = computeMonthlySummary(currentTransactions)
  const previous = computeMonthlySummary(previousTransactions)

  const rows: ComparisonMetric[] = [
    {
      key: 'income',
      label: 'Entradas',
      currentCents: current.incomeCents,
      previousCents: previous.incomeCents,
      deltaCents: current.incomeCents - previous.incomeCents,
      deltaPercent: deltaPercent(current.incomeCents, previous.incomeCents),
    },
    {
      key: 'expense',
      label: 'Saídas',
      currentCents: current.expenseCents,
      previousCents: previous.expenseCents,
      deltaCents: current.expenseCents - previous.expenseCents,
      deltaPercent: deltaPercent(current.expenseCents, previous.expenseCents),
    },
    {
      key: 'balance',
      label: 'Saldo',
      currentCents: current.balanceCents,
      previousCents: previous.balanceCents,
      deltaCents: current.balanceCents - previous.balanceCents,
      deltaPercent: deltaPercent(current.balanceCents, previous.balanceCents),
    },
  ]

  return rows
}
