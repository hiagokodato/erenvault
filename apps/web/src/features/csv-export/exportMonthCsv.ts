import type { Transaction } from '@erenvault/types'

import type { Category } from '@/features/categories/api/categories'

function escapeCsvCell(value: string): string {
  if (value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatBrlFromCents(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',')
}

export function buildMonthTransactionsCsv(
  transactions: Transaction[],
  categories: Category[],
): string {
  const header = 'Data;Descrição;Tipo;Valor;Categoria'
  const byId = new Map(categories.map((c) => [c.id, c.name]))

  const lines = transactions.map((t) => {
    const date = t.occurredOn.split('-').reverse().join('/')
    const type = t.type === 'income' ? 'Entrada' : 'Saída'
    const value = (t.type === 'income' ? '' : '-') + formatBrlFromCents(t.amountCents)
    const category = t.categoryId ? (byId.get(t.categoryId) ?? '') : ''
    return [
      escapeCsvCell(date),
      escapeCsvCell(t.description),
      escapeCsvCell(type),
      escapeCsvCell(value),
      escapeCsvCell(category),
    ].join(';')
  })

  return [header, ...lines].join('\n')
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
