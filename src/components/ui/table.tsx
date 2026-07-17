import * as React from 'react'
import { cn } from '@/lib/utils'

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b transition-colors hover:bg-gray-50/50', className)} {...props} />
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return <th className={cn('h-12 px-4 text-left align-middle font-medium text-gray-500', className)} {...props} />
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) {
  return <td className={cn('p-4 align-middle', className)} {...props} />
}
