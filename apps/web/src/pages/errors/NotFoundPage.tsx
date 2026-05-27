import { Button } from '@erenvault/ui'
import { Link } from 'react-router-dom'

import { PageShell } from '@/components/layout/PageShell'

export function NotFoundPage() {
  return (
    <PageShell width="narrow" className="flex min-h-[60vh] flex-col justify-center">
      <p className="font-display text-8xl font-light text-border">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-fg">
        Eren não achou essa página
      </h1>
      <p className="mt-2 text-sm text-muted">
        A rota não existe no cofre. Volte ao painel principal.
      </p>
      <Link to="/" className="mt-8 inline-block">
        <Button variant="primary" className="rounded-lg">
          Ir para o início
        </Button>
      </Link>
    </PageShell>
  )
}
