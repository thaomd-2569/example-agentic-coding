# Quickstart: Manual Validation for Dashboard Overview

## Mobile Validation
- Open app on mobile device or resize browser to < 768px width
- Dashboard displays as single column
- All widgets (summary, donut chart, bar chart) stack vertically
- FilterBar is usable and date pickers are accessible
- Charts are readable and interactive

## Desktop Validation
- Open app on desktop or resize browser to ≥ 768px width
- Dashboard displays as two-column grid
- Summary and DonutChart in left column, BarChart in right column
- FilterBar is usable and date pickers are accessible
- Charts are readable and interactive

## Functional Validation
- Change filter (Today, This Week, This Month, Custom Range): all data and charts update within 1 second
- DonutChart shows correct category breakdown, colors, and labels
- BarChart shows correct daily income/expense bars
- Empty states: if no data in range, charts show empty or placeholder

## Accessibility Validation
- Charts have aria-labels and roles for screen readers
- All interactive elements (buttons, date pickers) are keyboard accessible

## Error Handling
- If localStorage is unavailable or corrupted, dashboard still loads with empty state

## Notes
- For best results, test with both seeded and custom transaction/category data
- Validate on multiple browsers (Chrome, Firefox, Safari, Edge)
