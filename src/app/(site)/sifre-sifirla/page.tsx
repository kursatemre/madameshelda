"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";
import { AuthCard } from "@/components/auth/AuthCard";

export default function SifreSifirlaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    // Supabase'in e-postayla gönderdiği bağlantı, sayfa yüklendiğinde
    // URL'deki recovery token'ını otomatik olarak geçici bir oturuma
    // çevirir — bu PASSWORD_RECOVERY event'i olarak bildirilir.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Zamanlamaya göre event kaçırılmışsa (ör. token zaten işlenmişse) mevcut
    // oturumu da kontrol ederiz.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(translateAuthError(error.message));
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/hesabim"), 1500);
  };

  if (done) {
    return <AuthCard title="Şifreniz Güncellendi" subtitle="Hesabınıza yönlendiriliyorsunuz..." />;
  }

  if (!ready) {
    return (
      <AuthCard title="Şifre Sıfırlama" subtitle="Bağlantı doğrulanıyor...">
        <p className="text-[#888480] font-light text-sm text-center">
          Bu sayfaya doğrudan gelmiş olabilirsiniz. Bağlantı geçersiz veya süresi
          dolmuşsa{" "}
          <Link href="/sifremi-unuttum" className="text-gold hover:text-brown transition-colors">
            yeni bir tane isteyin
          </Link>
          .
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Yeni Şifre Belirle" subtitle="Hesabınız için yeni bir şifre girin.">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Yeni Şifre</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
            placeholder="En az 6 karakter"
          />
        </div>
        <div>
          <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Yeni Şifre (Tekrar)</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
            placeholder="Şifrenizi tekrar girin"
          />
        </div>
        {error && <p className="text-red-500 text-xs font-light">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brown text-cream font-label py-3.5 text-[0.65rem] hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
    </AuthCard>
  );
}
