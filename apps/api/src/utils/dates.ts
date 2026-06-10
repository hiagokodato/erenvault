export function getMonthRange(year: number, monthIndex: number) {
  const from = new Date(year, monthIndex, 1)
  const to = new Date(year, monthIndex + 1, 0)
  const label = from.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    label,
  }
}

export function getCurrentMonthRange() {
  const now = new Date()
  return getMonthRange(now.getFullYear(), now.getMonth())
}

export function getPreviousMonthRange() {
  const now = new Date()
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return getMonthRange(prev.getFullYear(), prev.getMonth())
}
