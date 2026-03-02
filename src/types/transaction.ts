// Transaction and Category types for Category Management

export interface Category {
  id: string
  name: string
  color: string
}

export const SEED_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Food', color: '#F97316' },
  { id: 'cat-transport', name: 'Transport', color: '#3B82F6' },
  { id: 'cat-entertainment', name: 'Entertainment', color: '#A855F7' },
  { id: 'cat-health', name: 'Health', color: '#EF4444' },
  { id: 'cat-shopping', name: 'Shopping', color: '#EC4899' },
  { id: 'cat-education', name: 'Education', color: '#14B8A6' },
  { id: 'cat-salary', name: 'Salary', color: '#22C55E' },
  { id: 'cat-other', name: 'Other', color: '#6B7280' },
]

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  date: string // ISO 8601: "YYYY-MM-DD"
  note?: string
}
