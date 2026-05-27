export type ThemeMode = 'dark' | 'light'
export type ThemePreference = ThemeMode | 'system'

export function getSystemTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(preference: ThemePreference): ThemeMode {
  if (preference === 'system') return getSystemTheme()
  return preference
}

export function applyThemeClass(mode: ThemeMode) {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.classList.add(mode === 'light' ? 'light' : 'dark')
}
