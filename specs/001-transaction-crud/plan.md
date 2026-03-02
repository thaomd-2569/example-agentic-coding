# Implementation Plan: Transaction CRUD

**Branch**: `001-transaction-crud` | **Date**: 2026-03-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-transaction-crud/spec.md`

---

## Summary

The system enables users to record daily income and expenses. All state is managed in-memory
via a Zustand store (no backend, no localStorage). Data resets on page reload by design
(FR-009 and User Story 3 are out of scope per owner decision). The UI is a static React SPA
styled with Tailwind CSS v4. Transactions are uniquely identified with `crypto.randomUUID()`,
validated before save, and displayed sorted newest-first with VND formatting and color-coding.

---

## Scope Changes (owner decision — overrides spec)

| Item | Original spec | This plan |
|---|---|---|
| Storage | localStorage | Zustand in-memory only |
| Data after F5 | Persisted | Resets (by design) |
| FR-009 | Required | ❌ Out of scope |
| SC-002 | Required | ❌ Out of scope |
| User Story 3 | P1 | ❌ Out of scope |
| Edge cases: quota / corrupt JSON | Required | ❌ Out of scope |
| Seed data | None | Hardcoded in store |

---

## Technical Context

**Language/Version**: TypeScript (ES2022+)
**Framework**: React 18+
**Primary Dependencies**: `zustand`, `date-fns` v3, `lucide-react`, Tailwind CSS v4
**ID Generation**: `crypto.randomUUID()` — built-in, zero bundle cost
**Storage**: Zustand in-memory (no persist middleware, no localStorage)
**Testing**: NEEDS CLARIFICATION (Jest + React Testing Library assumed)
**Target Platform**: Browser (static SPA, no backend)
**Project Type**: Web application
**Performance Goals**: Transaction appears in list within 1 second of save (SC-001)
**Constraints**:
  - Tailwind CSS v4 utility-first (Constitution I — NON-NEGOTIABLE)
  - Named icon imports from `lucide-react` only (Constitution II)
  - No custom CSS unless utility classes cannot achieve the result
  - No `tailwind.config.js` — CSS-only `@theme` directive
**Scale/Scope**: Single-user, single-device, VND only, per-row deletion only

---

## Constitution Check

*Re-evaluated post-design. All gates PASS.*

| Gate | Status | Notes |
|---|---|---|
| Tailwind CSS v4 utility classes in markup | ✅ PASS | All components use Tailwind classes |
| No `tailwind.config.js` | ✅ PASS | Only `@theme` in root CSS |
| Custom tokens as CSS variables in `@theme` | ✅ PASS | `--color-income`, `--color-expense` defined |
| Custom utilities via `@utility` (not `@layer components`) | ✅ PASS | No shared utilities needed yet |
| `@import "tailwindcss"` in root CSS | ✅ PASS | Defined in quickstart |
| Named Lucide imports | ✅ PASS | `import { Trash2, Plus } from 'lucide-react'` |
| Component ≤ 200 lines each | ✅ PASS | All 5 components are simple |
| YAGNI — no speculative abstractions | ✅ PASS | No persist, no custom ID lib |
| Context7 used before implementation | ✅ PASS | All 3 topics researched (see research.md) |

---

## Project Structure

### Documentation (this feature)

```
specs/001-transaction-crud/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Context7 findings
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup guide
├── contracts/
│   └── ui-contracts.md  # Phase 1: Component + store contracts
└── tasks.md             # Phase 2: Task breakdown (created by /speckit.tasks)
```

### Source Code

```
src/
├── types/
│   └── transaction.ts          # Transaction interface, CATEGORIES const
├── store/
│   └── useTransactionStore.ts  # Zustand store (in-memory, no middleware)
├── utils/
│   └── formatters.ts           # formatVND, formatAmount, formatTransactionDate
├── components/
│   ├── TransactionForm.tsx     # Add-transaction form, responsive grid
│   ├── TransactionList.tsx     # Sorted list, empty state handling
│   ├── TransactionItem.tsx     # Single row, delete trigger
│   ├── ConfirmDeleteDialog.tsx # Confirmation modal
│   └── EmptyState.tsx          # Empty state illustration + message
└── app.css                     # @import "tailwindcss" + @theme tokens
```

---

## Phase 0: Research (complete)

See [research.md](./research.md) for full findings. Summary:

| Topic | Decision | Source |
|---|---|---|
| State management | Zustand `create<T>()` — no middleware | Context7 /pmndrs/zustand |
| ID generation | `crypto.randomUUID()` — 2× faster than nanoid, zero deps | Context7 /ai/nanoid |
| Date formatting | `isToday`, `isYesterday`, `format` from `date-fns` v3 | Context7 /date-fns/date-fns |

---

## Phase 1: Design (complete)

| Artifact | Status | Path |
|---|---|---|
| `research.md` | ✅ Done | [research.md](./research.md) |
| `data-model.md` | ✅ Done | [data-model.md](./data-model.md) |
| `contracts/ui-contracts.md` | ✅ Done | [contracts/ui-contracts.md](./contracts/ui-contracts.md) |
| `quickstart.md` | ✅ Done | [quickstart.md](./quickstart.md) |

---

## Implementation Order (priority)

1. **Types** — `Transaction` interface + `CATEGORIES` (no deps)
2. **Store** — `useTransactionStore` with seed data + `addTransaction` + `deleteTransaction`
3. **Formatters** — `formatVND`, `formatAmount`, `formatTransactionDate`
4. **TransactionForm** — form with validation (P1: FR-001, FR-002, FR-011, FR-010)
5. **TransactionList + TransactionItem** — list display with sorting + color-coding (P1: FR-004, FR-005, FR-006)
6. **EmptyState** — empty state (P1: FR-007)
7. **ConfirmDeleteDialog + delete wiring** — deletion with confirmation (P2: FR-008)
8. **App assembly** — wire all components into App

---

## Complexity Tracking

| Component | Complexity | Notes |
|---|---|---|
| Store | Low | 3 fields, 2 actions, no middleware |
| TransactionForm | Medium | Validation logic, responsive grid, ₫ suffix |
| TransactionList | Low | Sort + map |
| TransactionItem | Low | Display + delete trigger |
| ConfirmDeleteDialog | Low | Two buttons, no business logic |
| EmptyState | Trivial | Static UI |
| Formatters | Low | Pure functions |
