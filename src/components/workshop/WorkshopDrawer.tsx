"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Send } from "lucide-react";

interface WorkshopDrawerProps {
  open: boolean;
  onClose: () => void;
  workshopTitle: string;
  workshopId: string;
}

export function WorkshopDrawer({
  open,
  onClose,
  workshopTitle,
  workshopId,
}: WorkshopDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/workshop-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshop_id: workshopId,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hata oluştu.");
      toast.success("Başvurunuz alındı! Onay bilgisi e-postanıza gönderilecek.");
      onClose();
      setForm({ full_name: "", email: "", phone: "", notes: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="bg-cream border-t border-sand max-h-[90vh]">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-0.5 bg-sand rounded-full" />
        </div>

        <DrawerHeader className="px-6 lg:px-10 pt-4 pb-0">
          <DrawerTitle
            className="font-serif text-brown text-2xl text-left"
            style={{ fontStyle: "italic" }}
          >
            Workshop Başvurusu
          </DrawerTitle>
          <DrawerDescription className="font-label text-gold text-[0.6rem] text-left mt-1">
            {workshopTitle}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 lg:px-10 py-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-7">
            {[
              { name: "full_name", label: "Ad Soyad", type: "text", required: true },
              { name: "email", label: "E-posta", type: "email", required: true },
              { name: "phone", label: "Telefon", type: "tel", required: true },
            ].map((field) => (
              <div key={field.name}>
                <label className="font-label text-brown/50 text-[0.55rem] block mb-2">
                  {field.label} <span className="text-gold">*</span>
                </label>
                <input
                  type={field.type}
                  required={field.required}
                  value={form[field.name as keyof typeof form]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field.name]: e.target.value }))
                  }
                  className="w-full input-underline py-2.5 text-brown text-sm"
                  placeholder={`${field.label} giriniz`}
                />
              </div>
            ))}

            <div>
              <label className="font-label text-brown/50 text-[0.55rem] block mb-2">
                Notunuz
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, notes: e.target.value }))
                }
                className="w-full input-underline py-2.5 text-brown text-sm resize-none"
                placeholder="Özel sorularınız var mı?"
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
                  Başvuruyu Tamamla
                  <Send
                    size={13}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
