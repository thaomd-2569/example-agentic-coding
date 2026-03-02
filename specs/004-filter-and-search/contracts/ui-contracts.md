# UI Contracts — Filter and Search Transactions

## TransactionFilterBarProps
```ts
interface TransactionFilterBarProps {
  filter: FilterState
  categories: Category[]
  onChange: (filter: FilterState) => void
  onClear: () => void
}
```

## TransactionListProps (extended)
```ts
interface TransactionListProps {
  // No new external props needed — filter state is managed internally
}
```

## FilterState (src/types/filter.ts)
```ts
interface FilterState {
  keyword: string               // partial match on note or category name (case-insensitive)
  type: 'income' | 'expense' | ''
  categoryId: string            // '' means all
  startDate: string             // ISO 8601 or ''
  endDate: string               // ISO 8601 or ''
}
```

## Behaviour Contract
- All fields combine with AND logic
- keyword matches note (partial, case-insensitive) OR category name (partial, case-insensitive)
- Results always sorted newest-first (date desc, then id desc)
- Result count shown as "{n} result(s)" above list
- "Clear All" button resets to DEFAULT_FILTER
- Empty state message differs: "No transactions match your filters." vs "No transactions yet."
