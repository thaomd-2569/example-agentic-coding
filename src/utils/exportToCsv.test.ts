import { describe, it, expect } from 'vitest'
import { buildCsvContent } from './exportToCsv'
import type { Transaction, Category } from '../types/transaction'

const categories: Category[] = [
  { id: 'cat-food', name: 'Food', color: '#F97316' },
  { id: 'cat-salary', name: 'Salary', color: '#22C55E' },
]

const transactions: Transaction[] = [
  { id: '1', amount: 50000, type: 'expense', categoryId: 'cat-food', date: '2026-03-02', note: 'Lunch coffee' },
  { id: '2', amount: 5000000, type: 'income', categoryId: 'cat-salary', date: '2026-03-01', note: '' },
  { id: '3', amount: 20000, type: 'expense', categoryId: 'cat-food', date: '2026-02-28', note: 'Dinner, fast food' },
  { id: '4', amount: 10000, type: 'expense', categoryId: 'cat-food', date: '2026-03-01', note: 'Café "special"' },
]

describe('buildCsvContent', () => {
  it('includes correct header row', () => {
    const csv = buildCsvContent([], categories)
    expect(csv).toBe('Date,Type,Category,Amount (VND),Note')
  })

  it('returns only header when transactions list is empty', () => {
    const csv = buildCsvContent([], categories)
    const lines = csv.split('\n')
    expect(lines.length).toBe(1)
  })

  it('generates correct row for a transaction', () => {
    const csv = buildCsvContent([transactions[0]], categories)
    const lines = csv.split('\n')
    expect(lines.length).toBe(2)
    expect(lines[1]).toBe('2026-03-02,expense,Food,50000,Lunch coffee')
  })

  it('handles empty note correctly', () => {
    const csv = buildCsvContent([transactions[1]], categories)
    const lines = csv.split('\n')
    expect(lines[1]).toBe('2026-03-01,income,Salary,5000000,')
  })

  it('escapes commas in cell values', () => {
    const csv = buildCsvContent([transactions[2]], categories)
    const lines = csv.split('\n')
    expect(lines[1]).toContain('"Dinner, fast food"')
  })

  it('escapes double quotes in cell values', () => {
    const csv = buildCsvContent([transactions[3]], categories)
    const lines = csv.split('\n')
    expect(lines[1]).toContain('"Café ""special"""')
  })

  it('handles unknown category gracefully (empty string)', () => {
    const tx: Transaction = { id: '5', amount: 100, type: 'expense', categoryId: 'cat-unknown', date: '2026-03-01' }
    const csv = buildCsvContent([tx], categories)
    const lines = csv.split('\n')
    // category column should be empty
    expect(lines[1]).toBe('2026-03-01,expense,,100,')
  })

  it('handles missing note (undefined) gracefully', () => {
    const tx: Transaction = { id: '6', amount: 200, type: 'income', categoryId: 'cat-salary', date: '2026-03-02' }
    const csv = buildCsvContent([tx], categories)
    const lines = csv.split('\n')
    expect(lines[1]).toBe('2026-03-02,income,Salary,200,')
  })

  it('exports multiple transactions in order', () => {
    const csv = buildCsvContent(transactions, categories)
    const lines = csv.split('\n')
    expect(lines.length).toBe(5) // 1 header + 4 rows
  })

  it('escapes newlines in cell values', () => {
    const tx: Transaction = { id: '7', amount: 300, type: 'expense', categoryId: 'cat-food', date: '2026-03-02', note: 'line1\nline2' }
    const csv = buildCsvContent([tx], categories)
    expect(csv).toContain('"line1\nline2"')
  })
})
