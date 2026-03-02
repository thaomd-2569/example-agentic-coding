# UI Contracts: Transaction CRUD

**Branch**: `001-transaction-crud` | **Date**: 2026-03-01

This document defines the public interface contracts for UI components. Components
MUST conform to these props shapes. Internal implementation details are not prescribed.

---

## Store Contract

```typescript
// src/store/useTransactionStore.ts

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
}
```

Consumers access the store via React hooks only:
```typescript
const transactions = useTransactionStore((s) => s.transactions)
const addTransaction = useTransactionStore((s) => s.addTransaction)
const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
```

---

## Component Contracts

### `<TransactionList />`

Renders the full list of transactions, sorted newest-first, with empty state.

```typescript
// No props — reads directly from store
interface TransactionListProps {}
```

**Responsibilities**:
- Subscribe to `transactions` from store
- Sort by `date` descending before render
- Render `<TransactionItem>` for each transaction
- Render `<EmptyState>` when `transactions.length === 0`

---

### `<TransactionItem />`

Renders a single transaction row.

```typescript
interface TransactionItemProps {
  transaction: Transaction
  onDelete: (id: string) => void
}
```

**Responsibilities**:
- Display `amount` formatted as VND: `-50,000₫` (expense, red) / `+50,000₫` (income, green)
- Display `category` and formatted `date` (Today / Yesterday / 01 March)
- Show Delete button; invoke `onDelete(id)` on click

---

### `<TransactionForm />`

Add-new-transaction form. 1-column on mobile, 2-column on desktop.

```typescript
// No props — dispatches directly to store on submit
interface TransactionFormProps {}
```

**Field schema**:

| Field      | Input type   | Validation                          |
|------------|--------------|-------------------------------------|
| `amount`   | `number`     | Required, > 0, integer              |
| `type`     | `select`     | Required, `'income'` \| `'expense'` |
| `category` | `select`     | Required, from CATEGORIES           |
| `date`     | `date`       | Required, ISO 8601                  |
| `note`     | `textarea`   | Optional, max 255 chars             |

**Responsibilities**:
- Show inline field-level error messages on invalid submit
- Display "₫" suffix on amount input (FR-011)
- Reset form after successful submit
- Grid layout: `grid-cols-1 md:grid-cols-2`

---

### `<ConfirmDeleteDialog />`

Confirmation modal before deleting a transaction.

```typescript
interface ConfirmDeleteDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}
```

**Responsibilities**:
- Block deletion until user explicitly clicks Confirm
- Cancel closes dialog without deleting

---

### `<EmptyState />`

Shown when no transactions exist.

```typescript
// No props
interface EmptyStateProps {}
```

**Required content**:
- Illustration (SVG or Lucide icon)
- Message: `"You have no transactions yet. Add your first one!"`

---

## Formatting Utilities Contract

```typescript
// src/utils/formatters.ts

/** Format number as VND: 50000 → "50,000₫" */
export function formatVND(amount: number): string

/** Prefix with sign and color class based on type */
export function formatAmount(amount: number, type: 'income' | 'expense'): {
  text: string   // "+50,000₫" or "-50,000₫"
  className: string  // Tailwind class: "text-green-600" or "text-red-600"
}

/** Format ISO date string → "Today", "Yesterday", or "01 March" */
export function formatTransactionDate(isoDate: string): string
```
