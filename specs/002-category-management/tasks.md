# Tasks: Category Management

**Input**: Design documents from `/specs/002-category-management/`
**Prerequisites**: plan.md ✅ | spec.md ✅
**Depends on**: `001-transaction-crud` all tasks complete ✅

**Tests**: Not requested — no test tasks included.

**Scope note**: `Transaction` is migrated from `category: string` (name) to
`categoryId: string` (ID) so that renaming a category propagates instantly to all
transaction rows without touching transaction records (SC-003). Transactions remain
in-memory only; only categories are persisted via Zustand `persist` + localStorage.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete dependencies)
- **[US1/US2/US3/US4]**: Maps to user story from spec.md

---

## Phase 1: Foundational — Types & Data Migration

**Purpose**: Migrate existing types and stores to the `categoryId` model before any new
UI work begins.

**⚠️ CRITICAL**: All phases below depend on this phase. Do NOT start any user story tasks
until T001–T004 are complete and `npx tsc --noEmit` passes.

- [X] T001 Migrate `src/types/transaction.ts` — add `Category` interface `{ id: string; name: string; color: string }`, add `SEED_CATEGORIES` const (8 entries with id/name/color per spec Data Schema), rename `Transaction.category: string` → `Transaction.categoryId: string`, remove old `CATEGORIES` const and `Category` type alias
- [X] T002 Create `src/store/useCategoryStore.ts` — Zustand store with `persist` middleware (localStorage key: `"categories"`); state: `categories: Category[]`; seed logic: initialise with `SEED_CATEGORIES` when persisted state is empty/null (FR-001); actions: `addCategory(data: Omit<Category, 'id'>)` using `crypto.randomUUID()` for id + name trim + duplicate check (case-insensitive, FR-003, FR-004, FR-005), `updateCategory(id: string, data: Pick<Category, 'name' | 'color'>)` with same duplicate check (FR-006), `deleteCategory(id: string)` (FR-007, guard implemented in UI layer)
- [X] T003 Update `src/store/useTransactionStore.ts` — update `SEED_DATA` entries to use `categoryId` values matching the IDs defined in `SEED_CATEGORIES` from `transaction.ts`; update `addTransaction` parameter type so `category` field is replaced by `categoryId: string`
- [X] T004 Update `src/components/TransactionForm.tsx` — replace static `CATEGORIES` array source with `useCategoryStore` selector; update the category `<select>` to render `{ value: cat.id, label: cat.name }` per category from the live store, sorted alphabetically (FR-011); update `onSubmit` payload to pass `categoryId` instead of `category`

**Checkpoint**: `npx tsc --noEmit` passes with zero errors. App renders, existing transaction list still displays (category names resolve to empty string for now — fixed in T005).

---

## Phase 2: User Story 1 — Seed Predefined Categories on First Launch (Priority: P1)

**Goal**: On first app load with empty localStorage, all 8 predefined categories are
present in the category store and available for selection in the transaction form.

**Independent Test**: Open DevTools → Application → clear localStorage → F5 → open
category list → confirm 8 entries (Food, Transport, Entertainment, Health, Shopping,
Education, Salary, Other) with correct colors.

- [X] T005 [US1] Update `src/components/TransactionItem.tsx` — subscribe to `useCategoryStore`; resolve `transaction.categoryId` → `category.name` (fallback: `"Unknown"`); display category name as before; no structural change to the component

**Checkpoint**: US1 complete — transaction list shows correct category names; clearing localStorage and reloading shows 8 seed categories in the form dropdown.

---

## Phase 3: User Story 2 — Create a New Category (Priority: P1)

**Goal**: User fills out the "Add Category" form with a unique name and optional color;
the new category appears immediately in the list and in the transaction form dropdown.

**Independent Test**: Click "Add Category" → enter "Freelance", pick `#FBBF24` → Save →
"Freelance" appears in category list and in the transaction form `<select>`.

- [X] T006 [P] [US2] Build `src/components/CategoryForm.tsx` — props: `initial?: Category` (undefined = add mode, defined = edit mode), `onSave: (data: { name: string; color: string }) => void`, `onCancel: () => void`; fields: `name` (text input, required, trimmed), `color` (`<input type="color">`, default `#6B7280` per FR-004); inline validation: empty name → error message, duplicate name check via `useCategoryStore` (skip own id in edit mode, FR-005); Cancel button resets without saving
- [X] T007 [P] [US2] Build `src/components/CategoryItem.tsx` — props: `category: Category`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`; display: color swatch (small `div` with `backgroundColor: category.color`), category name; action buttons: Edit (`Pencil` icon from lucide-react), Delete (`Trash2` icon); no internal state

**Checkpoint (partial)**: Both components render in isolation without errors.

- [X] T008 [US2] Build `src/components/CategoryList.tsx` — subscribe to `useCategoryStore`; sort categories alphabetically by name (FR-010); render `<CategoryItem>` per category; manage `editingId: string | null` state to show `<CategoryForm>` inline or as overlay when Edit is clicked; manage `addingNew: boolean` to show `<CategoryForm>` when "Add Category" button is clicked; on `CategoryForm.onSave` call `useCategoryStore.addCategory` or `updateCategory`; "Add Category" button uses `Plus` icon from lucide-react; empty state: show message "No categories yet. Add your first one!" when list is empty

**Checkpoint**: US2 complete — user can add a new category, see it in the list and in the transaction form dropdown; duplicate name shows inline error; no-color save assigns default.

---

## Phase 4: User Story 3 — Edit an Existing Category (Priority: P1)

**Goal**: User edits an existing category's name or color; linked transactions display
the new name immediately without a page reload (SC-003).

**Independent Test**: Click Edit on "Other" → change name to "Miscellaneous", color to
`#9CA3AF` → Save → list shows "Miscellaneous"; any transaction tagged with that category
now shows "Miscellaneous" in the transaction list.

- [X] T009 [US3] Wire edit flow in `src/components/CategoryList.tsx` — when `onEdit(id)` fires, set `editingId = id`; render `<CategoryForm initial={categories.find(c => c.id === id)} ... />` in place of or alongside the item; on `CategoryForm.onSave` call `useCategoryStore.updateCategory(editingId, data)` then clear `editingId`; on `CategoryForm.onCancel` clear `editingId` without saving; `TransactionItem` re-renders automatically because it reads from the same store (SC-003 satisfied)

**Checkpoint**: US3 complete — editing a category name updates the list and all transaction rows instantly; Cancel preserves original values; duplicate-name validation blocks save.

---

## Phase 5: User Story 4 — Delete a Category (Priority: P2)

**Goal**: User deletes an unused category after confirming; deletion of an in-use category
is blocked with a descriptive warning.

**Independent Test (safe)**: Add category "Test" → do NOT use in any transaction → Delete
→ Confirm → "Test" gone from list and no longer in dropdown.

**Independent Test (blocked)**: Assign "Food" to a transaction → click Delete on "Food"
→ warning appears, "Food" remains in list.

- [X] T010 [US4] Wire delete flow in `src/components/CategoryList.tsx` — when `onDelete(id)` fires: check if any `useTransactionStore.transactions` have `categoryId === id`; if **in use** → set `blockedDeleteId = id` to show inline warning message (FR-008) with an "OK" dismiss button — do NOT open confirm dialog; if **not in use** → set `pendingDeleteId = id` to open `<ConfirmDeleteDialog>`; on Confirm call `useCategoryStore.deleteCategory(pendingDeleteId)` then clear state; on Cancel clear `pendingDeleteId`

**Checkpoint**: US4 complete — safe delete removes category from list and localStorage; in-use delete shows blocking warning and leaves category intact; Cancel from confirm dialog leaves category unchanged; F5 after delete confirms category is gone.

---

## Phase 6: Integration — App Assembly

**Purpose**: Wire the category management UI into the main app layout.

- [X] T011 Update `src/App.tsx` — add a "Categories" section below the transaction form and above the transaction list; render `<CategoryList />`; import `CategoryList` from `src/components/CategoryList.tsx`; keep existing `<TransactionForm />` and `<TransactionList />` unchanged

**Checkpoint**: Full app renders end-to-end — categories section visible, transaction form uses live category dropdown, transaction list shows correct category names.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T012 [P] Add localStorage error handling in `src/store/useCategoryStore.ts` — wrap the `persist` `storage` calls to catch `QuotaExceededError`; on write failure show a console warning (full toast notification is out of scope for this feature)
- [X] T013 [P] Run `npx prettier --write "src/**/*.{ts,tsx}"` to sort Tailwind classes and enforce code style
- [X] T014 Run full manual validation per spec acceptance criteria — clear localStorage, reload, verify all 8 seed categories; add/edit/delete flows; blocked delete warning; F5 persistence; TypeScript `npx tsc --noEmit` must pass with zero errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Foundational)**: Depends on spec 001 complete — **blocks all phases**
- **Phase 2 (US1)**: Depends on Phase 1 (T001–T004) ✅
- **Phase 3 (US2)**: Depends on Phase 1 (T001–T004) — T006 and T007 can start in parallel
- **Phase 4 (US3)**: Depends on Phase 3 (T008 must exist to wire edit)
- **Phase 5 (US4)**: Depends on Phase 3 (T008 must exist to wire delete)
- **Phase 6 (Integration)**: Depends on Phase 3 complete (CategoryList must exist)
- **Phase 7 (Polish)**: Depends on all desired stories complete

### User Story Dependencies

```
Phase 1 (Foundational T001→T002→T003→T004)
    │
    ├─► Phase 2 (US1: T005) ──────────────────────────────► Phase 6 (T011)
    │                                                               │
    ├─► Phase 3 (US2: T006[P] + T007[P] → T008) ─────────► Phase 6 (T011)
    │       │
    │       ├─► Phase 4 (US3: T009)
    │       │
    │       └─► Phase 5 (US4: T010)
    │
    └─► Phase 7 (Polish: T012[P] + T013[P] → T014)
```

### Within Phase 1 (strict order — each task modifies shared types/stores)

- T001 → T002 → T003 → T004 (sequential — each step depends on previous)

---

## Parallel Opportunities

```bash
# Phase 1 — T002 and T003 touch different files after T001:
T002  Create src/store/useCategoryStore.ts
T003  Update src/store/useTransactionStore.ts   # after T001 types are done

# Phase 3 — T006 and T007 are independent components:
T006  Build src/components/CategoryForm.tsx
T007  Build src/components/CategoryItem.tsx

# Phase 7 — independent polish tasks:
T012  Add localStorage error handling in useCategoryStore.ts
T013  Run Prettier on src/**/*.{ts,tsx}
```

---

## Implementation Strategy

### MVP Scope (User Stories 1 + 2 + 3 — all P1)

1. Complete Phase 1: Foundational migration (T001–T004)
2. Complete Phase 2: US1 seed + TransactionItem fix (T005)
3. Complete Phase 3: US2 create category (T006 + T007 in parallel → T008)
4. Complete Phase 4: US3 edit category (T009)
5. Complete Phase 6: App assembly (T011)
6. **STOP and VALIDATE**: All P1 stories work independently
7. Demo: Seed categories appear on first launch; create/edit custom categories; transaction form uses live list; renamed category propagates to transaction rows

### Full Scope (add US4 — P2 deletion)

8. Complete Phase 5: US4 delete with guard (T010)
9. Complete Phase 7: Polish (T012 + T013 → T014)

---

## Summary

| Phase | Tasks | User Story | Parallelizable |
|---|---|---|---|
| Phase 1: Foundational | T001–T004 | — | T002+T003 after T001 |
| Phase 2: US1 Seed | T005 | US1 (P1) | — |
| Phase 3: US2 Create | T006–T008 | US2 (P1) 🎯 | T006, T007 |
| Phase 4: US3 Edit | T009 | US3 (P1) | — |
| Phase 5: US4 Delete | T010 | US4 (P2) | — |
| Phase 6: Integration | T011 | — | — |
| Phase 7: Polish | T012–T014 | — | T012, T013 |
| **Total** | **14 tasks** | **4 stories** | **5 parallel groups** |
