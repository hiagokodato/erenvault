import { getSupabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type CategoryRow = Database['public']['Tables']['categories']['Row']

export type Category = {
  id: string
  name: string
  color: string | null
}

const DEFAULT_CATEGORIES: { name: string; color: string }[] = [
  { name: 'Alimentação', color: '#f59e0b' },
  { name: 'Moradia', color: '#a78bfa' },
  { name: 'Transporte', color: '#38bdf8' },
  { name: 'Lazer', color: '#f472b6' },
  { name: 'Saúde', color: '#34d399' },
  { name: 'Salário', color: '#4ade80' },
  { name: 'Outros', color: '#94a3b8' },
]

function mapCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, color: row.color }
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, color')
    .eq('user_id', userId)
    .order('name')

  if (error) throw error
  return (data ?? []).map((row) => mapCategory(row as CategoryRow))
}

export async function ensureDefaultCategories(userId: string): Promise<void> {
  const existing = await fetchCategories(userId)
  if (existing.length > 0) return

  const supabase = getSupabase()
  if (!supabase) return

  const rows = DEFAULT_CATEGORIES.map((c) => ({
    user_id: userId,
    name: c.name,
    color: c.color,
  }))

  const { error } = await supabase.from('categories').insert(rows)
  if (error) throw error
}
