'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between gap-16">
          {/* Brand */}
          <div className="space-y-6 flex-1">
            <span className="font-bold text-2xl lowercase tracking-tighter">recloth</span>
            <p className="text-[11px] text-zinc-500 leading-relaxed max-w-xs font-medium uppercase tracking-wide">
              Misi kami adalah mendemokratisasi fashion retail berkelanjutan melalui sistem resale prelove berkualitas.
            </p>
          </div>

          {/* Links & Info */}
          <div className="flex flex-wrap gap-12 md:gap-24 flex-[2]">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Katalog</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-[11px] text-zinc-500 hover:text-foreground transition-colors uppercase tracking-wider">Wanita</Link></li>
                <li><Link href="/" className="text-[11px] text-zinc-500 hover:text-foreground transition-colors uppercase tracking-wider">Pria</Link></li>
                <li><Link href="/" className="text-[11px] text-zinc-500 hover:text-foreground transition-colors uppercase tracking-wider">Anak</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Bantuan</h4>
              <ul className="space-y-3">
                <li><Link href="/faq" className="text-[11px] text-zinc-500 hover:text-foreground transition-colors uppercase tracking-wider">FAQ</Link></li>
                <li><Link href="/kontak" className="text-[11px] text-zinc-500 hover:text-foreground transition-colors uppercase tracking-wider">Hubungi Kami</Link></li>
                <li><Link href="/syarat" className="text-[11px] text-zinc-500 hover:text-foreground transition-colors uppercase tracking-wider">Privasi</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Hubungi</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                Jakarta, ID<br />
                hello@recloth.id
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Recloth. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-foreground">Instagram</span>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-foreground">TikTok</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
