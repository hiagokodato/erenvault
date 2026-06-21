import { getCurrentMonthRange } from '@/utils/money'

export const MONTH_QUERY_PARAM = 'mes'

export function parseYearMonthParam(value: string | null): string | null {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return null
  return value
}

/** Anexa `?mes=AAAA-MM` quando o mês não é o atual. */
export function withMonthQuery(path: string, yearMonth: string | null | undefined): string {
  if (!yearMonth) return path

  const current = getCurrentMonthRange()
  if (yearMonth === current.yearMonth) return path

  const [base, query = ''] = path.split('?')
  const params = new URLSearchParams(query)
  params.set(MONTH_QUERY_PARAM, yearMonth)
  return `${base}?${params.toString()}`
}

export function getYearMonthFromSearch(search: string): string | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  return parseYearMonthParam(params.get(MONTH_QUERY_PARAM))
}
