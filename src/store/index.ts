import { create } from 'zustand';
import { Release } from '@/types';

interface StoreState {
  cart: Record<string, boolean>;
  filters: {
    artists: string[];
    labels: string[];
    styles: string[];
  };
  view: 'grid' | 'list';
  language: 'en' | 'es';
  setFilter: (type: keyof StoreState['filters'], values: string[]) => void;
  setView: (view: 'grid' | 'list') => void;
  setLanguage: (language: 'en' | 'es') => void;
  addToCart: (releaseId: string) => void;
  removeFromCart: (releaseId: string) => void;
  clearCart: () => void;
}

const useStore = create<StoreState>((set) => ({
  cart: {},
  filters: {
    artists: [],
    labels: [],
    styles: []
  },
  view: typeof window !== 'undefined' 
    ? localStorage.getItem('view') as 'grid' | 'list' || 'grid'
    : 'grid',
  language: 'es',
  setFilter: (type, values) =>
    set((state) => ({
      filters: { ...state.filters, [type]: values }
    })),
  setView: (view) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('view', view);
    }
    set({ view });
  },
  setLanguage: (language) => set({ language }),
  addToCart: (releaseId) =>
    set((state) => ({
      cart: { ...state.cart, [releaseId]: true }
    })),
  removeFromCart: (releaseId) =>
    set((state) => {
      const newCart = { ...state.cart };
      delete newCart[releaseId];
      return { cart: newCart };
    }),
  clearCart: () => set({ cart: {} })
}));

export default useStore;
