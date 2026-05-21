"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Phone, Mail, MapPin } from "lucide-react";

function InstagramIcon({ size = 15, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function IletisimPage() {
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
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Mesajınız iletildi. En kısa sürede dönüş yapacağız.");
    setForm({ full_name: "", email: "", phone: "", message: "" });
  };

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 lg:px-12 border-b border-sand">
        <div className="max-w-7xl mx-auto">
          <p className="font-label text-gold text-[0.65rem] mb-4">— İletişim</p>
          <h1
            className="font-serif text-brown leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontStyle: "italic" }}
          >
            Birlikte
            <br />
            <span className="text-gold">konuşalım</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Info */}
          <div>
            <p className="text-brown/60 font-light text-sm leading-relaxed mb-12 max-w-sm">
              Özel sipariş, workshop soruları veya genel bilgi için bize
              ulaşabilirsiniz. En kısa sürede yanıt vermeye çalışıyoruz.
            </p>

            <div className="space-y-8">
              {[
                { icon: Phone, label: "Telefon", value: "+90 500 123 45 67", href: "tel:+905001234567" },
                { icon: Mail, label: "E-posta", value: "info@madameshelda.com", href: "mailto:info@madameshelda.com" },
                { icon: MapPin, label: "Konum", value: "Soma, Manisa, Türkiye", href: "#" },
                { icon: InstagramIcon, label: "Instagram", value: "@madameshelda", href: "https://www.instagram.com" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="w-10 h-10 border border-sand flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-label text-gold/70 text-[0.55rem] mb-1">
                      {label}
                    </p>
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-brown font-light text-sm hover:text-gold transition-colors duration-300"
                    >
                      {value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
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
          </div>
        </div>
      </section>
    </>
  );
}
