import { Button } from '@erenvault/ui'
import { ArrowLeft } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel'
import { useAuth } from '@/features/auth/context/useAuth'
import { mapAuthError } from '@/lib/auth-errors'

export function RegisterPage() {
  const navigate = useNavigate()
  const { signUp, isConfigured } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setIsSubmitting(true)

    const { error: authError, needsEmailConfirmation } = await signUp(
      email.trim(),
      password,
      displayName.trim() || email.split('@')[0] || 'Usuário',
    )

    setIsSubmitting(false)

    if (authError) {
      setError(mapAuthError(authError))
      return
    }

    if (needsEmailConfirmation) {
      setSuccess(
        'Enviamos um link de confirmação para o seu e-mail. Depois de confirmar, você já pode entrar.',
      )
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AuthBrandPanel
        title="Criar seu cofre"
        description="Cadastre-se em poucos passos e comece a organizar suas finanças com o Eren."
      />

      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-fg lg:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <p className="label-caps lg:hidden">Cadastro</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-fg lg:mt-0">Criar conta</h2>
          <p className="mt-2 text-sm text-muted">Preencha seus dados para começar.</p>

          {!isConfigured && (
            <p className="panel-inset mt-6 px-4 py-3 text-sm text-muted">
              O cadastro ainda não está disponível neste ambiente.
            </p>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="label-caps">Seu nome</span>
              <input
                type="text"
                autoComplete="name"
                required
                disabled={!isConfigured || isSubmitting}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Como podemos te chamar?"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </label>

            <label className="block space-y-2">
              <span className="label-caps">E-mail</span>
              <input
                type="email"
                autoComplete="email"
                required
                disabled={!isConfigured || isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </label>

            <label className="block space-y-2">
              <span className="label-caps">Senha</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                disabled={!isConfigured || isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </label>

            <label className="block space-y-2">
              <span className="label-caps">Confirmar senha</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                disabled={!isConfigured || isSubmitting}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-fg">
                {success}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-lg"
              disabled={!isConfigured || isSubmitting || Boolean(success)}
            >
              {isSubmitting ? 'Criando…' : 'Criar conta'}
            </Button>

            <p className="text-center text-sm text-muted">
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
