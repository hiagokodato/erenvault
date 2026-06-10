import { Calendar } from 'lucide-react'

type MonthPickerProps = {
  value: string
  options: { value: string; label: string }[]
  onChange: (yearMonth: string) => void
  id?: string
}

export function MonthPicker({ value, options, onChange, id = 'month-picker' }: MonthPickerProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Calendar className="size-4 shrink-0 text-muted" aria-hidden />
      <span className="label-caps sr-only sm:not-sr-only">Período</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[10rem] rounded-lg border border-border bg-bg px-3 py-2 capitalize text-fg"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="capitalize">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
