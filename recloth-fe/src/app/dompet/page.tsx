'use client'

import { useWallet, useWalletTransactions, useWithdraw, useTopUp } from '@/hooks/useWallet'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { Skeleton } from '@/components/shared/Skeleton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { formatRelativeTime } from '@/lib/utils/format'
import { Wallet, ArrowDownToLine, ArrowUpFromLine, History, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function WalletPage() {
  const { data: wallet, isLoading: isWalletLoading } = useWallet()
  const { data: transactions, isLoading: isTransactionsLoading } = useWalletTransactions()
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw()
  const { mutate: topUp, isPending: isTopUpLoading } = useTopUp()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [topUpAmount, setTopUpAmount] = useState('')
  const [bankInfo, setBankInfo] = useState({ bank_name: '', account_number: '', account_name: '' })

  if (isWalletLoading || isTransactionsLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64" />
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    )
  }

  if (!wallet) return <ErrorState message="Gagal memuat data dompet." />

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-bold uppercase tracking-tight">Dompet Recloth</h1>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Kelola saldo dan riwayat transaksi</p>
      </header>

      {/* Balance Card */}
      <div className="bg-black text-white p-8 space-y-8">
        <div className="flex items-center gap-3 opacity-60">
          <Wallet className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Saldo Tersedia</span>
        </div>
        <div>
          <PriceDisplay price={wallet.balance} className="text-4xl font-bold tracking-tighter" />
          {wallet.held_balance > 0 && (
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Rp {wallet.held_balance.toLocaleString('id-ID')} Tertahan di Escrow</span>
            </div>
          )}
        </div>
        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => setIsTopUpOpen(true)}
            className="flex-1 h-12 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowDownToLine className="h-4 w-4" /> Top Up
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 h-12 border border-white/20 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowUpFromLine className="h-4 w-4" /> Tarik Saldo
          </button>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-bold uppercase tracking-tight">Tarik Saldo</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Dana akan dikirim ke rekening bank kamu</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Jumlah Penarikan</label>
                <input 
                  type="number"
                  placeholder="MIN. RP 50.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-12 bg-transparent border-b border-border outline-none text-sm font-bold placeholder:text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Nama Bank</label>
                  <input 
                    placeholder="E.G. BCA"
                    value={bankInfo.bank_name}
                    onChange={(e) => setBankInfo({...bankInfo, bank_name: e.target.value.toUpperCase()})}
                    className="w-full h-10 bg-transparent border-b border-border outline-none text-[10px] font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Nama Pemilik</label>
                  <input 
                    placeholder="NAMA LENGKAP"
                    value={bankInfo.account_name}
                    onChange={(e) => setBankInfo({...bankInfo, account_name: e.target.value.toUpperCase()})}
                    className="w-full h-10 bg-transparent border-b border-border outline-none text-[10px] font-bold uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Nomor Rekening</label>
                <input 
                  placeholder="EG: 1234567890"
                  value={bankInfo.account_number}
                  onChange={(e) => setBankInfo({...bankInfo, account_number: e.target.value})}
                  className="w-full h-10 bg-transparent border-b border-border outline-none text-[10px] font-bold"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-12 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!amount || !bankInfo.bank_name || isWithdrawing}
                onClick={() => withdraw({ amount: Number(amount), ...bankInfo }, { onSuccess: () => setIsModalOpen(false) })}
                className="flex-1 h-12 bg-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isWithdrawing ? <LoadingSpinner size="sm" /> : 'Tarik'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background p-8 space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="space-y-1">
              <h2 className="text-xl font-bold uppercase tracking-tight">Top Up Saldo</h2>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Tambah saldo dompet Recloth kamu</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Jumlah Top Up</label>
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {[50000, 100000, 250000, 500000].map(val => (
                    <button
                      key={val}
                      onClick={() => setTopUpAmount(val.toString())}
                      className={cn(
                        "h-10 text-[10px] font-bold border transition-all rounded-none",
                        topUpAmount === val.toString() ? "bg-black text-white border-black" : "border-border hover:bg-muted"
                      )}
                    >
                      Rp {val.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
                <input 
                  type="number"
                  placeholder="MIN. RP 10.000"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full h-12 bg-transparent border-b border-border outline-none text-sm font-bold placeholder:text-zinc-200"
                />
              </div>
              <p className="text-[9px] text-zinc-400 leading-relaxed uppercase tracking-wider font-medium">
                * UNTUK KEPERLUAN QA/DEV, PEMBAYARAN AKAN OTOMATIS BERHASIL DAN SALDO AKAN LANGSUNG BERTAMBAH.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsTopUpOpen(false)}
                className="flex-1 h-12 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!topUpAmount || isTopUpLoading}
                onClick={() => topUp(Number(topUpAmount), { onSuccess: () => { setIsTopUpOpen(false); setTopUpAmount('') } })}
                className="flex-1 h-12 bg-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isTopUpLoading ? <LoadingSpinner size="sm" /> : 'Isi Saldo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <History className="h-3.5 w-3.5" /> Riwayat Transaksi
          </h2>
        </div>

        <div className="space-y-px bg-border border border-border">
          {transactions?.length === 0 ? (
            <div className="bg-background py-20 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Belum ada transaksi</p>
            </div>
          ) : (
            transactions?.map((tx) => (
              <div key={tx.id} className="bg-background p-5 flex items-center justify-between group hover:bg-muted/30 transition-colors">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-tight">{tx.description || tx.type.replace('_', ' ')}</p>
                  <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-wider">{formatRelativeTime(tx.created_at)}</p>
                </div>
                <div className={cn(
                  "text-xs font-bold tracking-tight",
                  tx.amount > 0 ? "text-emerald-600" : "text-foreground"
                )}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('id-ID')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
