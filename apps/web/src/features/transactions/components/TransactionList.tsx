import { Button } from '@erenvault/ui'
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { Category } from '@/features/categories/api/categories'
import { TransactionEditForm } from '@/features/transactions/components/TransactionEditForm'
import type { Transaction, TransactionType } from '@erenvault/types'
import { formatCurrency } from '@/utils/money'

type TransactionListProps = {
  transactions: Transaction[]
  categories: Category[]
  isDeletingId: string | null
  isUpdatingId: string | null
  onDelete: (id: string) => void
  onUpdate: (
    id: string,
    data: {
      type: TransactionType
      amountCents: number
      description: string
      categoryId: string | null
      occurredOn: string
    },
    onDone: () => void,
  ) => void
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
  isUpdatingId,
  onDelete,
  onUpdate,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)

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
        const isEditing = editingId === t.id
        const isIncome = t.type === 'income'
        const cat = categoryName(categories, t.categoryId)

        return (
          <li key={t.id} className="px-4 py-4 sm:px-6">
            {isEditing ? (
              <div className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Pencil className="size-5" aria-hidden />
                </span>
                <TransactionEditForm
                  transaction={t}
                  categories={categories}
                  isSubmitting={isUpdatingId === t.id}
                  onCancel={() => setEditingId(null)}
                  onSubmit={(data) => onUpdate(t.id, data, () => setEditingId(null))}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
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

                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Editar lançamento"
                    onClick={() => setEditingId(t.id)}
                  >
                    <Pencil className="size-4 text-muted" />
                  </Button>
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
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
