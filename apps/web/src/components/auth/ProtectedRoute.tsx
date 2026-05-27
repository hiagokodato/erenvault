import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/useAuth'

export function ProtectedRoute() {
  const { session, isLoading, isConfigured } = useAuth()
  const location = useLocation()

  if (!isConfigured) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="animate-pulse font-display text-lg text-muted">Um momentinho…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
