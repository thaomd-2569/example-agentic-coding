import { filterTransactions } from './filterTransactions'
import type { Transaction, Category } from '../types/transaction'
import type { FilterState } from '../types/filter'
import { DEFAULT_FILTER } from '../types/filter'

const categories: Category[] = [
  { id: 'cat-food', name: 'Food', color: '#F97316' },
  { id: 'cat-salary', name: 'Salary', color: '#22C55E' },
  { id: 'cat-transport', name: 'Transport', color: '#3B82F6' },
]

const transactions: Transaction[] = [
  { id: '1', amount: 50000, type: 'expense', categoryId: 'cat-food', date: '2026-03-02', note: 'Lunch coffee' },
  { id: '2', amount: 5000000, type: 'income', categoryId: 'cat-salary', date: '2026-03-01', note: 'Monthly salary' },
  { id: '3', amount: 20000, type: 'expense', categoryId: 'cat-transport', date: '2026-02-28', note: 'Bus ticket' },
  { id: '4', amount: 80000, type: 'expense', categoryId: 'cat-food', date: '2026-03-02', note: 'Dinner' },
]

describe('filterTransactions', () => {
  it('returns all transactions sorted newest-first with no filter', () => {
    const result = filterTransactions(transactions, DEFAULT_FILTER, categories)
    expect(result.length).toBe(4)
    expect(result[0].date >= result[1].date).toBe(true)
  })

  it('filters by keyword matching note', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, keyword: 'coffee' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('1')
  })

  it('filters by keyword matching category name', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, keyword: 'food' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(2)
    expect(result.every((t) => t.categoryId === 'cat-food')).toBe(true)
  })

  it('filters by type', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, type: 'income' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(1)
    expect(result[0].type).toBe('income')
  })

  it('filters by categoryId', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, categoryId: 'cat-food' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(2)
  })

  it('filters by date range', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, startDate: '2026-03-01', endDate: '2026-03-02' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(3)
  })

  it('combines multiple filters with AND logic', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, type: 'expense', categoryId: 'cat-food', keyword: 'dinner' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('4')
  })

  it('returns empty array when no transactions match', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, keyword: 'zzznomatch' }
    const result = filterTransactions(transactions, filter, categories)
    expect(result.length).toBe(0)
  })
})
