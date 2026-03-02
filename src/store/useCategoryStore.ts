import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Category } from '../types/transaction'
import { SEED_CATEGORIES } from '../types/transaction'

interface CategoryState {
  categories: Category[]
  addCategory: (data: Omit<Category, 'id'>) => { error?: string }
  updateCategory: (
    id: string,
    data: Pick<Category, 'name' | 'color'>
  ) => { error?: string }
  deleteCategory: (id: string) => void
}

// Safe localStorage wrapper — catches QuotaExceededError (T012)
const safeLocalStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch (e) {
      console.warn(
        '[CategoryStore] Could not persist categories to localStorage:',
        e
      )
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore
    }
  },
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      // Initial state = SEED_CATEGORIES; Zustand persist only uses this
      // when localStorage has no data for this key (FR-001).
      categories: SEED_CATEGORIES,

      addCategory: (data) => {
        const name = data.name.trim()
        if (!name) return { error: 'Category name is required' }

        const isDuplicate = get().categories.some(
          (c) => c.name.trim().toLowerCase() === name.toLowerCase()
        )
        if (isDuplicate) return { error: `"${name}" already exists` }

        const newCategory: Category = {
          id: crypto.randomUUID(),
          name,
          color: data.color || '#6B7280',
        }
        set((state) => ({
          categories: [...state.categories, newCategory],
        }))
        return {}
      },

      updateCategory: (id, data) => {
        const name = data.name.trim()
        if (!name) return { error: 'Category name is required' }

        const isDuplicate = get().categories.some(
          (c) =>
            c.id !== id && c.name.trim().toLowerCase() === name.toLowerCase()
        )
        if (isDuplicate) return { error: `"${name}" already exists` }

        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, name, color: data.color || c.color } : c
          ),
        }))
        return {}
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }))
      },
    }),
    {
      name: 'categories',
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
)
