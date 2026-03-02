// Transaction interface and CATEGORIES const for Transaction CRUD

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string // ISO 8601: "YYYY-MM-DD"
  note?: string
}

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Bills',
  'Salary',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]
