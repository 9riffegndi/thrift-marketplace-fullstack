"use client";

import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ConditionBadge } from "@/components/shared/ConditionBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { MoreHorizontal } from "lucide-react";
import { useSellerProducts } from "@/hooks/useProducts";
import api, { productsApi } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/shared/Skeleton";

export default function SellerProductsPage() {
  const [status, setStatus] = useState<string>("");
  const query = useSellerProducts({ status: status || undefined });

  if (query.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    )
  }
  
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">Katalog Produk</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
            {query.data?.total || 0} Produk Terdaftar
          </p>
        </div>
        <Link 
          href="/seller/produk/baru" 
          className="h-10 px-6 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest flex items-center justify-center transition-colors hover:bg-zinc-800"
        >
          Tambah Produk
        </Link>
      </div>

      <div className="flex items-center gap-4 border-b border-border pb-4 overflow-x-auto no-scrollbar">
        {['all', 'active', 'inactive', 'sold'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s === 'all' ? '' : s)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors",
              (status === '' && s === 'all') || status === s
                ? "text-foreground border-b border-foreground pb-4 -mb-4.5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {s === 'all' ? 'Semua' : s === 'active' ? 'Aktif' : s === 'inactive' ? 'Nonaktif' : 'Terjual'}
          </button>
        ))}
      </div>

      {(query.data?.data?.length ?? 0) < 1 ? (
        <EmptyState title="Belum ada produk" description="Mulai berjualan dengan menambahkan produk pertama Anda." />
      ) : (
        <div className="space-y-px bg-border border-y border-border">
          {(query.data?.data ?? []).map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-background items-center group">
              <div className="relative h-16 w-16 bg-muted shrink-0 overflow-hidden">
                <Image 
                  src={item.photos?.[0]?.photo_url || '/placeholder-product.png'} 
                  alt={item.name} 
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <PriceDisplay price={Number(item.price)} />
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <ConditionBadge condition={item.condition as any} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={cn(
                  "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                  item.status === 'active' ? "bg-black text-white" : "bg-muted text-muted-foreground"
                )}>
                  {item.status}
                </div>
                
                <div className="flex gap-2">
                  <Link 
                    href={`/seller/produk/${item.id}/edit`}
                    className="h-8 px-4 flex items-center justify-center border border-border text-[9px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    className="h-8 px-4 flex items-center justify-center border border-border text-[9px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                    onClick={async () => {
                      if (!confirm('Yakin ingin menghapus produk ini? Status akan menjadi nonaktif.')) return
                      await productsApi.delete(item.id);
                      await query.refetch();
                    }}
                  >
                    Hapus
                  </button>
                  <button
                    className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground transition-colors"
                    onClick={async () => {
                      await api.patch(`/products/${item.id}/toggle`);
                      await query.refetch();
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
