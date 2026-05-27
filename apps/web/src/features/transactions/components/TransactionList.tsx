import { Button } from '@erenvault/ui'
import { ArrowDownLeft, ArrowUpRight, Trash2 } from 'lucide-react'

import type { Category } from '@/features/categories/api/categories'
import type { Transaction } from '@erenvault/types'
import { formatCurrency } from '@/utils/money'

type TransactionListProps = {
  transactions: Transaction[]
  categories: Category[]
  isDeletingId: string | null
  onDelete: (id: string) => void
}

function categoryName(categories: Category[], id: string | null) {
  if (!id) return null
  return categories.find((c) => c.id === id)?.name ?? null
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function TransactionList({
  transactions,
  categories,
  isDeletingId,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="panel p-8 text-center">
        <p className="text-sm text-muted">Nenhum lançamento neste mês ainda.</p>
        <p className="mt-1 text-xs text-muted">Use o formulário acima para registrar o primeiro.</p>
      </div>
    )
  }

  return (
    <ul className="panel divide-y divide-border/60">
      {transactions.map((t) => {
        const isIncome = t.type === 'income'
        const cat = categoryName(categories, t.categoryId)

        return (
          <li key={t.id} className="flex items-center gap-4 px-4 py-4 sm:px-6">
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                isIncome ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/10 text-red-300'
              }`}
            >
              {isIncome ? (
                <ArrowDownLeft className="size-5" aria-hidden />
              ) : (
                <ArrowUpRight className="size-5" aria-hidden />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-fg">{t.description}</p>
              <p className="mt-0.5 text-xs text-muted">
                {formatDate(t.occurredOn)}
                {cat ? ` · ${cat}` : ''}
              </p>
            </div>

            <p
              className={`shrink-0 font-display text-lg font-semibold ${
                isIncome ? 'text-emerald-400' : 'text-fg'
              }`}
            >
              {isIncome ? '+' : '−'}
              {formatCurrency(t.amountCents)}
            </p>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Excluir lançamento"
              disabled={isDeletingId === t.id}
              onClick={() => onDelete(t.id)}
            >
              <Trash2 className="size-4 text-muted" />
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
