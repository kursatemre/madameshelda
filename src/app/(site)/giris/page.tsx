"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { AuthCard } from "@/components/auth/AuthCard";

function GirisInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/hesabim";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <AuthCard title="Giriş Yap" subtitle="Hesabınıza giriş yaparak siparişlerinizi takip edin.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
            placeholder="ornek@email.com"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-label text-[#888480] text-[0.55rem]">Şifre</label>
            <Link href="/sifremi-unuttum" className="font-label text-gold text-[0.55rem] hover:text-brown transition-colors">
              Şifremi Unuttum
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-red-500 text-xs font-light">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <p className="text-center text-[#888480] text-xs font-light mt-6">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="text-gold hover:text-brown transition-colors">
          Üye Olun
        </Link>
      </p>
    </AuthCard>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={null}>
      <GirisInner />
    </Suspense>
  );
}
