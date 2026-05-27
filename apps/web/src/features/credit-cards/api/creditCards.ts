import { getSupabase } from '@/lib/supabase'
import type { CreditCard } from '@erenvault/types'
import type { Database } from '@/types/database'

type CreditCardRow = Database['public']['Tables']['credit_cards']['Row']

function mapCreditCard(row: CreditCardRow): CreditCard {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    limitCents: row.limit_cents,
    balanceCents: row.balance_cents,
    closingDay: row.closing_day,
    dueDay: row.due_day,
    createdAt: row.created_at,
  }
}

export async function fetchCreditCards(userId: string): Promise<CreditCard[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('credit_cards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => mapCreditCard(row as CreditCardRow))
}

export type CreateCreditCardInput = {
  userId: string
  name: string
  limitCents: number
  closingDay: number
  dueDay: number
}

export async function createCreditCard(input: CreateCreditCardInput): Promise<CreditCard> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { data, error } = await supabase
    .from('credit_cards')
    .insert({
      user_id: input.userId,
      name: input.name,
      limit_cents: input.limitCents,
      balance_cents: 0,
      closing_day: input.closingDay,
      due_day: input.dueDay,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapCreditCard(data as CreditCardRow)
}

export async function addToCardBalance(id: string, addCents: number): Promise<CreditCard> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { data: current, error: fetchError } = await supabase
    .from('credit_cards')
    .select('balance_cents')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const row = current as Pick<CreditCardRow, 'balance_cents'>
  const newBalance = row.balance_cents + addCents

  const { data, error } = await supabase
    .from('credit_cards')
    .update({ balance_cents: newBalance })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return mapCreditCard(data as CreditCardRow)
}

export async function deleteCreditCard(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { error } = await supabase.from('credit_cards').delete().eq('id', id)
  if (error) throw error
}

export function getCardUsagePercent(card: CreditCard): number {
  if (card.limitCents <= 0) return 0
  return Math.min(100, Math.round((card.balanceCents / card.limitCents) * 100))
}

export function getAvailableCents(card: CreditCard): number {
  return Math.max(0, card.limitCents - card.balanceCents)
}

export function isCardOverLimit(card: CreditCard): boolean {
  return card.balanceCents > card.limitCents
}

export function computeCardsSummary(cards: CreditCard[]) {
  const totalLimit = cards.reduce((sum, c) => sum + c.limitCents, 0)
  const totalUsed = cards.reduce((sum, c) => sum + c.balanceCents, 0)
  return {
    count: cards.length,
    totalLimitCents: totalLimit,
    totalUsedCents: totalUsed,
    totalAvailableCents: Math.max(0, totalLimit - totalUsed),
  }
}
