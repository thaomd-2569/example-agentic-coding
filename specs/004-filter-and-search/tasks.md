---
feature: Filter and Search Transactions
---

# Tasks for Filter and Search Transactions

## Phase 1: Design & State
- [x] T001 Define FilterState type and default values in src/types/filter.ts
- [x] T002 Design filter/search UI contracts in specs/004-filter-and-search/contracts/ui-contracts.md

## Phase 2: Filtering Logic
- [x] T003 Implement filter/search selector (AND logic, all criteria) in src/utils/filterTransactions.ts
- [x] T004 [P] Unit test filtering logic with sample data in src/utils/filterTransactions.test.ts

## Phase 3: UI Components
- [x] T005 Build FilterBar component (keyword, type, category, date range, clear all) in src/components/TransactionFilterBar.tsx
- [x] T006 Integrate FilterBar and filter state with TransactionList in src/components/TransactionList.tsx
- [x] T007 Show result count above transaction list in src/components/TransactionList.tsx

## Phase 4: Integration & Polish
- [x] T008 Wire up filter state to UI and selector in src/App.tsx
- [x] T009 Ensure instant updates, correct sorting, and result count in src/App.tsx
- [x] T010 Add error/empty state handling for filtered results in src/components/TransactionList.tsx

## Dependencies
- Phase 2 depends on completion of Phase 1
- Phase 3 depends on completion of Phase 2
- Phase 4 depends on completion of Phase 3

## Parallel Opportunities
- T003 and T004 can be done in parallel
- T005, T006, T007 can be done in parallel after T004

## MVP Scope
- Complete Phases 1–3 (T001–T007) to deliver functional filter/search with result count

## Independent Test Criteria
- Each filter/search criterion can be tested independently
- Combining filters returns only transactions matching all criteria
- Result count is always accurate and visible
- "Clear All" resets all filters and restores full list
