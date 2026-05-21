"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  CalendarDays,
  ClipboardList,
  LogOut,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/eserler", label: "Eserler", icon: ImageIcon },
  { href: "/admin/workshoplar", label: "Workshoplar", icon: CalendarDays },
  { href: "/admin/basvurular", label: "Başvurular", icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-60 bg-brown min-h-screen flex flex-col shrink-0">
      {/* Logo */}
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

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 font-label text-[0.65rem] transition-all duration-200 ${
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

      {/* Footer */}
      <div className="px-3 pb-6 space-y-0.5 border-t border-brown-light/40 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 font-label text-[0.65rem] text-white/40 hover:text-white transition-colors duration-200"
        >
          <ExternalLink size={15} />
          Siteyi Görüntüle
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 font-label text-[0.65rem] text-white/40 hover:text-white transition-colors duration-200"
        >
          <LogOut size={15} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
