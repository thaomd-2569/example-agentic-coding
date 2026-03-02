import { useState } from 'react'
import { CATEGORIES } from '../types/transaction'
import { useTransactionStore } from '../store/useTransactionStore'

interface FormValues {
  amount: string
  type: 'income' | 'expense'
  category: string
  date: string
  note: string
}

interface FormErrors {
  amount?: string
  category?: string
  date?: string
  note?: string
}

const todayISO = () => new Date().toISOString().slice(0, 10)

const defaultValues: FormValues = {
  amount: '',
  type: 'expense',
  category: '',
  date: todayISO(),
  note: '',
}

export default function TransactionForm() {
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const [values, setValues] = useState<FormValues>(defaultValues)
  const [errors, setErrors] = useState<FormErrors>({})

  function validate(): FormErrors {
    const errs: FormErrors = {}
    const amount = Number(values.amount)
    if (
      !values.amount ||
      isNaN(amount) ||
      amount <= 0 ||
      !Number.isInteger(amount)
    ) {
      errs.amount = 'Amount must be a positive integer'
    }
    if (!values.category) errs.category = 'Category is required'
    if (!values.date) errs.date = 'Date is required'
    if (values.note && values.note.length > 255)
      errs.note = 'Note must be 255 characters or less'
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    addTransaction({
      amount: Number(values.amount),
      type: values.type,
      category: values.category,
      date: values.date,
      note: values.note || undefined,
    })
    setValues({ ...defaultValues, date: todayISO() })
    setErrors({})
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Add Transaction
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Amount */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <input
              type="number"
              name="amount"
              value={values.amount}
              onChange={handleChange}
              placeholder="50000"
              min="1"
              step="1"
              className="w-full px-3 py-2 text-sm outline-none"
            />
            <span className="flex items-center bg-gray-100 px-3 text-sm text-gray-500">
              ₫
            </span>
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            name="type"
            value={values.type}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={values.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          {errors.date && (
            <p className="mt-1 text-xs text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Note — spans full width on desktop */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Note <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            name="note"
            value={values.note}
            onChange={handleChange}
            rows={2}
            placeholder="Morning coffee, salary…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          {errors.note && (
            <p className="mt-1 text-xs text-red-600">{errors.note}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      >
        Save Transaction
      </button>
    </form>
  )
}
