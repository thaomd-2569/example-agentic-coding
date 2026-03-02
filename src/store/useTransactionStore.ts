// Zustand store for Transaction CRUD
import { create } from 'zustand'
import type { Transaction } from '../types/transaction'

const SEED_DATA: Transaction[] = [
  {
    id: '1',
    amount: 50000,
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    note: 'Seed: Lunch',
  },
]

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactions: SEED_DATA,
  addTransaction: (data) =>
    set((state) => ({
      transactions: [
        { ...data, id: crypto.randomUUID() },
        ...state.transactions,
      ],
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}))
