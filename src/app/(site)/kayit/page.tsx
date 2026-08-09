"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { AuthCard } from "@/components/auth/AuthCard";

type FormData = { full_name: string; email: string; phone: string; password: string };

export default function KayitPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ full_name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, phone: form.phone },
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/hesabim` : undefined,
      },
    });
    setLoading(false);
    if (error) {
      setError(translateAuthError(error.message));
      return;
    }
    // E-posta doğrulaması kapalıysa oturum hemen açılır; açıksa doğrulama
    // bekleniyor ekranı gösterilir.
    if (data.session) {
      router.push("/hesabim");
      router.refresh();
    } else {
      setNeedsConfirmation(true);
    }
  };

  if (needsConfirmation) {
    return (
      <AuthCard title="E-postanızı Kontrol Edin" subtitle={`${form.email} adresine bir doğrulama bağlantısı gönderdik.`}>
        <p className="text-[#888480] font-light text-sm text-center">
          Bağlantıya tıkladıktan sonra hesabınıza giriş yapabilirsiniz.
        </p>
        <Link href="/giris" className="block text-center font-label text-gold text-[0.6rem] hover:text-brown transition-colors mt-6">
          Giriş sayfasına dön →
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Üye Ol" subtitle="Sipariş geçmişinizi takip etmek için hesap oluşturun.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Ad Soyad</label>
          <input required value={form.full_name} onChange={set("full_name")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" placeholder="Ad Soyad" />
        </div>
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">E-posta</label>
          <input type="email" required value={form.email} onChange={set("email")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" placeholder="ornek@email.com" />
        </div>
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Telefon</label>
          <input type="tel" required value={form.phone} onChange={set("phone")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" placeholder="05XX XXX XX XX" />
        </div>
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Şifre</label>
          <input type="password" required minLength={6} value={form.password} onChange={set("password")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" placeholder="En az 6 karakter" />
        </div>
        {error && <p className="text-red-500 text-xs font-light">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
        >
          {loading ? "Hesap oluşturuluyor..." : "Üye Ol"}
        </button>
      </form>
      <p className="text-center text-[#888480] text-xs font-light mt-6">
        Zaten üye misiniz?{" "}
        <Link href="/giris" className="text-gold hover:text-brown transition-colors">
          Giriş Yapın
        </Link>
      </p>
    </AuthCard>
  );
}
