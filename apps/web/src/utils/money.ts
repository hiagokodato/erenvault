export function formatCurrency(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Converte "1.234,56" ou "1234.56" para centavos. */
export function parseBrlToCents(value: string): number | null {
  const cleaned = value.trim().replace(/[^\d,.-]/g, '')
  if (!cleaned) return null

  const normalized = cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned

  const amount = Number.parseFloat(normalized)
  if (Number.isNaN(amount) || amount < 0) return null

  return Math.round(amount * 100)
}

export function getCurrentMonthRange(): { from: string; to: string; label: string } {
  const now = new Date()
  return getMonthRange(now.getFullYear(), now.getMonth())
}

export function getPreviousMonthRange(): { from: string; to: string; label: string } {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return getMonthRange(prev.getFullYear(), prev.getMonth())
}

function getMonthRange(year: number, month: number): { from: string; to: string; label: string } {
  const from = new Date(year, month, 1)
  const to = new Date(year, month + 1, 0)
  const label = from.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return {
    from: toIsoDate(from),
    to: toIsoDate(to),
    label,
  }
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
