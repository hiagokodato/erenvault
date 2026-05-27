import { Button } from '@erenvault/ui'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export function RootErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Erro inesperado'

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="label-caps text-primary">Erro</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-fg">
        O Eren tropeçou no caminho
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      <Link to="/" className="mt-8">
        <Button variant="primary" className="rounded-lg">
          Ir para o início
        </Button>
      </Link>
    </div>
  )
}
