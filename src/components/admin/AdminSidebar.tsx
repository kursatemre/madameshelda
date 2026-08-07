"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  CalendarDays,
  ClipboardList,
  Tag,
  LogOut,
  ExternalLink,
  PenSquare,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/eserler", label: "Eserler", icon: ImageIcon },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: Tag },
  { href: "/admin/workshoplar", label: "Workshoplar", icon: CalendarDays },
  { href: "/admin/basvurular", label: "Siparişler", icon: ClipboardList },
  { href: "/admin/site-icerigi", label: "Site İçeriği", icon: PenSquare },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3.5 lg:py-3 font-label text-[0.65rem] transition-all duration-200 ${
              active
                ? "bg-white/15 text-white"
                : "text-white/50 hover:text-white hover:bg-white/8"
            }`}
          >
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="px-3 pb-6 space-y-0.5 border-t border-brown-light/40 pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3.5 lg:py-3 font-label text-[0.65rem] text-white/40 hover:text-white transition-colors duration-200"
      >
        <ExternalLink size={15} />
        Siteyi Görüntüle
      </a>
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3.5 lg:py-3 font-label text-[0.65rem] text-white/40 hover:text-white transition-colors duration-200"
      >
        <LogOut size={15} />
        Çıkış Yap
      </button>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Giriş ekranında henüz kimlik doğrulanmadığı için nav gösterilmez.
  if (pathname === "/admin/login") return null;

  return (
    <>
      {/* Masaüstü — sabit sidebar (lg ve üstü) */}
      <aside className="hidden lg:flex w-60 bg-brown min-h-screen flex-col shrink-0">
        <div className="px-6 py-6 border-b border-brown-light/40">
          <Image
            src="/logo.png"
            alt="Madame Shelda"
            width={120}
            height={48}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <p className="font-label text-white/30 text-[0.5rem] mt-1.5 tracking-widest">
            YÖNETİM PANELİ
          </p>
        </div>
        <NavLinks />
        <SidebarFooter onLogout={handleLogout} />
      </aside>

      {/* Mobil/tablet — üst bar + hamburger drawer (lg altı) */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-brown px-4 py-3 shrink-0">
        <Image
          src="/logo.png"
          alt="Madame Shelda"
          width={100}
          height={40}
          className="h-7 w-auto object-contain brightness-0 invert"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="flex items-center justify-center w-10 h-10 text-white/80 hover:text-white transition-colors"
            aria-label="Menü"
          >
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="w-4/5 max-w-xs bg-brown border-none p-0 flex flex-col">
            <div className="px-6 py-6 border-b border-brown-light/40">
              <Image
                src="/logo.png"
                alt="Madame Shelda"
                width={120}
                height={48}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
              <p className="font-label text-white/30 text-[0.5rem] mt-1.5 tracking-widest">
                YÖNETİM PANELİ
              </p>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter onLogout={handleLogout} />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
