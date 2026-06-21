import { Button } from '@erenvault/ui'
import { type FormEvent, useState } from 'react'

import type { Category } from '@/features/categories/api/categories'
import type { Transaction, TransactionType } from '@erenvault/types'
import { formatCentsToBrlInput, parseBrlToCents } from '@/utils/money'

type TransactionEditFormProps = {
  transaction: Transaction
  categories: Category[]
  isSubmitting: boolean
  onSubmit: (data: {
    type: TransactionType
    amountCents: number
    description: string
    categoryId: string | null
    occurredOn: string
  }) => void
  onCancel: () => void
}

export function TransactionEditForm({
  transaction,
  categories,
  isSubmitting,
  onSubmit,
  onCancel,
}: TransactionEditFormProps) {
  const [type, setType] = useState<TransactionType>(transaction.type)
  const [amount, setAmount] = useState(() => formatCentsToBrlInput(transaction.amountCents))
  const [description, setDescription] = useState(transaction.description)
  const [categoryId, setCategoryId] = useState(transaction.categoryId ?? '')
  const [occurredOn, setOccurredOn] = useState(transaction.occurredOn)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const amountCents = parseBrlToCents(amount)
    if (amountCents === null || amountCents === 0) {
      setError('Informe um valor válido.')
      return
    }

    if (!description.trim()) {
      setError('Descreva o lançamento.')
      return
    }

    onSubmit({
      type,
      amountCents,
      description: description.trim(),
      categoryId: categoryId || null,
      occurredOn,
    })
  }

  return (
    <form className="flex-1 space-y-4 py-1" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('expense')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            type === 'expense'
              ? 'border-primary/50 bg-primary/15 text-primary'
              : 'border-border text-muted hover:text-fg'
          }`}
        >
          Saída
        </button>
        <button
          type="button"
          onClick={() => setType('income')}
          className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            type === 'income'
              ? 'border-primary/50 bg-primary/15 text-primary'
              : 'border-border text-muted hover:text-fg'
          }`}
        >
          Entrada
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="label-caps">Valor (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="label-caps">Data</span>
          <input
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="label-caps">Descrição</span>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="label-caps">Categoria</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm"
        >
          <option value="">Sem categoria</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando…' : 'Salvar'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
