'use client'

import { useState, useEffect } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/lib/store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().min(10, 'Nomor HP minimal 10 karakter'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  password_confirmation: z.string().min(8, 'Konfirmasi kata sandi minimal 8 karakter'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Kata sandi tidak cocok",
  path: ["password_confirmation"],
})

export default function RegisterPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { register: registerAuth, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: any) => {
    registerAuth(data)
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-20 bg-background">
      <div className="w-full max-w-[400px] space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Daftar</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Bergabung dengan Komunitas Recloth
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
                Nama Lengkap
              </label>
              <input
                {...register('name')}
                placeholder="John Doe"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {errors.name && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
                  {errors.name.message as string}
                </p>
              )}
            </div>

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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
                Nomor HP
              </label>
              <input
                {...register('phone')}
                type="tel"
                placeholder="08123456789"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {errors.phone && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">
                Konfirmasi Kata Sandi
              </label>
              <input
                {...register('password_confirmation')}
                type="password"
                placeholder="••••••••"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {errors.password_confirmation && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">
                  {errors.password_confirmation.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground font-medium leading-relaxed italic ml-0.5">
            Dengan mendaftar, Anda menyetujui <Link href="/syarat-ketentuan" className="border-b border-muted-foreground hover:text-foreground">Syarat & Ketentuan</Link> serta <Link href="/kebijakan-privasi" className="border-b border-muted-foreground hover:text-foreground">Kebijakan Privasi</Link> kami.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center transition-all hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 gap-2 rounded-none active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-foreground border-b border-foreground hover:text-muted-foreground transition-colors ml-1">
              Masuk Saja
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
