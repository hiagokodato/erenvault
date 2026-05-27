import { Button } from '@erenvault/ui'
import { type FormEvent, useState } from 'react'

import { parseBrlToCents } from '@/utils/money'

type GoalFormProps = {
  isSubmitting: boolean
  onSubmit: (data: { title: string; targetAmountCents: number; deadline: string | null }) => void
}

export function GoalForm({ isSubmitting, onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Dê um nome à sua meta.')
      return
    }

    const targetAmountCents = parseBrlToCents(target)
    if (targetAmountCents === null || targetAmountCents <= 0) {
      setError('Informe um valor alvo válido.')
      return
    }

    onSubmit({
      title: title.trim(),
      targetAmountCents,
      deadline: deadline || null,
    })

    setTitle('')
    setTarget('')
    setDeadline('')
  }

  return (
    <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold text-fg">Nova meta</h2>

      <label className="block space-y-2">
        <span className="label-caps">Nome da meta</span>
        <input
          type="text"
          placeholder="Ex.: Viagem, reserva de emergência"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
        />
      </label>

      <label className="block space-y-2">
        <span className="label-caps">Valor alvo (R$)</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
        />
      </label>

      <label className="block space-y-2">
        <span className="label-caps">Prazo (opcional)</span>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
        />
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Button type="submit" variant="primary" className="w-full rounded-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Criando…' : 'Criar meta'}
      </Button>
    </form>
  )
}
