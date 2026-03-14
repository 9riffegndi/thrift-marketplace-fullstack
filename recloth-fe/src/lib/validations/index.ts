import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor HP minimal 10 digit').optional(),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
})

export const productSchema = z.object({
  name: z.string().min(5, 'Nama produk minimal 5 karakter').max(100),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter').max(2000),
  category_id: z.string().min(1, 'Pilih kategori'),
  condition: z.enum(['A', 'B', 'C', 'D']),
  price: z.coerce.number().min(1000, 'Harga minimal Rp 1.000'),
  size: z.string().min(1, 'Pilih ukuran'),
  weight: z.coerce.number().min(1, 'Berat minimal 1 gram'),
})

export const addressSchema = z.object({
  label: z.string().min(1, 'Label wajib diisi').max(50),
  recipient_name: z.string().min(2, 'Nama penerima minimal 2 karakter').max(100),
  phone: z.string().min(10, 'Nomor HP minimal 10 digit').max(20),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  city: z.string().min(2, 'Kota wajib diisi'),
  province: z.string().min(2, 'Provinsi wajib diisi'),
  postal_code: z.string().min(5, 'Kode pos minimal 5 digit').max(10),
})

export const withdrawSchema = z.object({
  amount: z.coerce.number().min(50000, 'Minimum withdraw Rp 50.000'),
  bank_name: z.string().min(2, 'Nama bank wajib diisi'),
  account_number: z.string().min(6, 'Nomor rekening minimal 6 digit'),
  account_name: z.string().min(2, 'Nama pemilik rekening wajib diisi'),
})

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(500).optional(),
})

export const checkoutSchema = z.object({
  address_id: z.coerce.number().min(1, 'Pilih alamat pengiriman'),
  courier_code: z.string().min(1, 'Pilih kurir'),
  courier_service: z.string().min(1, 'Pilih layanan kurir'),
  ongkir: z.coerce.number().min(0),
  payment_method: z.string().min(1, 'Pilih metode pembayaran'),
  promo_code: z.string().optional(),
  diskon: z.coerce.number().optional().default(0),
})

export const storeSchema = z.object({
  name: z.string().min(3, 'Nama toko minimal 3 karakter').max(100),
  description: z.string().max(500).optional(),
  address: z.string().min(10, 'Alamat toko wajib diisi'),
  city: z.string().min(2, 'Kota wajib diisi'),
  province: z.string().min(2, 'Provinsi wajib diisi'),
  couriers: z.array(z.string()).min(1, 'Pilih minimal 1 kurir'),
})

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Password saat ini wajib diisi'),
  password: z.string().min(8, 'Password baru minimal 8 karakter'),
  password_confirmation: z.string(),
}).refine(d => d.password === d.password_confirmation, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type WithdrawInput = z.infer<typeof withdrawSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type StoreInput = z.infer<typeof storeSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
