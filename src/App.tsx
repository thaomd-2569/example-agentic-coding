import { useState } from 'react'
import { LayoutList, Tag, PieChart as PieIcon } from 'lucide-react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import CategoryList from './components/CategoryList'
import { DashboardSummary } from './components/DashboardSummary'
import { FilterBar } from './components/FilterBar'
import { DonutChart } from './components/DonutChart'
import { DashboardBarChart } from './components/BarChart'
import { useTransactionStore } from './store/useTransactionStore'
import { useCategoryStore } from './store/useCategoryStore'
import { getDashboardSummary, getCategoryBreakdown, getDailySummary } from './utils/dashboardSelectors'


type Page = 'dashboard' | 'transactions' | 'categories'

const NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <PieIcon className="h-4 w-4" /> },
  { id: 'transactions', label: 'Transactions', icon: <LayoutList className="h-4 w-4" /> },
  { id: 'categories', label: 'Categories', icon: <Tag className="h-4 w-4" /> },
]

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  // Dashboard filter state
  const [filter, setFilter] = useState<'today' | 'week' | 'month' | 'custom'>('month')
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const transactions = useTransactionStore((s) => s.transactions)
  const categories = useCategoryStore((s) => s.categories)

  // Date range calculation
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  let startDate = today, endDate = today
  if (filter === 'today') {
    startDate = endDate = today
  } else if (filter === 'week') {
    const day = now.getDay() || 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - day + 1)
    startDate = `${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`
    endDate = today
  } else if (filter === 'month') {
    startDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`
    endDate = today
  } else if (filter === 'custom') {
    startDate = customRange.start || today
    endDate = customRange.end || today
  }

  const summary = getDashboardSummary(transactions, startDate, endDate)
  const breakdown = getCategoryBreakdown(transactions, categories, startDate, endDate)
  const daily = getDailySummary(transactions, startDate, endDate)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-1 px-4">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                page === item.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {page === 'dashboard' && (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">📊 Dashboard Overview</h1>
            <FilterBar
              filter={filter}
              startDate={startDate}
              endDate={endDate}
              onFilterChange={setFilter}
              onDateRangeChange={(start, end) => setCustomRange({ start, end })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <DashboardSummary {...summary} />
                <DonutChart data={breakdown} />
              </div>
              <div>
                <DashboardBarChart data={daily} />
              </div>
            </div>
          </>
        )}
        {page === 'transactions' && (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              💸 Transactions
            </h1>
            <TransactionForm />
            <TransactionList />
          </>
        )}
        {page === 'categories' && (
          <>
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
              🏷️ Categories
            </h1>
            <CategoryList />
          </>
        )}
      </div>
    </div>
  )
}
