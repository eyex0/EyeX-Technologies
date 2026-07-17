import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { _value: value, _onValueChange: onValueChange })
        }
        return child
      })}
    </div>
  )
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  return (
    <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1', className)} {...rest}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { _value, _onValueChange })
        }
        return child
      })}
    </div>
  )
}

export function TabsTrigger({ className, value, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
        _value === value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900',
        className,
      )}
      onClick={() => _onValueChange?.(value)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function TabsContent({ className, value, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string; _value?: string; _onValueChange?: (v: string) => void }) {
  const { _value, _onValueChange, ...rest } = props as any
  if (_value !== value) return null
  return <div className={cn('mt-4', className)} {...rest}>{children}</div>
}
