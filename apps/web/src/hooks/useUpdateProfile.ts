import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateDisplayName } from '@/features/profile/api/profile'
import { useAuth } from '@/features/auth/context/useAuth'

export function useUpdateProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (displayName: string) => {
      if (!user) throw new Error('Usuário não autenticado')
      return updateDisplayName(user.id, displayName)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
    },
  })
}
