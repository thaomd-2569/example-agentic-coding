export interface FilterState {
  keyword: string
  type: 'income' | 'expense' | ''
  categoryId: string
  startDate: string
  endDate: string
}

export const DEFAULT_FILTER: FilterState = {
  keyword: '',
  type: '',
  categoryId: '',
  startDate: '',
  endDate: '',
}

export function isFilterActive(f: FilterState): boolean {
  return (
    f.keyword.trim() !== '' ||
    f.type !== '' ||
    f.categoryId !== '' ||
    f.startDate !== '' ||
    f.endDate !== ''
  )
}
