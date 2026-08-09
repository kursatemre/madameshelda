"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/auth-errors";

type ProfileData = { full_name: string; phone: string; address: string; city: string };

export function ProfileForm({
  email, fullName, phone, address, city,
}: {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
}) {
  const [form, setForm] = useState<ProfileData>({ full_name: fullName, phone, address, city });
  const [saving, setSaving] = useState(false);

  const set = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: form });
    setSaving(false);
    if (error) return toast.error(translateAuthError(error.message));
    toast.success("Bilgileriniz güncellendi.");
  };

  return (
    <form onSubmit={save} className="space-y-5">
      <div>
        <label className="font-label text-[#888480] text-[0.55rem] block mb-2">E-posta</label>
        <p className="text-[#1a1a1a] text-sm py-2.5">{email}</p>
      </div>
      <div>
        <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Ad Soyad</label>
        <input value={form.full_name} onChange={set("full_name")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" />
      </div>
      <div>
        <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Telefon</label>
        <input value={form.phone} onChange={set("phone")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" />
      </div>
      <div>
        <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Adres</label>
        <input
          value={form.address}
          onChange={set("address")}
          className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
          placeholder="Mahalle, sokak, bina, daire"
        />
      </div>
      <div>
        <label className="font-label text-[#888480] text-[0.55rem] block mb-2">İl / İlçe</label>
        <input value={form.city} onChange={set("city")} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="w-full bg-brown text-cream font-label py-3 text-[0.6rem] hover:bg-brown-light transition-colors disabled:opacity-60"
      >
        {saving ? "Kaydediliyor..." : "Bilgileri Kaydet"}
      </button>
    </form>
  );
}
