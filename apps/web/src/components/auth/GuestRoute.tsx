import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/useAuth'

export function GuestRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="animate-pulse font-display text-lg text-muted">Um momentinho…</p>
      </div>
    )
  }

  if (session) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
