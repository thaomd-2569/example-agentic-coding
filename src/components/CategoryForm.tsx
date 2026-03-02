import { useState, useEffect } from 'react'
import type { Category } from '../types/transaction'
import { useCategoryStore } from '../store/useCategoryStore'

interface CategoryFormProps {
  initial?: Category
  onSave: (data: { name: string; color: string }) => void
  onCancel: () => void
}

const DEFAULT_COLOR = '#6B7280'

export default function CategoryForm({
  initial,
  onSave,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [color, setColor] = useState(initial?.color ?? DEFAULT_COLOR)
  const [nameError, setNameError] = useState<string | undefined>()

  const categories = useCategoryStore((s) => s.categories)

  // Sync fields when switching between add/edit modes
  useEffect(() => {
    setName(initial?.name ?? '')
    setColor(initial?.color ?? DEFAULT_COLOR)
    setNameError(undefined)
  }, [initial])

  function validate(value: string): string | undefined {
    const trimmed = value.trim()
    if (!trimmed) return 'Category name is required'
    const isDuplicate = categories.some(
      (c) =>
        c.id !== initial?.id &&
        c.name.trim().toLowerCase() === trimmed.toLowerCase()
    )
    if (isDuplicate) return `"${trimmed}" already exists`
    return undefined
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const error = validate(name)
    if (error) {
      setNameError(error)
      return
    }
    onSave({ name: name.trim(), color })
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
    if (nameError) setNameError(undefined)
  }

  const isEdit = Boolean(initial)

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4"
    >
      <h3 className="text-sm font-semibold text-gray-800">
        {isEdit ? 'Edit Category' : 'Add Category'}
      </h3>

      <div className="flex gap-3">
        {/* Name */}
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Freelance"
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:outline-none ${
              nameError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {nameError && (
            <p className="mt-1 text-xs text-red-600">{nameError}</p>
          )}
        </div>

        {/* Color */}
        <div className="flex flex-col">
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Color
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded-lg border border-gray-300 p-0.5"
            title="Pick a color"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          {isEdit ? 'Save Changes' : 'Add Category'}
        </button>
      </div>
    </form>
  )
}
