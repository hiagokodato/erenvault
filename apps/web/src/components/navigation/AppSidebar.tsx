import { Button } from '@erenvault/ui'
import {
  CreditCard,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  MoonStar,
  PieChart,
  Receipt,
  Sparkles,
  Tags,
  Sun,
  Target,
  User,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { ErenLogo } from '@/components/brand/ErenLogo'
import { useAuth } from '@/features/auth/context/useAuth'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useThemeStore } from '@/stores/themeStore'

export function AppSidebar() {
  const mode = useThemeMode()
  const toggleTheme = useThemeStore((s) => s.toggle)
  const { session, signOut } = useAuth()

  const navItems = session
    ? [
        { to: '/dashboard', label: 'Painel', icon: LayoutDashboard, end: false },
        { to: '/transacoes', label: 'Transações', icon: Receipt, end: false },
        { to: '/categorias', label: 'Categorias', icon: Tags, end: false },
        { to: '/metas', label: 'Metas', icon: Target, end: false },
        { to: '/cartoes', label: 'Cartões', icon: CreditCard, end: false },
        { to: '/insights', label: 'Insights', icon: Sparkles, end: false },
        { to: '/relatorios', label: 'Relatórios', icon: PieChart, end: false },
        { to: '/conta', label: 'Conta', icon: User, end: false },
        { to: '/', label: 'Início', icon: Home, end: true },
      ]
    : [{ to: '/', label: 'Início', icon: Home, end: true }]

  return (
    <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border/60 bg-surface lg:flex">
      <div className="flex h-full flex-col px-4 py-6">
        <Link to={session ? '/dashboard' : '/'} className="mb-8 flex items-center gap-3 px-1">
          <ErenLogo size="sm" />
          <div>
            <p className="font-display text-lg leading-none text-fg">ErenVault</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">Suas finanças</p>
          </div>
        </Link>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Principal">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-primary/12 font-medium text-primary'
                    : 'text-muted hover:bg-fg/5 hover:text-fg'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex size-8 items-center justify-center rounded-md transition ${
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-fg/5 text-muted group-hover:text-fg'
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2 border-t border-border/60 pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 px-3"
            onClick={toggleTheme}
            aria-label={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {mode === 'dark' ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
            {mode === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </Button>
          {session ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 px-3"
              onClick={() => signOut()}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          ) : (
            <Link to="/login" className="block">
              <Button variant="primary" size="sm" className="w-full gap-2">
                <LogIn className="size-4" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
