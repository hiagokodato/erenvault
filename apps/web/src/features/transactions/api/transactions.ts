import { getSupabase } from '@/lib/supabase'
import type { Transaction, TransactionType } from '@erenvault/types'
import type { Database } from '@/types/database'

type TransactionRow = Database['public']['Tables']['transactions']['Row']

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amountCents: row.amount_cents,
    description: row.description,
    categoryId: row.category_id,
    occurredOn: row.occurred_on,
    createdAt: row.created_at,
  }
}

export async function fetchTransactionsForMonth(
  userId: string,
  from: string,
  to: string,
): Promise<Transaction[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('occurred_on', from)
    .lte('occurred_on', to)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => mapTransaction(row as TransactionRow))
}

export type CreateTransactionInput = {
  userId: string
  type: TransactionType
  amountCents: number
  description: string
  categoryId: string | null
  occurredOn: string
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: input.userId,
      type: input.type,
      amount_cents: input.amountCents,
      description: input.description,
      category_id: input.categoryId,
      occurred_on: input.occurredOn,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapTransaction(data as TransactionRow)
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
