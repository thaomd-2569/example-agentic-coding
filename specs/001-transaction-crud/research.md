# Research: Transaction CRUD

**Branch**: `001-transaction-crud` | **Date**: 2026-03-01
**Source**: Context7 (MCP) — all findings reflect current library documentation

---

## Topic 1: Zustand In-Memory State Management

**Decision**: Use `create` from `zustand` **without** any middleware.

**Rationale**:
Data is in-memory only (resets on reload by design). No `persist` middleware is needed. The
store is initialized with hardcoded seed data. This is the simplest pattern and fully aligned
with Principle V (YAGNI) from the constitution.

**Pattern** (from Context7 docs):

```typescript
// src/store/useTransactionStore.ts
import { create } from 'zustand'
import type { Transaction } from '@/types'

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
}

export const useTransactionStore = create<TransactionState>()((set) => ({
  transactions: SEED_DATA,   // hardcoded initial data
  addTransaction: (data) =>
    set((state) => ({
      transactions: [{ ...data, id: crypto.randomUUID() }, ...state.transactions],
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}))
```

**Key notes**:
- Use the curried form `create<T>()((set) => ...)` for TypeScript type safety.
- Actions live inside the store (co-located) — no separate action file needed.
- List is kept pre-sorted (newest first) by prepending new items with spread.
- No `get` needed for add/delete; functional `set` with previous state is sufficient.

**Alternatives considered**:
- `persist` middleware with localStorage — rejected per scope change.
- Separate actions file pattern — rejected per YAGNI; store is small enough.

---

## Topic 2: ID Generation

**Decision**: Use **`crypto.randomUUID()`** (built-in browser API).

**Rationale**:
From Context7 benchmark data:

| Method | Ops/sec |
|---|---|
| `crypto.randomUUID()` | **7,619,041** |
| `nanoid` | 3,693,964 |

`crypto.randomUUID()` is:
- **2x faster** than nanoid
- **Zero bundle cost** — no npm dependency
- Available in all modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+)
- Produces RFC 4122 v4 UUID (universally unique, no collision risk)

**Usage**:
```typescript
const id = crypto.randomUUID()
// => "110e8400-e29b-41d4-a716-446655440000"
```

**Alternatives considered**:
- `nanoid` — 130 bytes gzipped, faster custom alphabets, shorter IDs. Rejected because
  zero-dependency `crypto.randomUUID()` fully satisfies the requirement (Constitution V: YAGNI).
- `shortid` — deprecated, slow (38K ops/sec), rejected.

---

## Topic 3: Date Formatting with date-fns v3

**Decision**: Use **`isToday`**, **`isYesterday`**, and **`format`** from `date-fns` v3.

**Rationale**:
date-fns v3 is fully ESM, tree-shakeable, and has a stable API for the functions we need.

**Pattern**:

```typescript
import { isToday, isYesterday, format } from 'date-fns'

function formatTransactionDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'd MMMM')   // => "01 March"
}
```

**Breaking changes from v2 → v3** (relevant to this project):
- All functions are now **pure ESM** — no CommonJS default exports.
- The `locale` option API is unchanged for `format`, `isToday`, `isYesterday`.
- `format` token `d` still produces day-of-month without leading zero; `do` adds ordinal.
- No changes to `isToday` or `isYesterday` signatures.

**Alternatives considered**:
- `Intl.DateTimeFormat` (built-in) — no `isToday`/`isYesterday` helpers; verbose;
  rejected for added complexity.
- `dayjs` — smaller bundle but requires plugins for same functionality; rejected to
  avoid adding a second date library.
