import axios from 'axios'
import type {
  ApiResponse, PaginatedData, User, Product, Store, StoreStats, Order,
  CartItem, Address, Wallet, WalletTransaction, Withdrawal, Swap,
  Review, Conversation, Message, Notification, Category, ShippingCost, Banner
} from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('recloth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

import { useAuthStore } from '@/lib/store/authStore'

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register'
      if (!isAuthPage) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      } else {
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(err)
  }
)

// Typed helpers for cleaner calls
export const get = <T>(url: string, params?: Record<string, unknown>) => api.get<ApiResponse<T>>(url, { params })
export const post = <T>(url: string, data?: unknown) => api.post<ApiResponse<T>>(url, data)
export const put = <T>(url: string, data?: unknown) => api.put<ApiResponse<T>>(url, data)
export const patch = <T>(url: string, data?: unknown) => api.patch<ApiResponse<T>>(url, data)
export const del = <T>(url: string) => api.delete<ApiResponse<T>>(url)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
  me: () => api.get<ApiResponse<{ user: User; store: Store | null }>>('/auth/me'),
  forgotPassword: (email: string) => api.post<ApiResponse<{ token: string }>>('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post<ApiResponse<null>>('/auth/reset-password', data),
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () => api.get<ApiResponse<User>>('/profile'),
  update: (data: FormData) => api.post<ApiResponse<User>>('/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    api.put<ApiResponse<null>>('/profile/password', data),
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedData<Product>>>('/products', { params }),
  get: (id: string | number) => api.get<ApiResponse<{ product: Product }>>(`/products/${id}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Product>>('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, data: FormData) =>
    api.post<ApiResponse<Product>>(`/products/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/products/${id}`),
  toggle: (id: number) => api.patch<ApiResponse<Product>>(`/products/${id}/toggle`),
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  list: () => api.get<ApiResponse<Category[]>>('/categories'),
}

// ─── Stores ───────────────────────────────────────────────────────────────────

export const storesApi = {
  get: (slug: string) => api.get<ApiResponse<Store>>(`/stores/${slug}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Store>>('/stores', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (data: FormData) =>
    api.post<ApiResponse<Store>>('/stores?_method=PUT', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  myStats: () => api.get<ApiResponse<Store>>('/stores/my/stats'),
  myDashboard: () => api.get<ApiResponse<StoreStats>>('/stores/my/dashboard'),
  myProducts: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedData<Product>>>('/stores/my/products', { params }),
  getReviews: (slug: string) => api.get<ApiResponse<PaginatedData<Review>>>(`/stores/${slug}/reviews`),
  follow: (slug: string) => api.post<ApiResponse<{ following: boolean }>>(`/stores/${slug}/follow`),
  unfollow: (slug: string) => api.delete<ApiResponse<{ following: boolean }>>(`/stores/${slug}/follow`),
  checkFollow: (slug: string) => api.get<ApiResponse<{ following: boolean }>>(`/stores/${slug}/follow`),
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const cartApi = {
  list: () => api.get<ApiResponse<CartItem[]>>('/cart'),
  add: (product_id: number) => api.post<ApiResponse<null>>('/cart', { product_id }),
  remove: (product_id: number) => api.delete<ApiResponse<null>>(`/cart/${product_id}`),
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export const addressApi = {
  list: () => api.get<ApiResponse<Address[]>>('/addresses'),
  create: (data: Partial<Address>) => api.post<ApiResponse<Address>>('/addresses', data),
  update: (id: number, data: Partial<Address>) => api.put<ApiResponse<Address>>(`/addresses/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/addresses/${id}`),
  setPrimary: (id: number) => api.patch<ApiResponse<Address>>(`/addresses/${id}/primary`),
}

// ─── Shipping ─────────────────────────────────────────────────────────────────
export const shippingApi = {
  cost: (data: { product_id: number; destination_city_id: string; courier: string }) =>
    api.post<ApiResponse<ShippingCost[]>>('/shipping/cost', data),
}

// ─── Promos ───────────────────────────────────────────────────────────────────

export const promoApi = {
  check: (code: string, subtotal: number) =>
    api.post<ApiResponse<{ discount: number; total: number }>>('/promos/check', { code, subtotal }),
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedData<Order>>>('/orders', { params }),
  sellerList: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedData<Order>>>('/orders/seller', { params }),
  get: (id: number) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  checkout: (data: Record<string, unknown>) => api.post<ApiResponse<{ order: Order; payment_url: string }>>('/orders/checkout', data),
  inputResi: (id: number, data: { resi: string; courier_code: string }) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/resi`, data),
  tracking: (id: number) => api.get<ApiResponse<unknown>>(`/orders/${id}/tracking`),
  confirm: (id: number) => api.post<ApiResponse<Order>>(`/orders/${id}/confirm`),
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  store: (orderId: number, data: { rating: number; comment?: string }) =>
    api.post<ApiResponse<Review>>(`/orders/${orderId}/reviews`, data),
  reply: (reviewId: number, data: { comment: string }) =>
    api.post<ApiResponse<Review>>(`/reviews/${reviewId}/reply`, data),
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const wishlistApi = {
  list: () => api.get<ApiResponse<PaginatedData<{ product: Product }>>>('/wishlist'),
  add: (productId: number) => api.post<ApiResponse<null>>(`/wishlist/${productId}`),
  remove: (productId: number) => api.delete<ApiResponse<null>>(`/wishlist/${productId}`),
  check: (productId: number) => api.get<ApiResponse<{ in_wishlist: boolean }>>(`/wishlist/${productId}/check`),
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export const chatApi = {
  conversations: () => api.get<ApiResponse<Conversation[]>>('/conversations'),
  getOrCreate: (store_id: number) => api.post<ApiResponse<Conversation>>('/conversations', { store_id }),
  messages: (conversationId: number) => api.get<ApiResponse<PaginatedData<Message>>>(`/conversations/${conversationId}/messages`),
  send: (conversationId: number, message: string) =>
    api.post<ApiResponse<Message>>(`/conversations/${conversationId}/messages`, { message }),
}

// ─── Notifications ────────────────────────────────────────────────────────────

export const notificationsApi = {
  list: () => api.get<ApiResponse<PaginatedData<Notification>>>('/notifications'),
  unreadCount: () => api.get<ApiResponse<{ unread_count: number }>>('/notifications/unread-count'),
  read: (id: number) => api.patch<ApiResponse<null>>(`/notifications/${id}/read`),
  readAll: () => api.patch<ApiResponse<null>>('/notifications/read-all'),
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export const walletApi = {
  get: () => api.get<ApiResponse<Wallet>>('/wallet'),
  transactions: () => api.get<ApiResponse<PaginatedData<WalletTransaction>>>(`/wallet/transactions`),
  topup: (amount: number) => api.post<ApiResponse<Wallet>>('/wallet/topup', { amount }),
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export const withdrawalApi = {
  list: () => api.get<ApiResponse<Withdrawal[]>>('/withdrawals'),
  create: (data: Partial<Withdrawal>) => api.post<ApiResponse<Withdrawal>>('/withdrawals', data),
}

// ─── Swap ─────────────────────────────────────────────────────────────────────

export const swapApi = {
  list: () => api.get<ApiResponse<PaginatedData<Swap>>>('/swaps'),
  create: (data: { target_product_id: number; requester_product_id: number }) =>
    api.post<ApiResponse<Swap>>('/swaps', data),
  respond: (id: number, status: 'diterima' | 'ditolak') =>
    api.patch<ApiResponse<Swap>>(`/swaps/${id}/respond`, { status }),
  inputResi: (id: number, data: { resi: string; side: 'buyer' | 'seller' }) =>
    api.post<ApiResponse<Swap>>(`/swaps/${id}/resi`, data),
  confirm: (id: number) => api.post<ApiResponse<Swap>>(`/swaps/${id}/confirm`),
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reportsApi = {
  create: (data: { reported_user_id: number; reason: string; description?: string }) =>
    api.post<ApiResponse<null>>('/reports', data),
}

// ─── Discovery ────────────────────────────────────────────────────────────────

export const discoveryApi = {
  banners: () => api.get<ApiResponse<Banner[]>>('/banners'),
  configs: () => api.get<ApiResponse<Record<string, string>>>('/configs'),
}

// ─── Seller ───────────────────────────────────────────────────────────────────

export const sellerApi = {
  orders: (params?: Record<string, unknown>) =>
    api.get<ApiResponse<PaginatedData<Order>>>('/orders/seller', { params }),
  confirmOrder: (id: number) => 
    api.post<ApiResponse<Order>>(`/orders/${id}/resi`, { resi: 'AUTO-CONFIRMED', courier_code: 'jne' }), // Dummy resi for confirmation
  inputResi: (id: number, data: { resi: string; courier_code: string }) =>
    api.post<ApiResponse<Order>>(`/orders/${id}/resi`, data),
}

export default api
