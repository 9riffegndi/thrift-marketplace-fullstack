'use client'

import { useState } from 'react'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const forgotSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

export default function ForgotPasswordPage() {
  const { forgotPassword, forgotPasswordStatus } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isPending = forgotPasswordStatus.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: { email: string }) => {
    forgotPassword(data.email, {
      onSuccess: () => {
        setIsSubmitted(true)
      }
    })
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-20 bg-white">
      <div className="w-full max-w-[400px] space-y-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <img src="/logo-recloth.png" alt="Recloth Logo" className="h-32 w-auto object-contain" />
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            {isSubmitted ? 'Email Dikirim' : 'Lupa Password?'}
          </h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed max-w-[280px]">
            {isSubmitted 
              ? 'Kami telah mengirimkan instruksi pengaturan ulang password ke email Anda.' 
              : 'Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang password.'}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="recloth@example.com"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {errors.email && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center transition-all hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 gap-2 rounded-none active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Kirim Instruksi'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-50 p-6 flex flex-col items-center gap-4 border border-zinc-100">
               <div className="h-12 w-12 bg-black text-white flex items-center justify-center">
                  <Mail size={24} />
               </div>
               <p className="text-[11px] font-medium text-center text-zinc-600 leading-relaxed uppercase tracking-wider">
                  Silakan periksa folder masuk atau spam email Anda.
               </p>
            </div>
            
            <Link 
                href="/reset-password" 
                className="w-full h-14 border border-black text-black font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center transition-all hover:bg-black hover:text-white rounded-none"
            >
                Buka Halaman Reset
            </Link>
          </div>
        )}

        <div className="text-center pt-4 border-t border-border">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
          >
            <ArrowLeft size={12} />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}
