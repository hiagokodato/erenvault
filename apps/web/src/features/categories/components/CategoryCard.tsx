import { Button } from '@erenvault/ui'
import { Pencil, Trash2 } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import type { Category } from '@/features/categories/api/categories'
import { CATEGORY_COLOR_PRESETS } from '@/features/categories/categoryColors'
import { ColorSwatches } from '@/features/categories/components/ColorSwatches'
import { parseMonthlyBudgetInput } from '@/features/categories/parseBudget'
import { formatCentsToBrlInput, formatCurrency } from '@/utils/money'

type CategoryCardProps = {
  category: Category
  spentCents?: number
  isDeleting: boolean
  isSaving: boolean
  saveError?: string | null
  onUpdate: (data: {
    id: string
    name: string
    color: string | null
    monthlyBudgetCents: number | null
  }) => void
  onDelete: (id: string) => void
}

export function CategoryCard({
  category,
  spentCents = 0,
  isDeleting,
  isSaving,
  saveError,
  onUpdate,
  onDelete,
}: CategoryCardProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color ?? CATEGORY_COLOR_PRESETS[0])
  const [budgetInput, setBudgetInput] = useState(() =>
    category.monthlyBudgetCents != null
      ? formatCentsToBrlInput(category.monthlyBudgetCents)
      : '',
  )
  const [error, setError] = useState<string | null>(null)
  const wasSaving = useRef(false)

  useEffect(() => {
    setName(category.name)
    setColor(category.color ?? CATEGORY_COLOR_PRESETS[0])
    setBudgetInput(
      category.monthlyBudgetCents != null
        ? formatCentsToBrlInput(category.monthlyBudgetCents)
        : '',
    )
  }, [category.id, category.name, category.color, category.monthlyBudgetCents])

  useEffect(() => {
    if (wasSaving.current && !isSaving && !saveError && !error) {
      setEditing(false)
    }
    wasSaving.current = isSaving
  }, [isSaving, saveError, error])

  function handleSave(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Informe o nome da categoria.')
      return
    }

    try {
      const monthlyBudgetCents = parseMonthlyBudgetInput(budgetInput)
      onUpdate({ id: category.id, name: trimmed, color, monthlyBudgetCents })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Orçamento inválido.')
    }
  }

  function handleCancel() {
    setName(category.name)
    setColor(category.color ?? CATEGORY_COLOR_PRESETS[0])
    setBudgetInput(
      category.monthlyBudgetCents != null
        ? formatCentsToBrlInput(category.monthlyBudgetCents)
        : '',
    )
    setError(null)
    setEditing(false)
  }

  const monthlyBudget = category.monthlyBudgetCents
  const budgetPercent =
    monthlyBudget != null && monthlyBudget > 0
      ? Math.round((spentCents / monthlyBudget) * 100)
      : null

  if (editing) {
    return (
      <li className="panel p-5">
        <form className="space-y-4" onSubmit={handleSave}>
          <label className="block space-y-2">
            <span className="label-caps">Nome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
              maxLength={40}
            />
          </label>
          <label className="block space-y-2">
            <span className="label-caps">Orçamento mensal (R$)</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Opcional"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
            />
          </label>
          <div className="space-y-2">
            <span className="label-caps">Cor</span>
            <ColorSwatches value={color} onChange={setColor} />
          </div>
          {(error ?? saveError) && (
            <p className="text-sm text-red-400" role="alert">
              {error ?? saveError}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? 'Salvando…' : 'Salvar'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              className="size-3 shrink-0 rounded-full"
              style={{ backgroundColor: category.color ?? '#94a3b8' }}
              aria-hidden
            />
            <span className="truncate font-medium text-fg">{category.name}</span>
          </div>
          {monthlyBudget != null && monthlyBudget > 0 && (
            <p className="mt-2 text-xs text-muted">
              {formatCurrency(spentCents)} de {formatCurrency(monthlyBudget)} este mês
              {budgetPercent != null && ` (${budgetPercent}%)`}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Editar ${category.name}`}
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300"
            aria-label={`Excluir ${category.name}`}
            disabled={isDeleting}
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </li>
  )
}
