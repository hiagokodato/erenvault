import { Button } from '@erenvault/ui'
import { Plus, Trash2 } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { getGoalProgress, isGoalComplete } from '@/features/goals/api/goals'
import type { Goal } from '@erenvault/types'
import { formatCurrency, parseBrlToCents } from '@/utils/money'

type GoalCardProps = {
  goal: Goal
  isDeleting: boolean
  isAdding: boolean
  onAddSaved: (id: string, addCents: number) => void
  onDelete: (id: string) => void
}

export function GoalCard({ goal, isDeleting, isAdding, onAddSaved, onDelete }: GoalCardProps) {
  const [addAmount, setAddAmount] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const progress = getGoalProgress(goal)
  const complete = isGoalComplete(goal)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const cents = parseBrlToCents(addAmount)
    if (cents === null || cents <= 0) return
    onAddSaved(goal.id, cents)
    setAddAmount('')
    setShowAdd(false)
  }

  return (
    <li className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-fg">{goal.title}</h3>
          {goal.deadline && (
            <p className="mt-1 text-xs text-muted">
              Até{' '}
              {new Date(goal.deadline + 'T12:00:00').toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Excluir meta"
          disabled={isDeleting}
          onClick={() => onDelete(goal.id)}
        >
          <Trash2 className="size-4 text-muted" />
        </Button>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">
            {formatCurrency(goal.savedAmountCents)} de {formatCurrency(goal.targetAmountCents)}
          </span>
          <span className={complete ? 'font-medium text-primary' : 'text-fg'}>{progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-border/60">
          <div
            className={`h-full rounded-full transition-all ${complete ? 'bg-primary' : 'bg-primary/70'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {complete && (
          <p className="mt-2 text-xs font-medium text-primary">
            Meta alcançada — o Eren está orgulhoso!
          </p>
        )}
      </div>

      {!complete && (
        <div className="mt-4">
          {showAdd ? (
            <form className="flex gap-2" onSubmit={handleAdd}>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Quanto guardou?"
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
              Guardar valor
            </Button>
          )}
        </div>
      )}
    </li>
  )
}
