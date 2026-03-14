"use client";

import Link from "next/link";
import { House, MessageCircle, Store, User } from "lucide-react";

const menus = [
  { href: "/", label: "Home", icon: House },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/toko", label: "Toko", icon: Store },
  { href: "/profil", label: "Profil", icon: User },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background md:hidden">
      <div className="grid grid-cols-4">
        {menus.map((menu) => (
          <Link key={menu.href} href={menu.href} className="flex flex-col items-center gap-1 py-2 text-xs">
            <menu.icon size={16} />
            <span>{menu.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
