import { Button } from '@erenvault/ui'
import { type FormEvent, useState } from 'react'

import { CATEGORY_COLOR_PRESETS } from '@/features/categories/categoryColors'
import { ColorSwatches } from '@/features/categories/components/ColorSwatches'

type CategoryFormProps = {
  isSubmitting: boolean
  serverError?: string | null
  onSubmit: (data: { name: string; color: string | null }) => void
}

export function CategoryForm({ isSubmitting, serverError, onSubmit }: CategoryFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState<string>(CATEGORY_COLOR_PRESETS[0])
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = name.trim()
    if (!trimmed) {
      setError('Informe o nome da categoria.')
      return
    }

    onSubmit({ name: trimmed, color })
    setName('')
    setColor(CATEGORY_COLOR_PRESETS[0])
  }

  const message = error ?? serverError

  return (
    <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold text-fg">Nova categoria</h2>

      <label className="block space-y-2">
        <span className="label-caps">Nome</span>
        <input
          type="text"
          placeholder="Ex.: Assinaturas, pets, estudos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
          maxLength={40}
        />
      </label>

      <div className="space-y-2">
        <span className="label-caps">Cor</span>
        <ColorSwatches value={color} onChange={setColor} />
      </div>

      {message && (
        <p className="text-sm text-red-400" role="alert">
          {message}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Criando…' : 'Criar categoria'}
      </Button>
    </form>
  )
}
