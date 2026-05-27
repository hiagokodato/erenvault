import { Button } from '@erenvault/ui'
import { type FormEvent, useState } from 'react'

import type { Category } from '@/features/categories/api/categories'
import type { TransactionType } from '@erenvault/types'
import { parseBrlToCents } from '@/utils/money'

type TransactionFormProps = {
  categories: Category[]
  isSubmitting: boolean
  onSubmit: (data: {
    type: TransactionType
    amountCents: number
    description: string
    categoryId: string | null
    occurredOn: string
  }) => void
}

export function TransactionForm({ categories, isSubmitting, onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [occurredOn, setOccurredOn] = useState(() => new Date().toISOString().slice(0, 10))
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

    setAmount('')
    setDescription('')
    setCategoryId('')
    setOccurredOn(new Date().toISOString().slice(0, 10))
  }

  return (
    <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold text-fg">Novo lançamento</h2>

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

      <label className="block space-y-2">
        <span className="label-caps">Valor (R$)</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </label>

      <label className="block space-y-2">
        <span className="label-caps">Descrição</span>
        <input
          type="text"
          placeholder="Ex.: Mercado, aluguel, salário"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="label-caps">Categoria</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="label-caps">Data</span>
          <input
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full rounded-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Adicionar lançamento'}
      </Button>
    </form>
  )
}
