export function formatRupiah(amount: number | string): string {
  const num = typeof amount === 'number' ? amount : parseFloat(amount)
  if (isNaN(num)) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} jam lalu`
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} hari lalu`
  return formatShortDate(date)
}

export function formatWeight(grams: number): string {
  if (grams < 1000) return `${grams} gr`
  return `${(grams / 1000).toFixed(1)} kg`
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  menunggu_bayar: 'Menunggu Pembayaran',
  dikonfirmasi: 'Dikonfirmasi',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
  direfund: 'Direfund',
}

export const ORDER_STATUS_COLOR: Record<string, string> = {
  menunggu_bayar: 'text-amber-700 bg-amber-50 border-amber-100',
  dikonfirmasi: 'text-zinc-700 bg-zinc-100 border-zinc-200',
  dikirim: 'text-indigo-700 bg-indigo-50 border-indigo-100',
  selesai: 'text-zinc-900 bg-zinc-100 border-zinc-900',
  dibatalkan: 'text-zinc-400 bg-zinc-50 border-zinc-100',
  direfund: 'text-orange-700 bg-orange-50 border-orange-100',
}

export const CONDITION_LABEL: Record<string, string> = {
  A: 'Like New',
  B: 'Very Good',
  C: 'Good',
  D: 'Fair',
}

export const CONDITION_COLOR: Record<string, string> = {
  A: 'text-zinc-900 bg-zinc-100 border-zinc-200',
  B: 'text-zinc-700 bg-zinc-100 border-zinc-200',
  C: 'text-zinc-600 bg-zinc-50 border-zinc-100',
  D: 'text-zinc-500 bg-zinc-50 border-zinc-100',
}

export const SWAP_STATUS_LABEL: Record<string, string> = {
  diajukan: 'Menunggu Persetujuan',
  diterima: 'Pertukaran Disetujui',
  ditolak: 'Swap Ditolak',
  selesai: 'Swap Berhasil',
  dibatalkan: 'Dibatalkan',
}
