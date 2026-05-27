import { Button } from '@erenvault/ui'
import { LogOut, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useProfile } from '@/hooks/useProfile'

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function DashboardPage() {
  const { user, signOut } = useAuth()
  const { data: profile, isLoading } = useProfile()

  const displayName =
    profile?.displayName ??
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'Amigo'

  return (
    <PageShell width="wide" className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="label-caps">Seu cofre</p>
          <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
            Olá, {isLoading ? '…' : displayName}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Este é o seu painel. Em breve você verá saldo, gastos e metas aqui.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 self-start"
          onClick={() => signOut()}
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-6 sm:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Wallet className="size-5" aria-hidden />
            </span>
            <div>
              <p className="label-caps">Saldo do mês</p>
              <p className="stat-value mt-1">{formatCurrency(0)}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Quando você registrar entradas e saídas, o resumo aparece aqui automaticamente.
          </p>
        </div>

        <div className="panel-inset flex flex-col justify-center p-6 text-center">
          <p className="font-display text-4xl font-light text-primary">0</p>
          <p className="mt-1 text-sm text-muted">lançamentos este mês</p>
        </div>
      </div>

      <section className="panel p-6">
        <h2 className="font-display text-lg font-semibold text-fg">Próximos passos</h2>
        <ul className="mt-4 space-y-3 text-sm text-muted">
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            Registrar suas primeiras transações
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            Criar categorias personalizadas
          </li>
          <li className="flex gap-2">
            <span className="text-primary">•</span>
            Definir metas para economizar
          </li>
        </ul>
        <Link to="/" className="mt-6 inline-block text-sm text-primary hover:underline">
          Voltar à página inicial
        </Link>
      </section>
    </PageShell>
  )
}
