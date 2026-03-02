import { Trash2 } from 'lucide-react'
import type { Transaction } from '../types/transaction'
import { useCategoryStore } from '../store/useCategoryStore'
import { formatAmount, formatTransactionDate } from '../utils/formatters'

interface TransactionItemProps {
  transaction: Transaction
  onDelete: (id: string) => void
}

export default function TransactionItem({
  transaction,
  onDelete,
}: TransactionItemProps) {
  const { text, className } = formatAmount(transaction.amount, transaction.type)
  const categories = useCategoryStore((s) => s.categories)
  const category = categories.find((c) => c.id === transaction.categoryId)
  const categoryName = category?.name ?? 'Unknown'

  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-800">
          {categoryName}
        </span>
        <span className="text-xs text-gray-400">
          {formatTransactionDate(transaction.date)}
        </span>
        {transaction.note && (
          <span className="text-xs text-gray-400">{transaction.note}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${className}`}>{text}</span>
        <button
          onClick={() => onDelete(transaction.id)}
          aria-label="Delete transaction"
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
