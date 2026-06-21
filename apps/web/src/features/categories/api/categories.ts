import { CATEGORY_COLOR_PRESETS } from '@/features/categories/categoryColors'
import { getSupabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type CategoryRow = Database['public']['Tables']['categories']['Row']

export type Category = {
  id: string
  name: string
  color: string | null
  monthlyBudgetCents: number | null
}

const DEFAULT_CATEGORIES: { name: string; color: string }[] = [
  { name: 'Alimentação', color: CATEGORY_COLOR_PRESETS[0] },
  { name: 'Moradia', color: CATEGORY_COLOR_PRESETS[1] },
  { name: 'Transporte', color: CATEGORY_COLOR_PRESETS[2] },
  { name: 'Lazer', color: CATEGORY_COLOR_PRESETS[3] },
  { name: 'Saúde', color: CATEGORY_COLOR_PRESETS[4] },
  { name: 'Salário', color: CATEGORY_COLOR_PRESETS[5] },
  { name: 'Outros', color: CATEGORY_COLOR_PRESETS[7] },
]

export type CreateCategoryInput = {
  userId: string
  name: string
  color: string | null
  monthlyBudgetCents: number | null
}

export type UpdateCategoryInput = {
  id: string
  name: string
  color: string | null
  monthlyBudgetCents: number | null
}

export function mapCategoryError(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: string }).code)
    if (code === '23505') return 'Já existe uma categoria com esse nome.'
  }
  if (error instanceof Error && error.message) return error.message
  return 'Não foi possível salvar a categoria. Tente novamente.'
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    monthlyBudgetCents: row.monthly_budget_cents,
  }
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, color, monthly_budget_cents')
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

export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const name = input.name.trim()
  if (!name) throw new Error('Informe o nome da categoria.')

  const { data, error } = await supabase
    .from('categories')
    .insert({
      user_id: input.userId,
      name,
      color: input.color,
      monthly_budget_cents: input.monthlyBudgetCents,
    })
    .select('id, name, color, monthly_budget_cents')
    .single()

  if (error) throw error
  return mapCategory(data as CategoryRow)
}

export async function updateCategory(input: UpdateCategoryInput): Promise<Category> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const name = input.name.trim()
  if (!name) throw new Error('Informe o nome da categoria.')

  const { data, error } = await supabase
    .from('categories')
    .update({
      name,
      color: input.color,
      monthly_budget_cents: input.monthlyBudgetCents,
    })
    .eq('id', input.id)
    .select('id, name, color, monthly_budget_cents')
    .single()

  if (error) throw error
  return mapCategory(data as CategoryRow)
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
