import type { ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
  /** Largura máxima do conteúdo — default editorial */
  width?: 'narrow' | 'default' | 'wide'
  className?: string
}

const widthClass = {
  narrow: 'max-w-2xl',
  default: 'max-w-4xl',
  wide: 'max-w-6xl',
}

export function PageShell({ children, width = 'wide', className = '' }: PageShellProps) {
  return (
    <div className={`mx-auto w-full px-5 py-8 sm:px-8 lg:py-10 ${widthClass[width]} ${className}`}>
      {children}
    </div>
  )
}
