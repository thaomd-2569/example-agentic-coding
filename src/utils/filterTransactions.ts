import type { Transaction, Category } from '../types/transaction'
import type { FilterState } from '../types/filter'

export function filterTransactions(
  transactions: Transaction[],
  filter: FilterState,
  categories: Category[]
): Transaction[] {
  const keyword = filter.keyword.trim().toLowerCase()

  return [...transactions]
    .filter((t) => {
      // Keyword: match note or category name (case-insensitive, partial)
      if (keyword) {
        const cat = categories.find((c) => c.id === t.categoryId)
        const noteMatch = t.note?.toLowerCase().includes(keyword) ?? false
        const catMatch = cat?.name.toLowerCase().includes(keyword) ?? false
        if (!noteMatch && !catMatch) return false
      }
      // Type filter
      if (filter.type && t.type !== filter.type) return false
      // Category filter
      if (filter.categoryId && t.categoryId !== filter.categoryId) return false
      // Date range filter
      if (filter.startDate && t.date < filter.startDate) return false
      if (filter.endDate && t.date > filter.endDate) return false
      return true
    })
    // Sort newest-first by date then id
    .sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date)
      return dateCmp !== 0 ? dateCmp : b.id.localeCompare(a.id)
    })
}
