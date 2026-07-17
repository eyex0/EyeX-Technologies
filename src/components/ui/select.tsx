import * as React from 'react'
import { cn } from '@/lib/utils'

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  return (
    <button
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function SelectValue({ children, placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  return <span>{children ?? placeholder ?? ''}</span>
}

export function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  return (
    <div className={cn('relative z-50 max-h-96 min-w-[8rem] overflow-y-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-md', className)} {...rest}>
      {children}
    </div>
  )
}

export function SelectItem({ className, children, value, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string; _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  const selected = _value === value
  return (
    <div
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
        selected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50',
        className,
      )}
      onClick={() => _onValueChange?.(value)}
      {...rest}
    >
      {children}
    </div>
  )
}