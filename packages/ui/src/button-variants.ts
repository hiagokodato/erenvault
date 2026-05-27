import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-fg/10 text-fg ring-1 ring-fg/10 hover:bg-fg/15',
        primary: 'bg-primary text-primary-foreground hover:brightness-110',
        ghost: 'bg-transparent text-fg/80 hover:bg-fg/10',
        accent: 'bg-accent/20 text-accent ring-1 ring-accent/30 hover:bg-accent/30',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)
