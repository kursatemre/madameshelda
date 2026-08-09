"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { AuthCard } from "@/components/auth/AuthCard";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/sifre-sifirla` : undefined,
    });
    setLoading(false);
    if (error) {
      setError(translateAuthError(error.message));
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Bağlantı Gönderildi" subtitle={`${email} adresine şifre sıfırlama bağlantısı gönderdik.`}>
        <Link href="/giris" className="block text-center font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
          Giriş sayfasına dön →
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Şifremi Unuttum" subtitle="E-posta adresinize bir sıfırlama bağlantısı gönderelim.">
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
        {error && <p className="text-red-500 text-xs font-light">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
        >
          {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
        </button>
      </form>
      <p className="text-center text-[#888480] text-xs font-light mt-6">
        <Link href="/giris" className="text-gold hover:text-brown transition-colors">
          ← Giriş sayfasına dön
        </Link>
      </p>
    </AuthCard>
  );
}
