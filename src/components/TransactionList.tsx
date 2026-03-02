import { useState } from 'react'
import { useTransactionStore } from '../store/useTransactionStore'
import { useCategoryStore } from '../store/useCategoryStore'
import { filterTransactions } from '../utils/filterTransactions'
import { DEFAULT_FILTER, isFilterActive } from '../types/filter'
import type { FilterState } from '../types/filter'
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

  return (
    <>
      <TransactionFilterBar
        filter={filter}
        categories={categories}
        onChange={setFilter}
        onClear={() => setFilter(DEFAULT_FILTER)}
      />

      {/* Result count */}
      <p className="mb-3 text-sm text-gray-500">
        {hasFilter
          ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`
          : `${filtered.length} transaction${filtered.length !== 1 ? 's' : ''}`}
      </p>

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
