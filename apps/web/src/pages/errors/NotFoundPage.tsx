import { Button } from '@erenvault/ui'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/layout/PageShell'
import { useAuth } from '@/features/auth/context/useAuth'

export function NotFoundPage() {
  const { session } = useAuth()
  const homeTo = session ? '/dashboard' : '/'
  const homeLabel = session ? 'Ir para o painel' : 'Ir para o início'

  return (
    <PageShell width="narrow" className="flex min-h-[60vh] flex-col justify-center">
      <p className="font-display text-8xl font-light text-border" aria-hidden>
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-fg">
        Eren não achou essa página
      </h1>
      <p className="mt-2 text-sm text-muted">
        A rota não existe no cofre. Volte para uma área segura.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to={homeTo}>
          <Button variant="primary" className="rounded-lg">
            {homeLabel}
          </Button>
        </Link>
        {session && (
          <Link to="/">
            <Button variant="ghost" className="rounded-lg">
              Página inicial
            </Button>
          </Link>
        )}
      </div>
    </PageShell>
  )
}
