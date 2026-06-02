import { Button } from '@erenvault/ui'
import { type FormEvent, useEffect, useState } from 'react'

type ProfileSettingsFormProps = {
  email: string
  initialDisplayName: string
  isSubmitting: boolean
  saveSuccess?: boolean
  onSubmit: (displayName: string) => void
}

export function ProfileSettingsForm({
  email,
  initialDisplayName,
  isSubmitting,
  saveSuccess = false,
  onSubmit,
}: ProfileSettingsFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(initialDisplayName)
  }, [initialDisplayName])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmed = displayName.trim()
    if (!trimmed) {
      setError('Informe como quer ser chamado no app.')
      return
    }

    if (trimmed === initialDisplayName.trim()) {
      setError('Nada mudou — altere o nome para salvar.')
      return
    }

    onSubmit(trimmed)
  }

  return (
    <form className="panel space-y-4 p-6" onSubmit={handleSubmit}>
      <h2 className="font-display text-lg font-semibold text-fg">Seu perfil</h2>

      <label className="block space-y-2">
        <span className="label-caps">E-mail</span>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full cursor-not-allowed rounded-lg border border-border bg-fg/5 px-3 py-2.5 text-sm text-muted"
        />
      </label>

      <label className="block space-y-2">
        <span className="label-caps">Nome de exibição</span>
        <input
          type="text"
          placeholder="Como o Eren te chama no painel"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm"
          autoComplete="name"
        />
      </label>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {saveSuccess && !error && (
        <p className="text-sm text-emerald-400" role="status">
          Perfil atualizado.
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando…' : 'Salvar alterações'}
      </Button>
    </form>
  )
}
