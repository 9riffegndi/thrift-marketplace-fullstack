'use client'

import { useState, useEffect, Suspense } from 'react'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const resetSchema = z.object({
  email: z.string().email('Email tidak valid'),
  token: z.string().min(1, 'Token harus diisi'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  password_confirmation: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Konfirmasi password tidak cocok",
  path: ["password_confirmation"],
})

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { resetPassword, resetPasswordStatus } = useAuth()
  const isPending = resetPasswordStatus.isPending

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
      token: '',
      password: '',
      password_confirmation: '',
    }
  })

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('token')
    if (email) setValue('email', email)
    if (token) setValue('token', token)
  }, [searchParams, setValue])

  const onSubmit = async (data: any) => {
    resetPassword(data, {
      onSuccess: () => {
        setIsSuccess(true)
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 bg-black text-white flex items-center justify-center rounded-none">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-black">Password Berhasil Diubah</h2>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-relaxed max-w-[280px]">
            Password Anda telah berhasil diperbarui. Silakan login kembali dengan password baru Anda.
          </p>
        </div>
        <Link 
            href="/login" 
            className="w-full h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center transition-all hover:bg-zinc-800 rounded-none shadow-lg active:scale-[0.98]"
        >
            Login Sekarang
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="recloth@example.com"
            className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors bg-white font-medium"
            required
          />
          {errors.email && (
            <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Token Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
            Token Reset
          </label>
          <input
            {...register('token')}
            type="text"
            placeholder="Masukkan token 6 digit"
            className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors bg-white font-medium"
            required
          />
          {errors.token && (
            <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
              {errors.token.message as string}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
            Password Baru
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors bg-white font-medium"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
              {errors.password.message as string}
            </p>
          )}
        </div>

        {/* Password Confirmation Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
            Konfirmasi Password
          </label>
          <input
            {...register('password_confirmation')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors bg-white font-medium"
            required
          />
          {errors.password_confirmation && (
            <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
              {errors.password_confirmation.message as string}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center transition-all hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 gap-2 rounded-none active:scale-[0.98] shadow-md"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          'Atur Ulang Password'
        )}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-20 bg-white">
      <div className="w-full max-w-[400px] space-y-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <img src="/logo-recloth.png" alt="Recloth Logo" className="h-32 w-auto object-contain" />
          <h1 className="text-2xl font-bold uppercase tracking-tight">Atur Ulang Password</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Silakan masukkan password baru Anda
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <div className="text-center pt-4 border-t border-border">
          <Link 
            href="/login" 
            className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}
