import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTransaction,
  deleteTransaction,
  fetchTransactionsForMonth,
  type CreateTransactionInput,
} from '@/features/transactions/api/transactions'
import { transactionKeys } from '@/features/transactions/queryKeys'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { getCurrentMonthRange } from '@/utils/money'

export function useMonthTransactions() {
  const { user } = useAuth()
  const { from, to, label } = getCurrentMonthRange()

  const query = useQuery({
    queryKey: transactionKeys.month(from, to),
    enabled: Boolean(user?.id),
    queryFn: () => fetchTransactionsForMonth(user!.id, from, to),
  })

  return { ...query, from, to, monthLabel: label }
}

export function useTransactionMutations(userId: string | undefined) {
  const queryClient = useQueryClient()
  const { from, to } = getCurrentMonthRange()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: transactionKeys.month(from, to) })
  }

  const create = useMutation({
    mutationFn: (input: Omit<CreateTransactionInput, 'userId'>) => {
      if (!userId) throw new Error('Usuário não autenticado')
      return createTransaction({ ...input, userId })
    },
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: invalidate,
  })

  return { create, remove }
}

export function computeMonthlySummary(transactions: { type: string; amountCents: number }[]) {
  let incomeCents = 0
  let expenseCents = 0

  for (const t of transactions) {
    if (t.type === 'income') incomeCents += t.amountCents
    else expenseCents += t.amountCents
  }

  return {
    incomeCents,
    expenseCents,
    balanceCents: incomeCents - expenseCents,
    count: transactions.length,
  }
}
