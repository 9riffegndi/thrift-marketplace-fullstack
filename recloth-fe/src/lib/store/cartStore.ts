import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  clear: () => void
  count: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addItem: (item) => {
        const exists = get().items.find(i => i.product_id === item.product_id)
        if (!exists) set(state => ({ items: [...state.items, item] }))
      },
      removeItem: (productId) => set(state => ({
        items: state.items.filter(i => i.product_id !== productId)
      })),
      clear: () => set({ items: [] }),
      count: () => get().items.length,
    }),
    { name: 'recloth-cart' }
  )
)
