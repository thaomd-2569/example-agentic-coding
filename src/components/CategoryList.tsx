import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategoryStore } from '../store/useCategoryStore'
import { useTransactionStore } from '../store/useTransactionStore'
import CategoryItem from './CategoryItem'
import CategoryForm from './CategoryForm'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

export default function CategoryList() {
  const rawCategories = useCategoryStore((s) => s.categories)
  const categories = [...rawCategories].sort((a, b) =>
    a.name.localeCompare(b.name)
  )
  const { addCategory, updateCategory, deleteCategory } = useCategoryStore()
  const transactions = useTransactionStore((s) => s.transactions)

  const [addingNew, setAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [blockedDeleteId, setBlockedDeleteId] = useState<string | null>(null)

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleAdd(data: { name: string; color: string }) {
    addCategory(data)
    setAddingNew(false)
  }

  function handleEdit(data: { name: string; color: string }) {
    if (!editingId) return
    updateCategory(editingId, data)
    setEditingId(null)
  }

  function handleDeleteRequest(id: string) {
    // FR-008: block deletion if category is in use by any transaction
    const isInUse = transactions.some((t) => t.categoryId === id)
    if (isInUse) {
      setBlockedDeleteId(id)
    } else {
      setPendingDeleteId(id)
    }
  }

  function handleConfirmDelete() {
    if (pendingDeleteId) deleteCategory(pendingDeleteId)
    setPendingDeleteId(null)
  }

  const blockedCategory = categories.find((c) => c.id === blockedDeleteId)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      {!addingNew && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => {
              setAddingNew(true)
              setEditingId(null)
            }}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Category
          </button>
        </div>
      )}

      {/* Blocked delete warning */}
      {blockedDeleteId && blockedCategory && (
        <div className="mb-3 flex items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>
            <strong>"{blockedCategory.name}"</strong> cannot be deleted because
            it is currently assigned to one or more transactions. Please
            reassign those transactions first.
          </p>
          <button
            onClick={() => setBlockedDeleteId(null)}
            className="flex-shrink-0 font-medium underline hover:no-underline"
          >
            OK
          </button>
        </div>
      )}

      {/* Add form */}
      {addingNew && (
        <div className="mb-3">
          <CategoryForm
            onSave={handleAdd}
            onCancel={() => setAddingNew(false)}
          />
        </div>
      )}

      {/* Category rows */}
      <div className="flex flex-col gap-2">
        {categories.length === 0 && !addingNew ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No categories yet. Add your first one!
          </p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id}>
              {editingId === cat.id ? (
                <CategoryForm
                  initial={cat}
                  onSave={handleEdit}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <CategoryItem
                  category={cat}
                  onEdit={(id) => {
                    setEditingId(id)
                    setAddingNew(false)
                  }}
                  onDelete={handleDeleteRequest}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Safe delete confirmation */}
      <ConfirmDeleteDialog
        open={pendingDeleteId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}
