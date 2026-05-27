import { ErenMascot } from '@/components/brand/ErenMascot'

type AuthBrandPanelProps = {
  title: string
  description: string
}

export function AuthBrandPanel({ title, description }: AuthBrandPanelProps) {
  return (
    <div className="relative hidden flex-col justify-between border-r border-border bg-surface p-10 lg:flex">
      <div>
        <p className="label-caps text-primary">ErenVault</p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-fg">{title}</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      </div>
      <ErenMascot className="mx-auto h-40 w-full max-w-xs opacity-90" />
      <p className="text-xs text-muted">Feito em homenagem ao Eren, nosso gatinho preto.</p>
    </div>
  )
}
