import { getSupabase } from '@/lib/supabase'

export async function updateDisplayName(userId: string, displayName: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase não configurado')

  const trimmed = displayName.trim()
  if (!trimmed) throw new Error('Nome não pode ficar vazio.')

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: trimmed,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) throw error
}
