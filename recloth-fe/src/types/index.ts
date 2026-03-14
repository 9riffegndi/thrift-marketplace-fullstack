// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'super_admin'
  status: 'active' | 'suspended'
  store?: Store
  followers_count?: number
  following_count?: number
  created_at: string
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export type StoreStatus = 'active' | 'inactive' | 'suspended'

export interface Store {
  id: number
  user_id: number
  name: string
  slug: string
  description?: string
  photo?: string
  city?: string
  province?: string
  address?: string
  rating: number
  total_sales: number
  status: StoreStatus
  couriers?: StoreCourier[]
  followers_count?: number
  created_at: string
}

export interface StoreCourier {
  id: number
  store_id: number
  courier_code: string
}

export interface StoreStats {
  gmv: number
  total_orders: number
  active_products: number
  followers_count: number
}

// ─── Category ──────────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
  slug: string
  icon?: string
  status: 'active' | 'inactive'
  sort_order: number
}

// ─── Product ───────────────────────────────────────────────────────────────────

export type ProductCondition = 'A' | 'B' | 'C' | 'D'
export type ProductStatus = 'active' | 'inactive' | 'sold' | 'reserved' | 'suspended'

export interface ProductPhoto {
  id: number
  product_id: number
  photo_url: string
  is_primary: boolean
  sort_order: number
}

export interface Product {
  id: number
  store_id: number
  category_id: number
  name: string
  slug: string
  description?: string
  condition: ProductCondition
  price: number
  size: string
  weight: number
  status: ProductStatus
  store?: Store
  category?: Category
  photos?: ProductPhoto[]
  primary_photo?: string
  primary_photo_url?: string
  created_at: string
  updated_at: string
}

// ─── Cart ──────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  product: Product
  created_at: string
}

// ─── Address ───────────────────────────────────────────────────────────────────

export interface Address {
  id: number
  user_id: number
  label: string
  recipient_name: string
  phone: string
  address: string
  city: string
  province: string
  postal_code: string
  is_primary: boolean
}

// ─── Order ─────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'menunggu_bayar'
  | 'dikonfirmasi'
  | 'dikirim'
  | 'selesai'
  | 'dibatalkan'
  | 'direfund'

export type EscrowStatus = 'held' | 'released' | 'refunded'

export interface Order {
  id: number
  buyer_id: number
  store_id: number
  product_id: number
  type: 'buy' | 'swap'
  status: OrderStatus
  subtotal: number
  ongkir: number
  diskon: number
  komisi: number
  total: number
  courier_code?: string
  courier_service?: string
  resi?: string
  escrow_status: EscrowStatus
  buyer?: User
  store?: Store
  product?: Product
  payment?: Payment
  review?: Review
  created_at: string
  updated_at: string
}

// ─── Payment ───────────────────────────────────────────────────────────────────

export type PaymentMethod =
  | 'qris' | 'va_bca' | 'va_mandiri' | 'va_bni' | 'va_bri'
  | 'gopay' | 'ovo' | 'dana' | 'shopepay' | 'card'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Payment {
  id: number
  order_id: number
  method: PaymentMethod
  midtrans_order_id?: string
  midtrans_transaction_id?: string
  amount: number
  status: PaymentStatus
  paid_at?: string
  created_at: string
}

// ─── Wallet ────────────────────────────────────────────────────────────────────

export interface Wallet {
  id: number
  user_id: number
  balance: number
  held_balance: number
}

export type WalletTxType = 'escrow_in' | 'escrow_release' | 'refund' | 'withdrawal' | 'commission'

export interface WalletTransaction {
  id: number
  wallet_id: number
  order_id?: number
  type: WalletTxType
  amount: number
  description?: string
  created_at: string
}

// ─── Withdrawal ────────────────────────────────────────────────────────────────

export type WithdrawalStatus = 'pending' | 'processing' | 'done' | 'failed'

export interface Withdrawal {
  id: number
  user_id: number
  amount: number
  bank_name: string
  account_number: string
  account_name: string
  status: WithdrawalStatus
  processed_at?: string
  created_at: string
}

// ─── Swap ──────────────────────────────────────────────────────────────────────

export type SwapStatus = 'diajukan' | 'diterima' | 'ditolak' | 'selesai' | 'dibatalkan'

export interface Swap {
  id: number
  order_id: number
  requester_product_id: number
  target_product_id: number
  status: SwapStatus
  buyer_resi?: string
  seller_resi?: string
  created_at: string
}

// ─── Review ────────────────────────────────────────────────────────────────────

export interface Review {
  id: number
  order_id: number
  buyer_id: number
  store_id: number
  product_id: number
  rating: number
  comment?: string
  status: 'published' | 'hidden'
  buyer?: User
  reply?: ReviewReply
  created_at: string
}

export interface ReviewReply {
  id: number
  review_id: number
  store_id: number
  comment: string
  created_at: string
}

// ─── Conversation & Message ────────────────────────────────────────────────────

export interface Conversation {
  id: number
  buyer_id: number
  store_id: number
  last_message_at?: string
  buyer?: User
  store?: Store
  last_message?: Message
  unread_count?: number
  created_at: string
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  message: string
  is_read: boolean
  sender?: User
  created_at: string
}

// ─── Notification ──────────────────────────────────────────────────────────────

export interface Notification {
  id: number
  user_id: number
  type: string
  title: string
  body: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
}

// ─── Promo ─────────────────────────────────────────────────────────────────────

export interface Promo {
  id: number
  code: string
  type: 'percent' | 'nominal'
  value: number
  min_purchase: number
  max_discount?: number
  quota: number
  used_count: number
  start_at: string
  end_at: string
  status: 'active' | 'inactive'
}

// ─── Shipping ──────────────────────────────────────────────────────────────────

export interface ShippingCost {
  service: string
  description: string
  cost: Array<{ value: number; etd: string; note: string }>
}

// ─── Banner ──────────────────────────────────────────────────────────────────

export interface Banner {
  id: number
  title: string
  image_url: string
  link_url?: string
  sort_order: number
  status: 'active' | 'inactive'
}

// ─── API Response ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}
