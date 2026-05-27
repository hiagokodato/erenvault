import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

/** Login/cadastro em tela cheia — sem sidebar (diferente do app logado e do EasyGo/Framefy). */
export function AuthLayout() {
  return (
    <div className="min-h-dvh bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:ring-1 focus:ring-primary"
      >
        Pular para o conteúdo
      </a>
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center text-muted">Carregando…</div>
        }
      >
        <main id="main">
          <Outlet />
        </main>
      </Suspense>
    </div>
  )
}
