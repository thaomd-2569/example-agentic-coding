# Tasks: Transaction CRUD

**Input**: Design documents from `/specs/001-transaction-crud/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ui-contracts.md ✅ | quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Scope note**: User Story 3 (localStorage persistence) is OUT OF SCOPE per owner decision.
Active user stories: **US1** (Add), **US2** (View List), **US4** (Delete).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[US1/US2/US4]**: Maps to user story from spec.md

---

## Phase 1: Setup

**Purpose**: Project initialization, dependencies, and Tailwind CSS v4 configuration.

- [X] T001 Bootstrap Vite + React + TypeScript project (`npm create vite@latest` — framework: React, variant: TypeScript)
- [X] T002 Install feature dependencies: `npm install zustand date-fns lucide-react`
- [X] T003 [P] Configure Tailwind CSS v4 in `src/app.css` — add `@import "tailwindcss"` and `@theme { --color-income: oklch(0.55 0.15 145); --color-expense: oklch(0.55 0.20 25); }`
- [X] T004 [P] Configure Prettier with `prettier-plugin-tailwindcss` for canonical class order

**Checkpoint**: Project runs (`npm run dev`), Tailwind classes apply, no errors.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, store, and shared utilities that ALL user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Create `Transaction` interface and `CATEGORIES` const in `src/types/transaction.ts`
- [X] T006 Create Zustand in-memory store in `src/store/useTransactionStore.ts` — state: `transactions: Transaction[]` initialized with `SEED_DATA`; actions: `addTransaction(data: Omit<Transaction, 'id'>)` using `crypto.randomUUID()` for id, `deleteTransaction(id: string)`
- [X] T007 [P] Implement formatter utilities in `src/utils/formatters.ts` — `formatVND(amount)` → `"50,000₫"`, `formatAmount(amount, type)` → `{ text: "+50,000₫", className: "text-green-600" }`, `formatTransactionDate(isoDate)` → `"Today"` / `"Yesterday"` / `"01 March"` using `isToday`, `isYesterday`, `format` from `date-fns`

**Checkpoint**: Types compile, store initialises with seed data, formatters return correct strings.

---

## Phase 3: User Story 1 — Add a New Transaction (Priority: P1) 🎯 MVP

**Goal**: User fills out the form with valid data and the new transaction appears at the top of the list immediately.

**Independent Test**: Fill form (50,000, expense, Food, today) → click Save → transaction appears at top of list with correct values; submitting with empty amount shows inline validation error.

- [X] T008 [US1] Build `TransactionForm` in `src/components/TransactionForm.tsx` — fields: `amount` (number input with fixed "₫" suffix, FR-011), `type` (select: income/expense), `category` (select from CATEGORIES), `date` (date input), `note` (textarea, optional); layout: `grid grid-cols-1 md:grid-cols-2` (FR-010); inline field-level error messages per FR-002 (amount > 0, required fields, note ≤ 255 chars)
- [X] T009 [US1] Wire `TransactionForm` to store in `src/components/TransactionForm.tsx` — call `useTransactionStore.addTransaction` on valid submit; reset all fields to empty after success; block submission and show errors on invalid input

**Checkpoint**: US1 fully functional — form validates, saves to store, resets.

---

## Phase 4: User Story 2 — View Transaction List (Priority: P1)

**Goal**: User sees all transactions sorted newest-first, with VND formatting and green/red color-coding for income/expenses.

**Independent Test**: Store contains 3 transactions with different dates → list renders newest first; expense shows `-50,000₫` in red; income shows `+50,000₫` in green; empty store shows empty state message.

- [X] T010 [P] [US2] Build `EmptyState` in `src/components/EmptyState.tsx` — Lucide icon (e.g. `Receipt`) + message: "You have no transactions yet. Add your first one!" (FR-007)
- [X] T011 [P] [US2] Build `TransactionItem` in `src/components/TransactionItem.tsx` — display: `formatAmount` result with Tailwind color class (`text-green-600` / `text-red-600`), `category`, `formatTransactionDate(date)`; Delete button using `Trash2` icon from `lucide-react`; props: `transaction: Transaction`, `onDelete: (id: string) => void`
- [X] T012 [US2] Build `TransactionList` in `src/components/TransactionList.tsx` — subscribe to `useTransactionStore`; sort `transactions` by `date` descending; render `<TransactionItem>` per item or `<EmptyState>` when list is empty (FR-004, FR-005, FR-006, FR-007)
- [X] T013 [US2] Assemble app in `src/App.tsx` — render `<TransactionForm />` above `<TransactionList />`; apply root layout with Tailwind classes

**Checkpoint**: US1 + US2 both functional — form adds transactions, list displays them sorted with correct formatting.

---

## Phase 5: User Story 4 — Delete a Transaction (Priority: P2)

**Goal**: User clicks Delete, confirms via dialog, and the transaction is removed from the list immediately.

**Independent Test**: Click Delete on a transaction → dialog appears → click Confirm → transaction gone from list; click Cancel → transaction remains.

- [X] T014 [US4] Build `ConfirmDeleteDialog` in `src/components/ConfirmDeleteDialog.tsx` — props: `open: boolean`, `onConfirm: () => void`, `onCancel: () => void`; modal overlay with Confirm and Cancel buttons; not dismissible by clicking outside (FR-008)
- [X] T015 [US4] Wire delete flow in `src/components/TransactionList.tsx` — manage `pendingDeleteId: string | null` state; open `ConfirmDeleteDialog` when `TransactionItem.onDelete` fires; call `useTransactionStore.deleteTransaction(pendingDeleteId)` on Confirm; reset `pendingDeleteId` on Cancel

**Checkpoint**: US1 + US2 + US4 all functional — full CRUD (minus persistence) working end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T016 [P] Verify all Tailwind classes are sorted via Prettier (`npx prettier --write "src/**/*.tsx"`)
- [X] T017 Run quickstart.md validation — `npm install`, `npm run dev`, manually test all acceptance criteria from spec.md US1, US2, US4

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 only
- **Phase 4 (US2)**: Depends on Phase 2 only — can run in parallel with Phase 3
- **Phase 5 (US4)**: Depends on Phase 4 (needs `TransactionList` for dialog wiring)
- **Phase 6 (Polish)**: Depends on all desired stories complete

### User Story Dependencies

- **US1** (Phase 3): Independent after Foundational ✅
- **US2** (Phase 4): Independent after Foundational ✅ — can start in parallel with US1
- **US4** (Phase 5): Depends on US2 (`TransactionList` + `TransactionItem` must exist)

### Within Each Phase

- Foundational T005 → T006 → T007 (T007 is [P] with T006 as they touch different files)
- US1: T008 then T009 (T009 wires T008 to store)
- US2: T010 [P] T011 can start simultaneously → T012 (needs both) → T013

---

## Parallel Opportunities

```bash
# Phase 1 — run together:
T003  Configure Tailwind CSS v4 in src/app.css
T004  Configure Prettier with prettier-plugin-tailwindcss

# Phase 2 — T007 runs alongside T006 (different files):
T006  Create Zustand store in src/store/useTransactionStore.ts
T007  Implement formatters in src/utils/formatters.ts

# Phase 4 — run together:
T010  Build EmptyState in src/components/EmptyState.tsx
T011  Build TransactionItem in src/components/TransactionItem.tsx
```

---

## Implementation Strategy

### MVP Scope (User Stories 1 + 2 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (T005 → T006 + T007)
3. Complete Phase 3: US1 — form with validation
4. Complete Phase 4: US2 — list with sorting + color-coding
5. **STOP and VALIDATE**: Both stories work independently
6. Demo: Add transactions via form, see them in list

### Full Scope (add US4)

7. Complete Phase 5: US4 — delete with confirmation dialog
8. Complete Phase 6: Polish

---

## Summary

| Phase | Tasks | User Story | Parallelizable |
|---|---|---|---|
| Phase 1: Setup | T001–T004 | — | T003, T004 |
| Phase 2: Foundational | T005–T007 | — | T007 |
| Phase 3: US1 Add | T008–T009 | US1 (P1) 🎯 | — |
| Phase 4: US2 View | T010–T013 | US2 (P1) | T010, T011 |
| Phase 5: US4 Delete | T014–T015 | US4 (P2) | — |
| Phase 6: Polish | T016–T017 | — | T016 |
| **Total** | **17 tasks** | 3 stories | 5 parallel groups |
