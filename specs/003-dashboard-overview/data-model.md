# Dashboard Data Aggregation Logic

## Overview
Defines selectors and data transformation logic for dashboard metrics, category breakdown, and daily summaries. All selectors operate on the Transaction[] array from the Zustand store (spec 001).

## Selectors

### 1. getDashboardSummary(transactions: Transaction[], startDate: string, endDate: string): DashboardSummary
- Calculates totalIncome, totalExpense, and balance for the given date range (inclusive).
- Filters transactions by date >= startDate && date <= endDate.
- Sums income and expense by type.

### 2. getCategoryBreakdown(transactions: Transaction[], categories: Category[], startDate: string, endDate: string): CategoryBreakdown[]
- Filters transactions by date and type === 'expense'.
- Groups by categoryId, sums amount per category.
- Joins with categories[] for name and color.
- Returns sorted array (descending by amount).

### 3. getDailySummary(transactions: Transaction[], startDate: string, endDate: string): DailySummary[]
- For each day in range, sum income and expense for that day.
- Returns array of { date, income, expense } for charting.

## Example Usage
```ts
const summary = getDashboardSummary(transactions, '2026-03-01', '2026-03-31');
const breakdown = getCategoryBreakdown(transactions, categories, '2026-03-01', '2026-03-31');
const daily = getDailySummary(transactions, '2026-03-01', '2026-03-31');
```

## Notes
- All date comparisons use ISO 8601 strings (YYYY-MM-DD).
- Assumes Transaction and Category types from previous specs.
- Handles empty states (no transactions in range).
- Designed for easy unit testing and memoization.
