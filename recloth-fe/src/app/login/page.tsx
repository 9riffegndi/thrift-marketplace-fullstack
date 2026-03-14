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

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
})

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated) router.push('/')
  }, [isAuthenticated, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: any) => {
    try {
      login(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-20 bg-white">
      <div className="w-full max-w-[400px] space-y-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <img src="/logo-recloth.png" alt="Recloth Logo" className="h-32 w-auto object-contain" />
          <h1 className="text-2xl font-bold uppercase tracking-tight">Masuk</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
            Akses akun Recloth kamu
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
              <div className="flex items-center justify-between px-0.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Kata Sandi
                </label>
                <Link href="/forgot-password" title="Lupa Kata Sandi?" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                  Lupa?
                </Link>
              </div>
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
              'Masuk ke Recloth'
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Belum punya akun?{' '}
            <Link href="/register" className="text-foreground border-b border-foreground hover:text-muted-foreground transition-colors ml-1">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
