import type { TransactionType } from '@erenvault/types'

export type ParsedCsvRow = {
  occurredOn: string
  description: string
  amountCents: number
  type: TransactionType
}

export type CsvParseResult = {
  rows: ParsedCsvRow[]
  errors: string[]
  skipped: number
}
