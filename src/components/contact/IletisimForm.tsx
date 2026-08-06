"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function IletisimForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone || null,
          subject: "İletişim Formu",
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata oluştu.");
      toast.success("Mesajınız iletildi. En kısa sürede dönüş yapacağız.");
      setForm({ full_name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {[
        { name: "full_name", label: "Ad Soyad", type: "text", required: true },
        { name: "email", label: "E-posta", type: "email", required: true },
        { name: "phone", label: "Telefon", type: "tel", required: false },
      ].map((field) => (
        <div key={field.name} className="relative">
          <label className="font-label text-brown/50 text-[0.55rem] block mb-2">
            {field.label}
            {field.required && <span className="text-gold ml-1">*</span>}
          </label>
          <input
            type={field.type}
            required={field.required}
            value={form[field.name as keyof typeof form]}
            onChange={(e) =>
              setForm((p) => ({ ...p, [field.name]: e.target.value }))
            }
            className="w-full input-underline py-3 text-brown text-sm focus:outline-none"
            placeholder={`${field.label} giriniz`}
          />
        </div>
      ))}

      <div>
        <label className="font-label text-brown/50 text-[0.55rem] block mb-2">
          Mesajınız <span className="text-gold ml-1">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) =>
            setForm((p) => ({ ...p, message: e.target.value }))
          }
          className="w-full input-underline py-3 text-brown text-sm focus:outline-none resize-none"
          placeholder="Nasıl yardımcı olabiliriz?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-brown text-cream font-label py-4 hover:bg-brown-light transition-colors duration-300 disabled:opacity-60 group"
      >
        {loading ? (
          "Gönderiliyor..."
        ) : (
          <>
            Gönder
            <Send
              size={13}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </>
        )}
      </button>
    </form>
  );
}
