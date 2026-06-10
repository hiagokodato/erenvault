import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createTransaction,
  createTransactionsBulk,
  deleteTransaction,
  fetchRecentTransactions,
  fetchTransactionsForMonth,
  computeMonthlySummary,
  type CreateTransactionInput,
} from '@/features/transactions/api/transactions'
import type { ParsedCsvRow } from '@/features/csv-import/types'
import { transactionKeys } from '@/features/transactions/queryKeys'
import { useAuth } from '@/features/auth/context/useAuth'
import { getCurrentMonthRange, getMonthRangeForYearMonth, getPreviousMonthRangeForYearMonth } from '@/utils/money'

export function useMonthTransactions(yearMonth?: string) {
  const { user } = useAuth()
  const range = yearMonth ? getMonthRangeForYearMonth(yearMonth) : getCurrentMonthRange()

  const query = useQuery({
    queryKey: transactionKeys.month(range.from, range.to),
    enabled: Boolean(user?.id),
    queryFn: () => fetchTransactionsForMonth(user!.id, range.from, range.to),
  })

  return {
    ...query,
    from: range.from,
    to: range.to,
    monthLabel: range.label,
    yearMonth: range.yearMonth,
  }
}

export function usePreviousMonthTransactions(yearMonth: string) {
  const { user } = useAuth()
  const range = getPreviousMonthRangeForYearMonth(yearMonth)

  const query = useQuery({
    queryKey: transactionKeys.month(range.from, range.to),
    enabled: Boolean(user?.id),
    queryFn: () => fetchTransactionsForMonth(user!.id, range.from, range.to),
  })

  return {
    ...query,
    from: range.from,
    to: range.to,
    monthLabel: range.label,
    yearMonth: range.yearMonth,
  }
}

export function useRecentTransactions() {
  const { user } = useAuth()
  const { label } = getCurrentMonthRange()

  const query = useQuery({
    queryKey: transactionKeys.recent(),
    enabled: Boolean(user?.id),
    queryFn: () => fetchRecentTransactions(user!.id),
  })

  return { ...query, monthLabel: label }
}

export function useTransactionMutations(userId: string | undefined) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: transactionKeys.all })
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

  const importCsv = useMutation({
    mutationFn: (rows: ParsedCsvRow[]) => {
      if (!userId) throw new Error('Usuário não autenticado')
      const inputs: CreateTransactionInput[] = rows.map((row) => ({
        userId,
        type: row.type,
        amountCents: row.amountCents,
        description: row.description,
        categoryId: null,
        occurredOn: row.occurredOn,
      }))
      return createTransactionsBulk(inputs)
    },
    onSuccess: invalidate,
  })

  return { create, remove, importCsv }
}

export { computeMonthlySummary }
