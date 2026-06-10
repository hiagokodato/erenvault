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

export type MonthRange = {
  from: string
  to: string
  label: string
  yearMonth: string
}

export function getCurrentMonthRange(): MonthRange {
  const now = new Date()
  return getMonthRange(now.getFullYear(), now.getMonth())
}

export function getPreviousMonthRange(): MonthRange {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return getMonthRange(prev.getFullYear(), prev.getMonth())
}

export function getMonthRange(year: number, month: number): MonthRange {
  const from = new Date(year, month, 1)
  const to = new Date(year, month + 1, 0)
  const label = from.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return {
    from: toIsoDate(from),
    to: toIsoDate(to),
    label,
    yearMonth: `${year}-${String(month + 1).padStart(2, '0')}`,
  }
}

/** `yearMonth` no formato `YYYY-MM`. */
export function getMonthRangeForYearMonth(yearMonth: string): MonthRange {
  const match = /^(\d{4})-(\d{2})$/.exec(yearMonth)
  if (!match) return getCurrentMonthRange()

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  if (monthIndex < 0 || monthIndex > 11) return getCurrentMonthRange()

  return getMonthRange(year, monthIndex)
}

export function getPreviousMonthRangeForYearMonth(yearMonth: string): MonthRange {
  const current = getMonthRangeForYearMonth(yearMonth)
  const [year, month] = current.yearMonth.split('-').map(Number)
  const prev = new Date(year, month - 2, 1)
  return getMonthRange(prev.getFullYear(), prev.getMonth())
}

export function buildMonthPickerOptions(monthsBack = 24): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  const now = new Date()

  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const range = getMonthRange(d.getFullYear(), d.getMonth())
    options.push({ value: range.yearMonth, label: range.label })
  }

  return options
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
