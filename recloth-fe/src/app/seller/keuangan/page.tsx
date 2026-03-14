"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { formatRupiah } from "@/lib/utils/format";
import { useWallet, useWalletTransactions } from "@/hooks/useWallet";
import api from "@/lib/api";
import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { Skeleton } from "@/components/shared/Skeleton";

export default function SellerFinancePage() {
  const wallet = useWallet();
  const transactions = useWalletTransactions();
  const [amount, setAmount] = useState<string>("50000");
  const [isPending, setIsPending] = useState(false);

  if (wallet.isLoading || transactions.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="space-y-px">
          {[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    )
  }

  if (wallet.isError || transactions.isError) return <ErrorState onRetry={() => { wallet.refetch(); transactions.refetch(); }} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-tight">Keuangan Toko</h1>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
          Kelola Saldo dan Penarikan Dana
        </p>
      </div>

      <div className="bg-primary p-8 text-primary-foreground">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Saldo Tersedia</p>
        <div className="mt-2 flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="text-4xl font-bold tracking-tight">
            <PriceDisplay price={Number(wallet.data?.balance ?? 0)} className="text-primary-foreground" />
          </h2>
          <p className="text-sm font-medium opacity-70">
            Pending: <PriceDisplay price={Number(wallet.data?.held_balance ?? 0)} className="text-primary-foreground italic" />
          </p>
        </div>
      </div>

      <div className="border border-border p-6 space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-widest italic">Tarik Saldo</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="flex-1 h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
            type="number"
            placeholder="Jumlah penarikan..."
          />
          <button
            type="button"
            disabled={isPending || !amount || Number(amount) < 10000}
            className="h-12 px-8 bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            onClick={async () => {
              try {
                setIsPending(true);
                await api.post("/withdrawals", {
                  amount: Number(amount),
                  bank_name: "BCA",
                  account_number: "1234567890",
                  account_name: "Seller Recloth",
                });
                await wallet.refetch();
                await transactions.refetch();
              } finally {
                setIsPending(false);
              }
            }}
          >
            {isPending ? <LoadingSpinner size="sm" /> : <ArrowDownToLine className="h-4 w-4" />} 
            Ajukan Penarikan
          </button>
        </div>
      </div>

      <div className="border border-border overflow-hidden">
        <div className="bg-muted px-6 py-3 border-b border-border">
          <h2 className="text-[10px] font-bold uppercase tracking-widest">Riwayat Transaksi</h2>
        </div>
        <div className="divide-y divide-border">
          {(transactions.data ?? []).length > 0 ? (
            (transactions.data ?? []).map((row) => (
              <div key={row.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide">{row.type}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">#{row.id}</p>
                </div>
                <span className="text-sm font-bold">
                  {formatRupiah(Number(row.amount))}
                </span>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground text-xs italic">
              Belum ada riwayat transaksi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
