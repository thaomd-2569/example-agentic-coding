# Data Model: Transaction CRUD

**Branch**: `001-transaction-crud` | **Date**: 2026-03-01

---

## Entities

### Transaction

The core data record. Created by user, stored in Zustand in-memory store.

| Field      | TypeScript Type              | Constraint                          | Example            |
|------------|------------------------------|-------------------------------------|--------------------|
| `id`       | `string`                     | UUID v4 via `crypto.randomUUID()`   | `"110e8400-..."`   |
| `amount`   | `number`                     | Integer > 0                         | `50000`            |
| `type`     | `'income' \| 'expense'`      | Required, enum                      | `'expense'`        |
| `category` | `string`                     | Required, non-empty, from CATEGORIES list | `"Food"`     |
| `date`     | `string`                     | ISO 8601 date string (`YYYY-MM-DD`) | `"2026-03-01"`     |
| `note`     | `string \| undefined`        | Optional, max 255 characters        | `"Morning coffee"` |

**TypeScript interface**:
```typescript
export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  date: string          // ISO 8601: "YYYY-MM-DD"
  note?: string
}
```

---

### Category

A predefined classification label. Users select from this list; cannot create custom categories.

```typescript
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

export type Category = typeof CATEGORIES[number]
```

---

## Validation Rules

Derived from FR-001, FR-002, FR-003 and edge cases in spec.

| Field      | Rule                                                                 | Error message                              |
|------------|----------------------------------------------------------------------|--------------------------------------------|
| `amount`   | Required, numeric, > 0, integer (no decimals)                        | "Amount must be a positive number"         |
| `amount`   | If entered with thousands separator (e.g. "50,000") → normalize or reject | "Please enter numbers only (e.g. 50000)" |
| `type`     | Required, must be `'income'` or `'expense'`                          | "Please select a type"                     |
| `category` | Required, must be one of CATEGORIES                                  | "Please select a category"                 |
| `date`     | Required, valid ISO 8601 date, not in the future (TBD)               | "Please select a date"                     |
| `note`     | Optional, max 255 characters                                         | "Note must be 255 characters or less"      |

---

## State Shape (Zustand Store)

```typescript
interface TransactionState {
  // Data
  transactions: Transaction[]

  // Actions
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
}
```

**Derived / computed** (not stored, computed at render time):
- `sortedTransactions` — `transactions` sorted by `date` descending (newest first)
- `isEmpty` — `transactions.length === 0`

---

## State Transitions

```
[Initial State]
  transactions = SEED_DATA (hardcoded)
        │
        ▼
  addTransaction(data)
  ├─ validates data (form-level, before dispatch)
  ├─ generates id = crypto.randomUUID()
  └─ prepends to transactions[]
        │
        ▼
  deleteTransaction(id)
  ├─ requires explicit confirmation (dialog)
  └─ filters out transaction with matching id
```

---

## Seed Data (Initial State)

Hardcoded in the store for development/demo purposes. All items reset on page reload.

```typescript
export const SEED_DATA: Transaction[] = [
  {
    id: crypto.randomUUID(),
    amount: 50000,
    type: 'expense',
    category: 'Food',
    date: '2026-03-01',
    note: 'Morning coffee',
  },
  {
    id: crypto.randomUUID(),
    amount: 5000000,
    type: 'income',
    category: 'Salary',
    date: '2026-02-28',
    note: 'Monthly salary',
  },
  {
    id: crypto.randomUUID(),
    amount: 200000,
    type: 'expense',
    category: 'Transport',
    date: '2026-02-27',
  },
]
```
