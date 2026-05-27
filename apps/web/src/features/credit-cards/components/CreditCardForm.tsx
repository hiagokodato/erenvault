import { Button } from '@erenvault/ui'
import { type FormEvent, useState } from 'react'

import { parseBrlToCents } from '@/utils/money'

type CreditCardFormProps = {
  isSubmitting: boolean
  onSubmit: (data: { name: string; limitCents: number; closingDay: number; dueDay: number }) => void
}

export function CreditCardForm({ isSubmitting, onSubmit }: CreditCardFormProps) {
  const [name, setName] = useState('')
  const [limit, setLimit] = useState('')
  const [closingDay, setClosingDay] = useState('10')
  const [dueDay, setDueDay] = useState('17')
  const [error, setError] = useState<string | null>(null)

  function parseDay(value: string): number | null {
    const day = Number.parseInt(value, 10)
    if (Number.isNaN(day) || day < 1 || day > 31) return null
    return day
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Informe o nome do cartão.')
      return
    }

    const limitCents = parseBrlToCents(limit)
    if (limitCents === null || limitCents <= 0) {
      setError('Informe um limite válido.')
      return
    }

    const closing = parseDay(closingDay)
    const due = parseDay(dueDay)
    if (closing === null || due === null) {
      setError('Dias de fechamento e vencimento devem ser entre 1 e 31.')
      return
    }

    onSubmit({
      name: name.trim(),
      limitCents,
      closingDay: closing,
      dueDay: due,
    })

    setName('')
    setLimit('')
    setClosingDay('10')
    setDueDay('17')
  }

  return (
    <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold text-fg">Novo cartão</h2>

      <label className="block space-y-2">
        <span className="label-caps">Nome</span>
        <input
          type="text"
          placeholder="Ex.: Nubank, Inter"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
        />
      </label>

      <label className="block space-y-2">
        <span className="label-caps">Limite (R$)</span>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="label-caps">Fechamento (dia)</span>
          <input
            type="number"
            min={1}
            max={31}
            value={closingDay}
            onChange={(e) => setClosingDay(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
          />
        </label>
        <label className="block space-y-2">
          <span className="label-caps">Vencimento (dia)</span>
          <input
            type="number"
            min={1}
            max={31}
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Button type="submit" variant="primary" className="w-full rounded-lg" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Adicionar cartão'}
      </Button>
    </form>
  )
}
