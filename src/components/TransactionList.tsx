import { useState } from 'react'
import toast from 'react-hot-toast'
import { Download } from 'lucide-react'
import { useTransactionStore } from '../store/useTransactionStore'
import { useCategoryStore } from '../store/useCategoryStore'
import { filterTransactions } from '../utils/filterTransactions'
import { DEFAULT_FILTER, isFilterActive } from '../types/filter'
import type { FilterState } from '../types/filter'
import { exportToCsv } from '../utils/exportToCsv'
import TransactionItem from './TransactionItem'
import TransactionFilterBar from './TransactionFilterBar'
import EmptyState from './EmptyState'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

export default function TransactionList() {
  const transactions = useTransactionStore((s) => s.transactions)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const categories = useCategoryStore((s) => s.categories)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)

  const filtered = filterTransactions(transactions, filter, categories)
  const hasFilter = isFilterActive(filter)

  function handleExport() {
    exportToCsv(filtered, categories)
    toast.success(
      `Exported ${filtered.length} transaction${filtered.length !== 1 ? 's' : ''} to CSV`
    )
  }

  return (
    <>
      <TransactionFilterBar
        filter={filter}
        categories={categories}
        onChange={setFilter}
        onClear={() => setFilter(DEFAULT_FILTER)}
      />

      {/* Result count + Export button */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {hasFilter
            ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`
            : `${filtered.length} transaction${filtered.length !== 1 ? 's' : ''}`}
        </p>
        <span
          title={filtered.length === 0 ? 'No transactions to export' : undefined}
          className="inline-flex"
        >
          <button
            type="button"
            onClick={handleExport}
            disabled={filtered.length === 0}
            className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              filtered.length === 0
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          hasFilter ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center text-gray-400">
              No transactions match your filters.
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          filtered.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onDelete={setPendingDeleteId}
            />
          ))
        )}
      </div>

      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        onConfirm={() => {
          if (pendingDeleteId) deleteTransaction(pendingDeleteId)
          setPendingDeleteId(null)
        }}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  )
}
