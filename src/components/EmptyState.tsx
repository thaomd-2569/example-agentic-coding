import { Receipt } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-16 text-center shadow-sm">
      <Receipt className="mb-4 h-12 w-12 text-gray-300" />
      <p className="text-sm text-gray-500">
        You have no transactions yet. Add your first one!
      </p>
    </div>
  )
}
