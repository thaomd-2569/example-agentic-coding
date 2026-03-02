export interface DashboardSummaryProps {
  totalIncome: number
  totalExpense: number
  balance: number
  startDate: string
  endDate: string
}

export type FilterType = 'today' | 'week' | 'month' | 'custom'

export interface FilterBarProps {
  filter: FilterType
  startDate: string
  endDate: string
  onFilterChange: (filter: FilterType) => void
  onDateRangeChange: (start: string, end: string) => void
}

export interface CategoryBreakdown {
  categoryId: string
  amount: number
  name: string
  color: string
}

export interface DailySummary {
  date: string
  income: number
  expense: number
}

export interface DonutChartProps {
  data: CategoryBreakdown[]
}

export interface BarChartProps {
  data: DailySummary[]
}
