'use client'

import { useState } from 'react'
import { reportsApi } from '@/lib/api'
import { toast } from 'sonner'
import { AlertTriangle, X, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportModalProps {
  reportedUserId: number
  isOpen: boolean
  onClose: () => void
}

const REASONS = [
  'Penipuan / Fraud',
  'Barang tidak sesuai deskripsi',
  'Sikap tidak sopan / Melanggar aturan',
  'Lainnya'
]

export function ReportModal({ reportedUserId, isOpen, onClose }: ReportModalProps) {
  const [step, setStep] = useState<'reason' | 'success'>('reason')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!reason) return
    setIsSubmitting(true)
    try {
      await reportsApi.create({
        reported_user_id: reportedUserId,
        reason,
        description
      })
      setStep('success')
    } catch (err) {
      toast.error('Gagal mengirim laporan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep('reason')
    setReason('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="relative bg-white w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Laporkan User
          </h2>
          <button onClick={handleClose} className="p-1 hover:bg-zinc-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === 'reason' ? (
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pilih Alasan</p>
              <div className="grid gap-2">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={cn(
                      "w-full h-12 px-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest transition-all border",
                      reason === r ? "bg-black text-white border-black" : "bg-white text-black border-border hover:border-black"
                    )}
                  >
                    {r}
                    <ChevronRight className={cn("h-4 w-4", reason === r ? "opacity-100" : "opacity-0")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Deskripsi Tambahan (Opsional)</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berikan detail lebih lanjut..."
                className="w-full h-24 p-4 text-[11px] font-medium border border-border bg-zinc-50 outline-none focus:border-black transition-all resize-none italic"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="w-full h-14 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center disabled:bg-zinc-200 disabled:text-zinc-400 transition-all hover:bg-red-700"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </div>
        ) : (
          <div className="p-12 text-center space-y-6">
            <div className="h-16 w-16 bg-zinc-900 flex items-center justify-center mx-auto mb-2 aspect-square">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black uppercase tracking-widest">Laporan Terkirim</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                Terima kasih. Tim kami akan segera meninjau laporan Anda.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full h-12 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
