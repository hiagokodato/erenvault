import { Button } from '@erenvault/ui'
import { MoonStar, Sun, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ErenLogo } from '@/components/brand/ErenLogo'
import { useAuth } from '@/features/auth/context/useAuth'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useThemeStore } from '@/stores/themeStore'

export function AppMobileHeader() {
  const { session } = useAuth()
  const mode = useThemeMode()
  const toggleTheme = useThemeStore((s) => s.toggle)

  return (
    <header className="flex items-center justify-between border-b border-border/60 bg-surface/95 px-4 py-3 backdrop-blur-md lg:hidden">
      <Link to={session ? '/dashboard' : '/'} className="flex items-center gap-2">
        <ErenLogo size="sm" />
        <span className="font-display text-base text-fg">ErenVault</span>
      </Link>
      <div className="flex items-center gap-1">
        {session && (
          <Link to="/conta" aria-label="Minha conta">
            <Button size="icon" variant="ghost">
              <User className="size-5" />
            </Button>
          </Link>
        )}
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          aria-label={mode === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {mode === 'dark' ? <Sun className="size-5" /> : <MoonStar className="size-5" />}
        </Button>
      </div>
    </header>
  )
}
