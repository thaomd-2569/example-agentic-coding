import { useState } from 'react'
import { LayoutList, Tag } from 'lucide-react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import CategoryList from './components/CategoryList'

type Page = 'transactions' | 'categories'

const NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'transactions', label: 'Transactions', icon: <LayoutList className="h-4 w-4" /> },
  { id: 'categories', label: 'Categories', icon: <Tag className="h-4 w-4" /> },
]

export default function App() {
  const [page, setPage] = useState<Page>('transactions')

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
      <div className="mx-auto max-w-2xl px-4 py-8">
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
