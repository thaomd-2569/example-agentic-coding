import { Pencil, Trash2 } from 'lucide-react'
import type { Category } from '../types/transaction'

interface CategoryItemProps {
  category: Category
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function CategoryItem({
  category,
  onEdit,
  onDelete,
}: CategoryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Color swatch */}
        <span
          className="h-4 w-4 flex-shrink-0 rounded-full border border-white shadow-sm"
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-gray-800">
          {category.name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(category.id)}
          aria-label={`Edit ${category.name}`}
          className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(category.id)}
          aria-label={`Delete ${category.name}`}
          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
