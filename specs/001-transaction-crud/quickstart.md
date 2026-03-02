# Quickstart: Transaction CRUD

**Branch**: `001-transaction-crud` | **Date**: 2026-03-01

---

## Prerequisites

- Node.js 20+
- npm / pnpm / yarn
- Modern browser (Chrome 92+, Firefox 95+, Safari 15.4+) — required for `crypto.randomUUID()`

---

## Setup

```bash
# 1. Install dependencies (assuming Vite + React project already bootstrapped)
npm install

# 2. Install feature dependencies
npm install zustand date-fns

# 3. Lucide React (icons — already in constitution stack)
npm install lucide-react

# 4. Start dev server
npm run dev
```

---

## Project Structure (this feature)

```
src/
├── store/
│   └── useTransactionStore.ts   # Zustand store (in-memory)
├── types/
│   └── transaction.ts           # Transaction interface + CATEGORIES const
├── utils/
│   └── formatters.ts            # formatVND, formatAmount, formatTransactionDate
├── components/
│   ├── TransactionForm.tsx
│   ├── TransactionList.tsx
│   ├── TransactionItem.tsx
│   ├── ConfirmDeleteDialog.tsx
│   └── EmptyState.tsx
└── app.css                      # @import "tailwindcss" + @theme tokens
```

---

## Tailwind CSS v4 Setup

In `src/app.css` (root CSS file):

```css
@import "tailwindcss";

@theme {
  --color-income: oklch(0.55 0.15 145);   /* green */
  --color-expense: oklch(0.55 0.20 25);   /* red  */
}
```

> ⚠️ Do NOT create `tailwind.config.js` — v4 uses CSS-only configuration.

---

## Scope Boundaries (vs. original spec)

| Item | Status |
|---|---|
| FR-001 Create transaction | ✅ In scope |
| FR-002 Validation errors | ✅ In scope |
| FR-003 Unique ID | ✅ In scope (`crypto.randomUUID()`) |
| FR-004 Sort newest first | ✅ In scope |
| FR-005 Color-coded amounts | ✅ In scope |
| FR-006 VND formatting | ✅ In scope |
| FR-007 Empty state | ✅ In scope |
| FR-008 Delete confirmation | ✅ In scope |
| **FR-009 localStorage persistence** | ❌ **OUT OF SCOPE** — data resets on reload |
| FR-010 Responsive grid layout | ✅ In scope |
| FR-011 ₫ suffix on amount input | ✅ In scope |
| User Story 3 (Persistence after F5) | ❌ **OUT OF SCOPE** |

---

## Key Implementation Notes

1. **Store is in-memory only** — use `create<T>()` with no middleware.
2. **IDs** — `crypto.randomUUID()` directly in the `addTransaction` action.
3. **Sorting** — sort by `date` descending at render time (in `TransactionList`), not in store.
4. **Date display** — use `isToday`, `isYesterday`, `format` from `date-fns` v3.
5. **Icons** — named imports from `lucide-react` only (e.g. `import { Trash2, Plus } from 'lucide-react'`).
