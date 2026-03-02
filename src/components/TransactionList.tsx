import { useState } from 'react'
import { useTransactionStore } from '../store/useTransactionStore'
import TransactionItem from './TransactionItem'
import EmptyState from './EmptyState'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

export default function TransactionList() {
  const transactions = useTransactionStore((s) => s.transactions)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <div className="flex flex-col gap-2">
        {sorted.length === 0 ? (
          <EmptyState />
        ) : (
          sorted.map((tx) => (
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
