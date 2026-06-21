import { parseBrlToCents } from '@/utils/money'

/** Converte input de orçamento: vazio = sem limite. */
export function parseMonthlyBudgetInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const cents = parseBrlToCents(trimmed)
  if (cents === null || cents <= 0) {
    throw new Error('Informe um orçamento válido ou deixe em branco.')
  }

  return cents
}
