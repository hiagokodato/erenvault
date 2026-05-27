import { lazy } from 'react'

export const HomePage = lazy(() =>
  import('@/pages/home/HomePage').then((m) => ({ default: m.HomePage })),
)
export const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
export const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
export const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
export const TransactionsPage = lazy(() =>
  import('@/pages/transactions/TransactionsPage').then((m) => ({ default: m.TransactionsPage })),
)
export const NotFoundPage = lazy(() =>
  import('@/pages/errors/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)
export const RootErrorPage = lazy(() =>
  import('@/pages/errors/RootErrorPage').then((m) => ({ default: m.RootErrorPage })),
)
