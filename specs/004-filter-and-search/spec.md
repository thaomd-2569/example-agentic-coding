---
title: Filter and Search Transactions
date: 2026-03-02
status: Draft
---

# Filter and Search Transactions

## Description
This feature enables users to quickly find transactions by searching keywords (in note or category name) and applying multiple filters: type (income/expense), category, and date range. Filters can be combined (AND logic) and results are always sorted newest-first. The UI displays the number of matching results and provides a single button to clear all filters. Filter state is kept in memory or localStorage; the URL does not change.

## Data Schema

Entity: FilterState
  Property     Type      Constraint                  Example
  ──────────── ───────── ─────────────────────────── ──────────────────
  keyword      string    Optional, trims whitespace  "coffee"
  type         string    'income' | 'expense' | ''   "expense"
  categoryId   string    Must match Category.id or '' "cat-food"
  startDate    string    ISO 8601 date or ''         "2026-03-01"
  endDate      string    ISO 8601 date or ''         "2026-03-31"

## User Stories

1. [P1] Search by Keyword
   What  : User enters a keyword to search transactions by note or category name.
   Verify: Enter "coffee" → only transactions with "coffee" in note or category are shown.

2. [P1] Filter by Type, Category, Date Range
   What  : User filters transactions by type, category, and/or date range.
   Verify: Select "expense", "Food", date range → only matching transactions are shown.

3. [P2] Combine Multiple Filters
   What  : User applies multiple filters and search together (AND logic).
   Verify: Enter "lunch", select "income", "Salary", date range → only transactions matching all criteria are shown.

4. [P2] Show Result Count
   What  : UI displays the number of matching transactions.
   Verify: 3 results found → "3 results" shown above the list.

5. [P2] Clear All Filters
   What  : User clicks "Clear All" to reset all filters and search.
   Verify: Click "Clear All" → all filters reset, full transaction list shown.

## Functional Requirements

FR1. Users can search transactions by keyword (matches note or category name, case-insensitive, partial match).
FR2. Users can filter by type (income/expense), category, and date range.
FR3. All filters and search can be combined (AND logic).
FR4. Filtered results are always sorted newest-first (by date, then id).
FR5. UI displays the number of matching results.
FR6. There is a single button to clear all filters and search.
FR7. Filter state is kept in memory or localStorage (not in URL).

## Success Criteria

SC1. Users can find transactions by keyword, type, category, and date range, individually or in combination.
SC2. Results update instantly (within 1 second) as filters/search change.
SC3. Result count is always accurate and visible.
SC4. Clearing all filters restores the full, sorted transaction list.
SC5. Filter state does not affect the URL.

## Acceptance Criteria

- Searching or filtering updates the transaction list and result count instantly.
- All filters/search can be combined; only transactions matching all criteria are shown.
- Results are sorted newest-first (by date, then id).
- "Clear All" resets all filters and search to default state.
- Filter state is not reflected in the URL.
- Works with both empty and large transaction lists.
