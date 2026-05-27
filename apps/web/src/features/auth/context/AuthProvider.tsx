import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import type { AuthContextValue } from '@/features/auth/context/AuthProviderContext'
import { AuthContext } from '@/features/auth/context/AuthProviderContext'
import { getSupabase } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/utils/env'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthContextValue['session']>(null)
  const isConfigured = isSupabaseConfigured()
  const [isLoading, setIsLoading] = useState(() => isConfigured)

  useEffect(() => {
    if (!isConfigured) return

    const supabase = getSupabase()
    if (!supabase) return

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setIsLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [isConfigured])

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) return { error: 'Serviço indisponível no momento.' }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const supabase = getSupabase()
    if (!supabase)
      return { error: 'Serviço indisponível no momento.', needsEmailConfirmation: false }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName.trim() },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    const needsEmailConfirmation = Boolean(data.user && !data.session)

    return {
      error: error?.message ?? null,
      needsEmailConfirmation,
    }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      isConfigured,
      signIn,
      signUp,
      signOut,
    }),
    [session, isLoading, isConfigured, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
