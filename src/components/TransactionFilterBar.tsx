import { X, Search } from 'lucide-react'
import type { Category } from '../types/transaction'
import { type FilterState, isFilterActive } from '../types/filter'

interface TransactionFilterBarProps {
  filter: FilterState
  categories: Category[]
  onChange: (filter: FilterState) => void
  onClear: () => void
}

export default function TransactionFilterBar({
  filter,
  categories,
  onChange,
  onClear,
}: TransactionFilterBarProps) {
  const active = isFilterActive(filter)

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {/* Keyword search */}
        <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by note or category..."
            value={filter.keyword}
            onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
            className="w-full rounded border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type filter */}
        <select
          value={filter.type}
          onChange={(e) => onChange({ ...filter, type: e.target.value as FilterState['type'] })}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter */}
        <select
          value={filter.categoryId}
          onChange={(e) => onChange({ ...filter, categoryId: e.target.value })}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filter.startDate}
            onChange={(e) => onChange({ ...filter, startDate: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="shrink-0 text-gray-400">–</span>
          <input
            type="date"
            value={filter.endDate}
            onChange={(e) => onChange({ ...filter, endDate: e.target.value })}
            className="w-full rounded border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clear all */}
        {active && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center justify-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}
