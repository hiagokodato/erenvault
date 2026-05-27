import { getSupabase } from '@/lib/supabase'
import type { Goal } from '@erenvault/types'
import type { Database } from '@/types/database'

type GoalRow = Database['public']['Tables']['goals']['Row']

function mapGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    targetAmountCents: row.target_amount_cents,
    savedAmountCents: row.saved_amount_cents,
    deadline: row.deadline,
    createdAt: row.created_at,
  }
}

export async function fetchGoals(userId: string): Promise<Goal[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((row) => mapGoal(row as GoalRow))
}

export type CreateGoalInput = {
  userId: string
  title: string
  targetAmountCents: number
  deadline: string | null
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: input.userId,
      title: input.title,
      target_amount_cents: input.targetAmountCents,
      saved_amount_cents: 0,
      deadline: input.deadline,
    })
    .select('*')
    .single()

  if (error) throw error
  return mapGoal(data as GoalRow)
}

export async function addToGoalSaved(id: string, addCents: number): Promise<Goal> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { data: current, error: fetchError } = await supabase
    .from('goals')
    .select('saved_amount_cents')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const row = current as Pick<GoalRow, 'saved_amount_cents'>
  const newSaved = row.saved_amount_cents + addCents

  const { data, error } = await supabase
    .from('goals')
    .update({ saved_amount_cents: newSaved })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return mapGoal(data as GoalRow)
}

export async function deleteGoal(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) throw error
}

export function getGoalProgress(goal: Goal): number {
  if (goal.targetAmountCents <= 0) return 0
  return Math.min(100, Math.round((goal.savedAmountCents / goal.targetAmountCents) * 100))
}

export function isGoalComplete(goal: Goal): boolean {
  return goal.savedAmountCents >= goal.targetAmountCents
}

export function computeGoalsSummary(goals: Goal[]) {
  const total = goals.length
  const completed = goals.filter(isGoalComplete).length
  return { total, completed, inProgress: total - completed }
}
