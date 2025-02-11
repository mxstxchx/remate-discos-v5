import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FilterState {
  artists: string[]
  labels: string[]
  styles: string[]
  view: 'grid' | 'list'
}

interface FilterStore extends FilterState {
  setFilter: (key: keyof Omit<FilterState, 'view'>, values: string[]) => void
  clearFilters: () => void
  setView: (view: 'grid' | 'list') => void
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      artists: [],
      labels: [],
      styles: [],
      view: 'grid',
      setFilter: (key, values) => set((state) => ({ ...state, [key]: values })),
      clearFilters: () => set({ artists: [], labels: [], styles: [] }),
      setView: (view) => set({ view })
    }),
    {
      name: 'filter-storage'
    }
  )
)