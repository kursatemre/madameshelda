"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Şifre hatalı.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/logo-dark.png"
            alt="Madame Shelda"
            width={140}
            height={56}
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="bg-white border border-sand p-8">
          <p className="font-label text-[#888480] text-[0.6rem] text-center mb-6">
            Admin Girişi
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                Şifre
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-underline py-3 text-[#1a1a1a] text-sm"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {error && (
              <p className="font-label text-red-500 text-[0.6rem]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brown text-white font-label py-4 hover:bg-brown-light transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
