---
title: Dashboard Overview
date: 2026-03-02
status: Draft
---

# Dashboard Overview

## Description
The dashboard provides users with a visual summary of their financial activity. It displays total income, expense, and balance for a selected time range, with options to filter by Today, This Week, This Month, or a Custom Range. The dashboard includes a Donut Chart showing expense distribution by category and a Bar Chart visualizing income and expense by day within the selected month. Data is sourced from localStorage using the existing Transaction store. The layout is responsive: a single column on mobile and a two-column grid on desktop.

## Data Schema

Entity: DashboardSummary

  Property     Type      Constraint                  Example
  ──────────── ───────── ─────────────────────────── ──────────────────
  totalIncome  number    >= 0                        1200000
  totalExpense number    >= 0                        800000
  balance      number    totalIncome - totalExpense  400000
  startDate    string    ISO 8601 date               "2026-03-01"
  endDate      string    ISO 8601 date               "2026-03-31"

Entity: CategoryBreakdown

  Property     Type      Constraint                  Example
  ──────────── ───────── ─────────────────────────── ──────────────────
  categoryId   string    Must match Category.id      "cat-food"
  amount       number    >= 0                        250000
  name         string    Category name               "Food"
  color        string    Hex color code              "#FF5733"

Entity: DailySummary

  Property     Type      Constraint                  Example
  ──────────── ───────── ─────────────────────────── ──────────────────
  date         string    ISO 8601 date               "2026-03-05"
  income       number    >= 0                        50000
  expense      number    >= 0                        20000

## User Stories

1. [P1] View Dashboard Summary
   What  : User views total income, expense, and balance for a selected time range.
   Verify: Select a filter (e.g., This Month) → dashboard updates totals and charts for that range.

2. [P1] Visualize Expense by Category
   What  : User sees a Donut Chart showing expense distribution by category for the selected range.
   Verify: Change filter to "This Week" → Donut Chart updates to show only expenses in that week, with correct category colors and labels.

3. [P2] Visualize Income/Expense by Day
   What  : User sees a Bar Chart of daily income and expense for the selected month.
   Verify: Select "This Month" → Bar Chart displays a bar for each day, with income and expense values stacked or side-by-side.

4. [P2] Responsive Layout
   What  : Dashboard adapts to device size: 1 column on mobile, 2 columns on desktop.
   Verify: Resize browser window → layout switches between single and two-column grid.

## Functional Requirements

FR1. The dashboard must display total income, expense, and balance for the selected time range.
FR2. Users can filter the dashboard by Today, This Week, This Month, or a Custom Range (date picker).
FR3. The Donut Chart must show expense distribution by category for the selected range, with category names and colors.
FR4. The Bar Chart must show daily income and expense for the selected month, with clear axis labels.
FR5. All data must be read from localStorage using the existing Transaction store (from spec 001).
FR6. The dashboard layout must be responsive: 1 column on mobile, 2 columns on desktop.

## Success Criteria

SC1. Users can view accurate totals for income, expense, and balance for any selected range.
SC2. Changing the filter updates all dashboard data and charts within 1 second.
SC3. Donut Chart correctly reflects expense breakdown by category, with matching colors and labels.
SC4. Bar Chart accurately displays daily income and expense for the selected month.
SC5. Dashboard is fully usable and visually clear on both mobile and desktop devices.

## Acceptance Criteria

- Selecting any filter (Today, This Week, This Month, Custom Range) updates all dashboard data and charts accordingly.
- Donut Chart displays all categories with non-zero expenses for the selected range, with correct color and label.
- Bar Chart shows a bar for each day in the selected month, with income and expense values.
- All calculations are based on transactions loaded from localStorage.
- Layout adapts responsively to screen size.

## Implementation Research

- Chart Library: Use Context7 to research and compare Recharts and Chart.js for React integration, donut and bar chart support, responsiveness, and accessibility. Select the library that best fits project needs and document rationale in the plan.
