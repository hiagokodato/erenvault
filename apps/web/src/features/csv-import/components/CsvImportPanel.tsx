import { Button } from '@erenvault/ui'
import { FileUp } from 'lucide-react'
import { useRef, useState } from 'react'

import { parseBankCsv } from '@/features/csv-import/parseCsv'
import type { ParsedCsvRow } from '@/features/csv-import/types'
import { formatCurrency } from '@/utils/money'

type CsvImportPanelProps = {
  isImporting: boolean
  onImport: (rows: ParsedCsvRow[]) => void
}

export function CsvImportPanel({ isImporting, onImport }: CsvImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<ParsedCsvRow[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [skipped, setSkipped] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)

  function handleFileChange(file: File | undefined) {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : ''
      const result = parseBankCsv(text)
      setPreview(result.rows)
      setErrors(result.errors)
      setSkipped(result.skipped)
      setFileName(file.name)
    }
    reader.readAsText(file, 'UTF-8')
  }

  function handleImport() {
    if (preview.length === 0) return
    onImport(preview)
    setPreview([])
    setErrors([])
    setSkipped(0)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <section className="panel space-y-4 p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <FileUp className="size-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold text-fg">Importar CSV</h2>
          <p className="mt-1 text-sm text-muted">
            Extrato com colunas <strong className="font-medium text-fg">Data</strong>,{' '}
            <strong className="font-medium text-fg">Descrição</strong> e{' '}
            <strong className="font-medium text-fg">Valor</strong> (separador ; ou ,).
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="block w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />

      {fileName && (
        <p className="text-xs text-muted">
          Arquivo: {fileName}
          {skipped > 0 && ` · ${skipped} linha(s) ignorada(s)`}
        </p>
      )}

      {errors.map((msg) => (
        <p key={msg} className="text-sm text-red-300">
          {msg}
        </p>
      ))}

      {preview.length > 0 && (
        <>
          <div className="max-h-48 overflow-auto rounded-lg border border-border/60">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-surface text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2">Descrição</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {preview.slice(0, 8).map((row, index) => (
                  <tr key={`${row.occurredOn}-${row.description}-${index}`}>
                    <td className="px-3 py-2 whitespace-nowrap text-muted">
                      {new Date(row.occurredOn + 'T12:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="max-w-[200px] truncate px-3 py-2">{row.description}</td>
                    <td
                      className={`px-3 py-2 text-right whitespace-nowrap ${
                        row.type === 'income' ? 'text-emerald-400' : 'text-fg'
                      }`}
                    >
                      {row.type === 'income' ? '+' : '−'}
                      {formatCurrency(row.amountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.length > 8 && (
            <p className="text-xs text-muted">+ {preview.length - 8} lançamento(s) na prévia</p>
          )}
          <Button
            type="button"
            variant="primary"
            className="w-full rounded-lg sm:w-auto"
            disabled={isImporting}
            onClick={handleImport}
          >
            {isImporting ? 'Importando…' : `Importar ${preview.length} lançamento(s)`}
          </Button>
        </>
      )}
    </section>
  )
}
