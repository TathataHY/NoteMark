import { twMerge } from 'tailwind-merge'
import type { ActionButtonProps } from './types'

export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => {
  return (
    <button
      className={twMerge(
        'px-2 py-1 rounded-md border border-zinc-600/50 dark:border-zinc-400/50 hover:bg-zinc-400/50 dark:hover:bg-zinc-600/50  transition-colors duration-100',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
