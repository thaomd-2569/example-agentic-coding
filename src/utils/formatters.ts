// Formatter utilities for Transaction CRUD
import { format, isToday, isYesterday } from 'date-fns'

export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫'
}

export function formatAmount(amount: number, type: 'income' | 'expense') {
  const sign = type === 'income' ? '+' : '-'
  const className = type === 'income' ? 'text-green-600' : 'text-red-600'
  return {
    text: `${sign}${formatVND(amount)}`,
    className,
  }
}

export function formatTransactionDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'dd MMMM')
}
