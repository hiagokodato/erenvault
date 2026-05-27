import { Cat } from 'lucide-react'

import { cn } from '@erenvault/ui'

type ErenLogoProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-8 rounded-lg',
  md: 'size-10 rounded-xl',
  lg: 'size-12 rounded-xl',
}

const iconMap = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
}

export function ErenLogo({ className, size = 'md' }: ErenLogoProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center border border-primary/30 bg-primary/10',
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      <Cat className={cn('text-primary', iconMap[size])} />
    </div>
  )
}
