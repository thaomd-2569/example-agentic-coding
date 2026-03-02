import type { Transaction, Category } from '../types/transaction'

/**
 * Escapes a CSV cell value.
 * - Wraps in double-quotes if the value contains a comma, double-quote, or newline.
 * - Doubles any existing double-quotes inside the value.
 */
function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"'
  }
  return value
}

/**
 * Builds the CSV string content from a list of transactions.
 * Columns: Date, Type, Category, Amount (VND), Note
 */
export function buildCsvContent(
  transactions: Transaction[],
  categories: Category[]
): string {
  const headers = ['Date', 'Type', 'Category', 'Amount (VND)', 'Note']

  const rows = transactions.map((t) => {
    const cat = categories.find((c) => c.id === t.categoryId)
    return [
      escapeCell(t.date),
      escapeCell(t.type),
      escapeCell(cat?.name ?? ''),
      escapeCell(String(t.amount)),
      escapeCell(t.note ?? ''),
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Triggers a browser download of the transaction list as a CSV file.
 * Filename format: transactions_YYYY-MM-DD.csv
 * Uses Blob API — no backend required.
 * BOM prefix (\uFEFF) ensures correct UTF-8 rendering in Excel.
 */
export function exportToCsv(
  transactions: Transaction[],
  categories: Category[]
): void {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const filename = `transactions_${dateStr}.csv`

  const csv = buildCsvContent(transactions, categories)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
