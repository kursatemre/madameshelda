"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, RefreshCw, Percent, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order_total: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  code: "", type: "percent" as "percent" | "fixed", value: "", min_order_total: "", max_uses: "", expires_at: "",
};

export default function AdminKuponlarPage() {
  const [data, setData] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  // Render sırasında doğrudan Date.now() çağırmak yerine (impure), tek
  // seferlik bir "şimdi" anlık görüntüsü — süre dolmuş rozetleri için yeterli.
  const [now] = useState(() => Date.now());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: form.value,
          min_order_total: form.min_order_total,
          max_uses: form.max_uses || null,
          expires_at: form.expires_at || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Kupon oluşturulamadı.");
      setData((p) => [json, ...p]);
      setForm(emptyForm);
      setFormOpen(false);
      toast.success("Kupon oluşturuldu.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kupon oluşturulamadı.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c: Coupon) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, is_active: !c.is_active }),
    });
    if (!res.ok) return toast.error("Güncellenemedi.");
    setData((p) => p.map((x) => (x.id === c.id ? { ...x, is_active: !x.is_active } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Silinemedi.");
    setData((p) => p.filter((c) => c.id !== id));
    toast.success("Kupon silindi.");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-start justify-between mb-6 lg:mb-8 gap-3">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl" style={{ fontStyle: "italic" }}>
            Kuponlar
          </h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setFormOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-brown text-cream font-label text-[0.6rem] px-3.5 py-2.5 hover:bg-brown-light transition-colors"
          >
            {formOpen ? <X size={13} /> : <Plus size={13} />}
            {formOpen ? "Vazgeç" : "Yeni Kupon"}
          </button>
          <button onClick={fetchData} className="p-2.5 text-[#888480] hover:text-brown transition-colors" title="Yenile">
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={createCoupon} className="bg-white border border-sand p-5 mb-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Kupon Kodu *</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm uppercase"
                placeholder="HOSGELDIN10"
              />
            </div>
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Tip</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percent" | "fixed" }))}
                className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm bg-transparent"
              >
                <option value="percent">Yüzde (%)</option>
                <option value="fixed">Sabit Tutar (₺)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                Değer * {form.type === "percent" ? "(%)" : "(₺)"}
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.value}
                onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                placeholder={form.type === "percent" ? "10" : "50"}
              />
            </div>
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Min. Sepet Tutarı (₺)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.min_order_total}
                onChange={(e) => setForm((f) => ({ ...f, min_order_total: e.target.value }))}
                className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Kullanım Limiti</label>
              <input
                type="number"
                min="1"
                value={form.max_uses}
                onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
                className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                placeholder="Sınırsız"
              />
            </div>
          </div>

          <div>
            <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Son Kullanma Tarihi</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
              className="w-full sm:w-56 input-underline py-2.5 text-[#1a1a1a] text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-brown text-cream font-label text-[0.65rem] px-6 py-3 hover:bg-brown-light transition-colors disabled:opacity-50"
          >
            {saving ? "Oluşturuluyor…" : "Kuponu Oluştur"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="py-16 text-center font-label text-[#888480] text-[0.6rem]">Yükleniyor...</div>
      ) : data.length === 0 ? (
        <div className="py-16 text-center">
          <Percent size={24} className="mx-auto text-[#c9c4bd] mb-3" />
          <p className="font-label text-[#888480] text-[0.6rem]">Henüz kupon yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((c) => {
            const expired = c.expires_at && new Date(c.expires_at).getTime() < now;
            const exhausted = c.max_uses !== null && c.used_count >= c.max_uses;
            return (
              <div key={c.id} className="bg-white border border-sand p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1.5">
                    <span className="font-label text-brown text-[0.75rem] tracking-wider">{c.code}</span>
                    <span className="font-label text-[0.55rem] px-2 py-1 bg-cream-dark text-[#888480]">
                      {c.type === "percent" ? `%${c.value}` : `₺${c.value.toLocaleString("tr-TR")}`}
                    </span>
                    <span className={`font-label text-[0.55rem] px-2 py-1 border ${
                      c.is_active && !expired && !exhausted
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      {!c.is_active ? "Pasif" : expired ? "Süresi Doldu" : exhausted ? "Limit Doldu" : "Aktif"}
                    </span>
                  </div>
                  <p className="font-label text-[#888480] text-[0.55rem] normal-case">
                    {c.min_order_total > 0 && `Min. ₺${c.min_order_total.toLocaleString("tr-TR")} · `}
                    Kullanım: {c.used_count}{c.max_uses ? `/${c.max_uses}` : ""}
                    {c.expires_at && ` · Son: ${new Date(c.expires_at).toLocaleDateString("tr-TR")}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={c.is_active} onChange={() => toggleActive(c)} className="accent-brown w-4 h-4" />
                    <span className="font-label text-[#888480] text-[0.55rem]">Aktif</span>
                  </label>
                  <button onClick={() => remove(c.id)} className="p-2 text-[#888480] hover:text-red-600 transition-colors" title="Sil">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
