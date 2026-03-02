# Implementation Plan: Category Management

**Branch**: `002-category-management` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-category-management/spec.md`
**Depends on**: `001-transaction-crud` (all Phase 1–6 tasks complete ✅)

---

## Summary

This plan adds a fully dynamic Category system on top of the existing Transaction CRUD
feature. Categories are stored as rich objects (`id`, `name`, `color`) in localStorage via
Zustand `persist` middleware. The `Transaction` type is migrated from a plain `category:
string` field to `categoryId: string`, enabling instant name propagation when a category
is renamed (the ID stays stable; the display name is resolved at render time from the live
category store). Eight predefined categories are seeded on first launch. Users can add,
edit, and delete custom categories; deletion is blocked when the category is in use.

---

## Scope Decisions

| Item | Original spec | This plan |
|---|---|---|
| Transaction.category field | `category: string` (name) | Migrated to `categoryId: string` |
| Transaction localStorage | Out of scope (spec 001) | Still out of scope — in-memory only |
| Category localStorage | Required (FR-009) | ✅ In scope — Zustand `persist` |
| Merge categories | Not mentioned | ❌ Out of scope (per Assumptions) |
| Category count limit | Not mentioned | ❌ Out of scope (per Assumptions) |
| Color formats other than `#RRGGBB` | Not mentioned | ❌ Out of scope (per Assumptions) |
| User Story 3 (persistence across reload) | In scope | Only for categories — transactions still reset |

---

## Technical Context

**Language/Version**: TypeScript (ES2022+)
**Framework**: React 18+
**Primary Dependencies**: `zustand` (persist middleware), `lucide-react`, Tailwind CSS v4
**New Dependencies**: none — `zustand/middleware` already bundled
**ID Generation**: `crypto.randomUUID()` — same pattern as spec 001
**Storage**: Zustand `persist` with localStorage for categories; transactions remain in-memory
**Category color**: native `<input type="color">` — sufficient for `#RRGGBB` constraint
**Testing**: Not requested — no test tasks included
**Target Platform**: Browser (static SPA, no backend)

---

## Architecture Decision: `categoryId` Migration

`Transaction.category: string` stores the category **name**, which breaks when a category
is renamed. The clean fix is to store the category **ID** instead:

```
Before (spec 001):  Transaction { ..., category: "Food" }
After  (spec 002):  Transaction { ..., categoryId: "cat-xxx" }
```

At render time, each `TransactionItem` resolves `categoryId → Category.name` from the
live `useCategoryStore`. When a category is renamed, all transaction rows update
immediately without touching the transaction records themselves — satisfying SC-003.

**Impact on existing files**:
- `src/types/transaction.ts` — rename field, add `Category` interface
- `src/store/useTransactionStore.ts` — update seed data + `addTransaction` signature
- `src/components/TransactionForm.tsx` — category select now reads from `useCategoryStore`
- `src/components/TransactionItem.tsx` — resolve `categoryId` via `useCategoryStore`

---

## Constitution Check

| Gate | Status | Notes |
|---|---|---|
| Tailwind CSS v4 utility classes in markup | ✅ PASS | All new components use Tailwind classes |
| No `tailwind.config.js` | ✅ PASS | Only `@theme` in root CSS |
| Custom tokens as CSS variables in `@theme` | ✅ PASS | No new tokens needed |
| `@import "tailwindcss"` in root CSS | ✅ PASS | Already present from spec 001 |
| Named Lucide imports | ✅ PASS | `Pencil`, `Trash2`, `Plus`, `Tag` |
| Component ≤ 200 lines each | ✅ PASS | All components are simple |
| YAGNI — no speculative abstractions | ✅ PASS | No merge, no import/export, no limits |
| Context7 used before implementation | ✅ PASS | All 3 topics researched (see research.md) |

---

## Project Structure

### Documentation (this feature)

```
specs/002-category-management/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0: Context7 findings
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Setup guide
├── contracts/
│   └── ui-contracts.md  # Phase 1: Component + store contracts
└── tasks.md             # Task breakdown
```

### Source Code (new + modified files)

```
src/
├── types/
│   └── transaction.ts              # MODIFIED: add Category interface, rename category→categoryId
├── store/
│   ├── useTransactionStore.ts      # MODIFIED: seed uses categoryId, addTransaction updated
│   └── useCategoryStore.ts         # NEW: Zustand persist store for categories
├── components/
│   ├── TransactionForm.tsx         # MODIFIED: category select from useCategoryStore
│   ├── TransactionItem.tsx         # MODIFIED: resolve categoryId → name via useCategoryStore
│   ├── CategoryList.tsx            # NEW: alphabetical list of categories
│   ├── CategoryItem.tsx            # NEW: single category row (color swatch, Edit, Delete)
│   ├── CategoryForm.tsx            # NEW: add/edit form (name + color picker)
│   └── ConfirmDeleteDialog.tsx     # REUSED from spec 001 (no changes needed)
└── App.tsx                         # MODIFIED: add category management section/tab
```

---

## Phase 0: Research (required before tasks)

See [research.md](./research.md) for full findings. Key decisions:

| Topic | Decision | Rationale |
|---|---|---|
| Zustand `persist` | Single store per entity, separate localStorage keys | Simpler than multi-slice sharing one key |
| ID generation | `crypto.randomUUID()` | Already used in spec 001, zero deps |
| Color picker | Native `<input type="color">` | Outputs `#RRGGBB` directly, zero bundle cost |

---

## Phase 1: Design (required before tasks)

| Artifact | Status | Path |
|---|---|---|
| `research.md` | ✅ Done | [research.md](./research.md) |
| `data-model.md` | ✅ Done | [data-model.md](./data-model.md) |
| `contracts/ui-contracts.md` | ✅ Done | [contracts/ui-contracts.md](./contracts/ui-contracts.md) |
| `quickstart.md` | ✅ Done | [quickstart.md](./quickstart.md) |

---

## Implementation Order (priority)

1. **Types migration** — add `Category` interface, rename `category` → `categoryId` in `Transaction`
2. **Category store** — `useCategoryStore` with `persist`, seed logic, CRUD actions + validation
3. **Transaction store update** — align seed data and `addTransaction` to use `categoryId`
4. **TransactionForm update** — category select reads from `useCategoryStore`
5. **TransactionItem update** — resolve `categoryId → name` via `useCategoryStore`
6. **CategoryItem** — single row: color swatch, name, Edit + Delete buttons
7. **CategoryForm** — add/edit modal: name input + `<input type="color">`, duplicate validation
8. **CategoryList** — alphabetical list of `CategoryItem`, empty state, "Add" trigger
9. **Delete guard** — block deletion when `categoryId` in use by any transaction (inline warning)
10. **App assembly** — add category section to `App.tsx`

---

## Complexity Tracking

| Component / File | Complexity | Notes |
|---|---|---|
| `useCategoryStore` | Medium | `persist` middleware, seed-on-first-launch, duplicate validation, delete guard |
| `CategoryForm` | Medium | Controlled form, duplicate name check (case-insensitive), default color fallback |
| `CategoryList` | Low | Sort + map, empty state |
| `CategoryItem` | Low | Color swatch display, Edit/Delete triggers |
| `TransactionForm` (update) | Low | Swap static array for live `useCategoryStore` read |
| `TransactionItem` (update) | Low | One lookup: `categoryId → category.name` |
| `transaction.ts` (migration) | Low | Field rename + new interface |
| `useTransactionStore` (update) | Low | Seed data `category` → `categoryId` values |
| `ConfirmDeleteDialog` | Trivial | No changes needed — reused as-is |
