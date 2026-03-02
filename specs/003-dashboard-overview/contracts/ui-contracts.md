# UI Contracts for Dashboard Overview

## DashboardSummaryProps
```ts
interface DashboardSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  startDate: string;
  endDate: string;
}
```

## FilterBarProps
```ts
interface FilterBarProps {
  filter: 'today' | 'week' | 'month' | 'custom';
  startDate: string;
  endDate: string;
  onFilterChange: (filter: 'today' | 'week' | 'month' | 'custom') => void;
  onDateRangeChange: (start: string, end: string) => void;
}
```

## DonutChartProps
```ts
interface DonutChartProps {
  data: CategoryBreakdown[];
}
```

## BarChartProps
```ts
interface BarChartProps {
  data: DailySummary[];
}
```

## Types (from data-model)
```ts
interface CategoryBreakdown {
  categoryId: string;
  amount: number;
  name: string;
  color: string;
}

interface DailySummary {
  date: string;
  income: number;
  expense: number;
}
```

## Notes
- All components are pure and receive data via props.
- FilterBar manages filter state and date range selection.
- Charts are fully controlled and update on prop changes.
