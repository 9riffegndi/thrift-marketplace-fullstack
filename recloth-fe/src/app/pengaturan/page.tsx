'use client'

import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/lib/store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Camera, Loader2, Lock, User as UserIcon } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().min(10, 'Nomor HP minimal 10 karakter'),
})

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Password saat ini wajib diisi'),
  password: z.string().min(8, 'Password baru minimal 8 karakter'),
  password_confirmation: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Konfirmasi password tidak cocok",
  path: ["password_confirmation"],
})

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { updateProfile, changePassword, isLoading } = useAuth()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onUpdateProfile = async (data: any) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('phone', data.phone)
    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }
    updateProfile(formData)
  }

  const onChangePassword = async (data: any) => {
    changePassword(data)
    passwordForm.reset()
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 pb-24 space-y-12">
      <header className="space-y-1">
        <h1 className="text-xl font-bold uppercase tracking-tight">Pengaturan Akun</h1>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Kelola informasi pribadi dan keamanan profil Anda</p>
      </header>

      {/* Profile Info Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <UserIcon className="h-4 w-4 text-primary" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Informasi Pribadi</h2>
        </div>

        <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="h-24 w-24 rounded-full border-2 border-border overflow-hidden bg-muted flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <UserIcon className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 h-8 w-8 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors border-2 border-background">
                <Camera className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Klik ikon kamera untuk mengubah foto</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Nama Lengkap</label>
              <input
                {...profileForm.register('name')}
                placeholder="Nama Anda"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {profileForm.formState.errors.name && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{profileForm.formState.errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Nomor HP</label>
              <input
                {...profileForm.register('phone')}
                placeholder="08123456789"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {profileForm.formState.errors.phone && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{profileForm.formState.errors.phone.message as string}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:bg-muted disabled:text-muted-foreground"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Perubahan'}
          </button>
        </form>
      </section>

      {/* Password Section */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Lock className="h-4 w-4 text-primary" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em]">Keamanan & Password</h2>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Password Saat Ini</label>
              <input
                {...passwordForm.register('current_password')}
                type="password"
                placeholder="••••••••"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {passwordForm.formState.errors.current_password && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{passwordForm.formState.errors.current_password.message as string}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Password Baru</label>
              <input
                {...passwordForm.register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {passwordForm.formState.errors.password && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{passwordForm.formState.errors.password.message as string}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Konfirmasi Password Baru</label>
              <input
                {...passwordForm.register('password_confirmation')}
                type="password"
                placeholder="••••••••"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {passwordForm.formState.errors.password_confirmation && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{passwordForm.formState.errors.password_confirmation.message as string}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-white text-black border border-black font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:bg-muted disabled:text-muted-foreground"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ganti Password'}
          </button>
        </form>
      </section>
    </div>
  )
}
