import { createBrowserRouter } from 'react-router-dom'

import { GuestRoute } from '@/components/auth/GuestRoute'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { RootLayout } from '@/layouts/RootLayout'
import {
  DashboardPage,
  TransactionsPage,
  GoalsPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  RootErrorPage,
} from '@/routes/lazyPages'

export const router = createBrowserRouter([
  {
    errorElement: <RootErrorPage />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: '/login', element: <LoginPage /> },
              { path: '/cadastro', element: <RegisterPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RootLayout />,
            children: [
              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/transacoes', element: <TransactionsPage /> },
              { path: '/metas', element: <GoalsPage /> },
            ],
          },
        ],
      },
      {
        element: <RootLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
