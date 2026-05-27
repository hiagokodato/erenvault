import { useEffect, useState } from 'react'

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import { useThemeStore } from '@/stores/themeStore'
import { applyThemeClass, getSystemTheme, resolveTheme } from '@/utils/theme'

export function useThemeMode() {
  const preference = useThemeStore((s) => s.preference)
  const [mode, setMode] = useState(() => resolveTheme(preference))

  useIsomorphicLayoutEffect(() => {
    const resolved = resolveTheme(preference)
    setMode(resolved)
    applyThemeClass(resolved)
  }, [preference])

  useEffect(() => {
    if (preference !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const resolved = getSystemTheme()
      setMode(resolved)
      applyThemeClass(resolved)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [preference])

  return mode
}
