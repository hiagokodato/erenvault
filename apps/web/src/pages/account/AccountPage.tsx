import { Button } from '@erenvault/ui'
import { LogOut, MoonStar, Sun } from 'lucide-react'

import { LoadingPanel } from '@/components/skeleton/LoadingPanel'
import { PageShell } from '@/components/layout/PageShell'
import { ProfileSettingsForm } from '@/features/profile/components/ProfileSettingsForm'
import { useAuth } from '@/features/auth/context/useAuth'
import { useThemeMode } from '@/hooks/useThemeMode'
import { useProfile } from '@/hooks/useProfile'
import { useUpdateProfile } from '@/hooks/useUpdateProfile'
import { useThemeStore } from '@/stores/themeStore'

export function AccountPage() {
  const { user, signOut } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()
  const mode = useThemeMode()
  const toggleTheme = useThemeStore((s) => s.toggle)

  const displayName =
    profile?.displayName ??
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    ''

  return (
    <PageShell width="narrow" className="space-y-8">
      <header>
        <p className="label-caps">Configurações</p>
        <h1 className="font-display text-3xl font-semibold text-fg">Minha conta</h1>
        <p className="mt-2 text-sm text-muted">Nome exibido no painel e preferências do app.</p>
      </header>

      {isLoading ? (
        <LoadingPanel rows={2} label="Carregando perfil" />
      ) : (
        <ProfileSettingsForm
          email={user?.email ?? ''}
          initialDisplayName={displayName}
          isSubmitting={updateProfile.isPending}
          saveSuccess={updateProfile.isSuccess}
          onSubmit={(name) => {
            updateProfile.reset()
            updateProfile.mutate(name)
          }}
        />
      )}

      <section className="panel space-y-4 p-6">
        <h2 className="font-display text-lg font-semibold text-fg">Aparência</h2>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
          {mode === 'dark' ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
          {mode === 'dark' ? 'Usar modo claro' : 'Usar modo escuro'}
        </Button>
      </section>

      <section className="panel p-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300"
          onClick={() => signOut()}
        >
          <LogOut className="size-4" />
          Sair da conta
        </Button>
      </section>
    </PageShell>
  )
}
