import { Button } from '@erenvault/ui'
import { ArrowLeft } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel'
import { useAuth } from '@/features/auth/context/useAuth'
import { mapAuthError } from '@/lib/auth-errors'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isConfigured } = useAuth()

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: authError } = await signIn(email.trim(), password)

    setIsSubmitting(false)

    if (authError) {
      setError(mapAuthError(authError))
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AuthBrandPanel
        title="Bem-vindo de volta"
        description="Seus dados ficam protegidos e só você acessa sua conta. O Eren cuida do cofre enquanto você cuida da vida."
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
          <p className="label-caps lg:hidden">Acesso</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-fg lg:mt-0">
            Entrar na sua conta
          </h2>
          <p className="mt-2 text-sm text-muted">Use o e-mail e a senha que você cadastrou.</p>

          {!isConfigured && (
            <p className="panel-inset mt-6 px-4 py-3 text-sm text-muted">
              O acesso ainda não está disponível neste ambiente. Entre em contato com quem
              compartilhou o app com você.
            </p>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                required
                disabled={!isConfigured || isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
            </label>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-lg"
              disabled={!isConfigured || isSubmitting}
            >
              {isSubmitting ? 'Entrando…' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-muted">
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="font-medium text-primary hover:underline">
                Criar conta
              </Link>
            </p>

            <p className="text-center text-xs text-muted">
              <Link to="/" className="text-primary hover:underline">
                Voltar ao início
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
