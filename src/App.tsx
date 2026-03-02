import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          💸 Transactions
        </h1>
        <TransactionForm />
        <TransactionList />
      </div>
    </div>
  )
}
