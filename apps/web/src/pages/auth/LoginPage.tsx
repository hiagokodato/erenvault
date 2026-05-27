import { Button } from '@erenvault/ui'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ErenMascot } from '@/components/brand/ErenMascot'

export function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between border-r border-border bg-surface p-10 lg:flex">
        <div>
          <p className="label-caps text-primary">ErenVault</p>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-fg">
            Bem-vindo de volta
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Seus dados ficam protegidos e só você acessa sua conta. O Eren cuida do cofre enquanto
            você cuida da vida.
          </p>
        </div>
        <ErenMascot className="mx-auto h-40 w-full max-w-xs opacity-90" />
        <p className="text-xs text-muted">Feito em homenagem ao Eren, nosso gatinho preto.</p>
      </div>

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
          <p className="mt-2 text-sm text-muted">
            Use o e-mail e a senha que você cadastrou. Se ainda não tem conta, em breve será
            possível criar uma aqui.
          </p>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <label className="block space-y-2">
              <span className="label-caps">E-mail</span>
              <input
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block space-y-2">
              <span className="label-caps">Senha</span>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <p className="panel-inset px-4 py-3 text-sm text-muted">
              O login está sendo liberado aos poucos para a família. Se precisar de acesso agora,
              fale comigo — estou preparando tudo com carinho.
            </p>

            <Button variant="primary" className="w-full rounded-lg" disabled>
              Entrar
            </Button>

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
