import { Home, LayoutDashboard, LogIn, LogOut, Receipt, Target } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/AuthProvider'

export function AppBottomNav() {
  const { session, signOut } = useAuth()

  const items = session
    ? [
        { to: '/dashboard', label: 'Painel', icon: LayoutDashboard, end: false },
        { to: '/transacoes', label: 'Gastos', icon: Receipt, end: false },
        { to: '/metas', label: 'Metas', icon: Target, end: false },
      ]
    : [
        { to: '/', label: 'Início', icon: Home, end: true },
        { to: '/login', label: 'Entrar', icon: LogIn, end: false },
      ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-surface/95 backdrop-blur-md lg:hidden"
      aria-label="Navegação inferior"
    >
      <ul className="mx-auto flex max-w-lg">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-wider transition ${
                  isActive ? 'text-primary' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`size-5 ${isActive ? 'text-primary' : ''}`} aria-hidden />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
        {session && (
          <li className="flex-1">
            <button
              type="button"
              onClick={() => signOut()}
              className="flex w-full flex-col items-center gap-1 py-3 text-[10px] font-medium uppercase tracking-wider text-muted"
            >
              <LogOut className="size-5" aria-hidden />
              Sair
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
