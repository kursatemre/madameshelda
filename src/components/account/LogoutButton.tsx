"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 font-label text-[#888480] hover:text-brown text-[0.6rem] transition-colors shrink-0"
    >
      <LogOut size={13} />
      Çıkış Yap
    </button>
  );
}
