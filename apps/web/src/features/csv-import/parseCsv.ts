import type { TransactionType } from '@erenvault/types'

import type { CsvParseResult, ParsedCsvRow } from './types'

const DATE_HEADERS = ['data', 'date', 'data lancamento', 'data do lancamento', 'dt']
const DESC_HEADERS = ['descricao', 'description', 'historico', 'lancamento', 'titulo', 'memo']
const AMOUNT_HEADERS = ['valor', 'value', 'amount', 'montante']
const TYPE_HEADERS = ['tipo', 'type', 'natureza']

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

function detectDelimiter(headerLine: string): string {
  const semicolons = (headerLine.match(/;/g) ?? []).length
  const commas = (headerLine.match(/,/g) ?? []).length
  return semicolons >= commas ? ';' : ','
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (!inQuotes && char === delimiter) {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += char
  }

  cells.push(current.trim())
  return cells
}

function findColumnIndex(headers: string[], candidates: string[]): number {
  const normalized = headers.map(normalizeHeader)
  for (const candidate of candidates) {
    const index = normalized.indexOf(candidate)
    if (index >= 0) return index
  }
  for (let i = 0; i < normalized.length; i++) {
    if (candidates.some((c) => normalized[i]?.includes(c))) return i
  }
  return -1
}

function parseDate(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const br = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(trimmed)
  if (br) {
    const day = br[1].padStart(2, '0')
    const month = br[2].padStart(2, '0')
    return `${br[3]}-${month}-${day}`
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (iso) return trimmed

  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10)
  }

  return null
}

function parseAmountCents(value: string): number | null {
  const trimmed = value.trim().replace(/[R$\s]/gi, '')
  if (!trimmed) return null

  const negative = trimmed.startsWith('-') || trimmed.includes('(')
  const unsigned = trimmed.replace(/[()+-]/g, '')
  const normalized = unsigned.includes(',')
    ? unsigned.replace(/\./g, '').replace(',', '.')
    : unsigned

  const amount = Number.parseFloat(normalized)
  if (Number.isNaN(amount)) return null

  const cents = Math.round(Math.abs(amount) * 100)
  return negative ? -cents : cents
}

function parseType(value: string | undefined, amountCents: number): TransactionType {
  const normalized = value?.trim().toLowerCase() ?? ''
  if (['entrada', 'credito', 'credit', 'income', 'receita'].some((t) => normalized.includes(t))) {
    return 'income'
  }
  if (['saida', 'debito', 'debit', 'expense', 'despesa'].some((t) => normalized.includes(t))) {
    return 'expense'
  }
  return amountCents < 0 ? 'expense' : 'income'
}

export function parseBankCsv(text: string): CsvParseResult {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const errors: string[] = []
  let skipped = 0

  if (lines.length < 2) {
    return { rows: [], errors: ['Arquivo vazio ou sem linhas de dados.'], skipped: 0 }
  }

  const delimiter = detectDelimiter(lines[0])
  const headers = parseCsvLine(lines[0], delimiter)

  const dateIdx = findColumnIndex(headers, DATE_HEADERS)
  const descIdx = findColumnIndex(headers, DESC_HEADERS)
  const amountIdx = findColumnIndex(headers, AMOUNT_HEADERS)
  const typeIdx = findColumnIndex(headers, TYPE_HEADERS)

  if (dateIdx < 0 || descIdx < 0 || amountIdx < 0) {
    return {
      rows: [],
      errors: [
        'Não foi possível identificar as colunas. Use cabeçalhos como: Data, Descrição, Valor.',
      ],
      skipped: 0,
    }
  }

  const rows: ParsedCsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i], delimiter)
    const dateRaw = cells[dateIdx] ?? ''
    const descRaw = cells[descIdx] ?? ''
    const amountRaw = cells[amountIdx] ?? ''

    const occurredOn = parseDate(dateRaw)
    const signedCents = parseAmountCents(amountRaw)
    const description = descRaw.trim()

    if (!occurredOn || signedCents === null || signedCents === 0 || !description) {
      skipped++
      continue
    }

    const type = parseType(typeIdx >= 0 ? cells[typeIdx] : undefined, signedCents)
    const amountCents = Math.abs(signedCents)

    rows.push({ occurredOn, description, amountCents, type })
  }

  if (rows.length === 0 && skipped > 0) {
    errors.push('Nenhuma linha válida encontrada. Confira data, descrição e valor.')
  }

  return { rows, errors, skipped }
}
