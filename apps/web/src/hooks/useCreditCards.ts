import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  addToCardBalance,
  createCreditCard,
  deleteCreditCard,
  fetchCreditCards,
  type CreateCreditCardInput,
} from '@/features/credit-cards/api/creditCards'
import { creditCardKeys } from '@/features/credit-cards/queryKeys'
import { useAuth } from '@/features/auth/context/useAuth'

export function useCreditCards() {
  const { user } = useAuth()

  return useQuery({
    queryKey: creditCardKeys.all,
    enabled: Boolean(user?.id),
    queryFn: () => fetchCreditCards(user!.id),
  })
}

export function useCreditCardMutations(userId: string | undefined) {
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: creditCardKeys.all })

  const create = useMutation({
    mutationFn: (input: Omit<CreateCreditCardInput, 'userId'>) => {
      if (!userId) throw new Error('Usuário não autenticado')
      return createCreditCard({ ...input, userId })
    },
    onSuccess: invalidate,
  })

  const addBalance = useMutation({
    mutationFn: ({ id, addCents }: { id: string; addCents: number }) =>
      addToCardBalance(id, addCents),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: deleteCreditCard,
    onSuccess: invalidate,
  })

  return { create, addBalance, remove }
}
