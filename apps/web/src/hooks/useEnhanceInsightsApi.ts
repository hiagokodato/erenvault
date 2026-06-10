import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/features/auth/context/useAuth'
import { fetchEnhanceInsights } from '@/lib/apiClient'

export function useEnhanceInsightsApi() {
  const { session } = useAuth()

  return useMutation({
    mutationFn: () => {
      const token = session?.access_token
      if (!token) throw new Error('Faça login para usar a API.')
      return fetchEnhanceInsights(token)
    },
  })
}
