import { CATEGORY_COLOR_PRESETS } from '@/features/categories/categoryColors'

type ColorSwatchesProps = {
  value: string
  onChange: (color: string) => void
}

export function ColorSwatches({ value, onChange }: ColorSwatchesProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Cor da categoria">
      {CATEGORY_COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`size-8 rounded-full border-2 transition ${
            value === color ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Cor ${color}`}
          aria-pressed={value === color}
        />
      ))}
    </div>
  )
}
