import { Button } from '@erenvault/ui'
import { Plus, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import {
  getAvailableCents,
  getCardUsagePercent,
  isCardOverLimit,
} from '@/features/credit-cards/api/creditCards'
import type { CreditCard } from '@erenvault/types'
import { formatCurrency, parseBrlToCents } from '@/utils/money'

type CreditCardItemProps = {
  card: CreditCard
  isDeleting: boolean
  isAdding: boolean
  onAddBalance: (id: string, addCents: number) => void
  onDelete: (id: string) => void
}

export function CreditCardItem({
  card,
  isDeleting,
  isAdding,
  onAddBalance,
  onDelete,
}: CreditCardItemProps) {
  const [addAmount, setAddAmount] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const usage = getCardUsagePercent(card)
  const available = getAvailableCents(card)
  const overLimit = isCardOverLimit(card)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const cents = parseBrlToCents(addAmount)
    if (cents === null || cents <= 0) return
    onAddBalance(card.id, cents)
    setAddAmount('')
    setShowAdd(false)
  }

  return (
    <li className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-fg">{card.name}</h3>
          <p className="mt-1 text-xs text-muted">
            Fecha dia {card.closingDay} · Vence dia {card.dueDay}
          </p>
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Excluir cartão"
          disabled={isDeleting}
          onClick={() => onDelete(card.id)}
        >
          <Trash2 className="size-4 text-muted" />
        </Button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">
            Fatura {formatCurrency(card.balanceCents)} / {formatCurrency(card.limitCents)}
          </span>
          <span className={overLimit ? 'font-medium text-red-300' : 'text-fg'}>{usage}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
          <div
            className={`h-full rounded-full transition-all ${
              overLimit ? 'bg-red-400/80' : usage >= 80 ? 'bg-amber-400/80' : 'bg-primary/70'
            }`}
            style={{ width: `${Math.min(100, usage)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Disponível:{' '}
          <span className={available === 0 ? 'text-amber-300' : 'text-fg'}>
            {formatCurrency(available)}
          </span>
        </p>
        {overLimit && (
          <p className="mt-1 text-xs font-medium text-red-300">
            Acima do limite — atenção na fatura.
          </p>
        )}
      </div>

      <div className="mt-4">
        {showAdd ? (
          <form className="flex gap-2" onSubmit={handleAdd}>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Valor da fatura"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm"
            />
            <Button type="submit" variant="primary" size="sm" disabled={isAdding}>
              Ok
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
              Cancelar
            </Button>
          </form>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="size-4" />
            Atualizar fatura
          </Button>
        )}
      </div>
    </li>
  )
}
