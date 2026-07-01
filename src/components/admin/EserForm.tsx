"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toSlug, categoryLabels } from "@/data/products";
import type { ProductCategory, ProductVariant } from "@/data/products";

type ImageInput = { id: string; url: string };
type VariantDraft = { id: string; name: string; hex: string; price: string; available: boolean; image: string };

type FormData = {
  title: string; slug: string; category: ProductCategory; price: string;
  description: string; dimensions: string; materials: string;
  images: ImageInput[]; variants: VariantDraft[];
  is_available: boolean; is_featured: boolean;
};

const defaults: FormData = {
  title: "", slug: "", category: "ev", price: "",
  description: "", dimensions: "", materials: "",
  images: [], variants: [],
  is_available: true, is_featured: false,
};

export type EserFormProps = {
  initial?: Partial<FormData>;
  productId?: string;
};

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function EserForm({ initial, productId }: EserFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...defaults, ...initial });
  const [saving, setSaving] = useState(false);
  const [activeVariant, setActiveVariant] = useState<string | null>(null);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const newFileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (imageId: string, file: File) => {
    setUploadingIds((s) => new Set(s).add(imageId));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Yükleme hatası");
      setImageUrl(imageId, json.url);
      toast.success("Görsel yüklendi.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yükleme hatası");
    } finally {
      setUploadingIds((s) => { const n = new Set(s); n.delete(imageId); return n; });
    }
  };

  const handleNewFile = async (file: File) => {
    const id = uid();
    setForm((f) => ({ ...f, images: [...f.images, { id, url: "" }] }));
    await uploadFile(id, file);
  };

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleTitle = (title: string) =>
    setForm((f) => ({ ...f, title, slug: productId ? f.slug : toSlug(title) }));

  /* Images */
  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, { id: uid(), url: "" }] }));
  const setImageUrl = (id: string, url: string) =>
    setForm((f) => ({ ...f, images: f.images.map((i) => i.id === id ? { ...i, url } : i) }));
  const removeImage = (id: string) =>
    setForm((f) => ({ ...f, images: f.images.filter((i) => i.id !== id) }));

  /* Variants */
  const addVariant = () => {
    const id = uid();
    setForm((f) => ({
      ...f,
      variants: [...f.variants, { id, name: "", hex: "#c9a070", price: "", available: true, image: "" }],
    }));
    setActiveVariant(id);
  };
  const updateVariant = (id: string, changes: Partial<VariantDraft>) =>
    setForm((f) => ({ ...f, variants: f.variants.map((v) => v.id === id ? { ...v, ...changes } : v) }));
  const removeVariant = (id: string) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((v) => v.id !== id) }));
    if (activeVariant === id) setActiveVariant(null);
  };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Başlık ve slug zorunludur."); return;
    }
    setSaving(true);
    try {
      const variants: ProductVariant[] = form.variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          id: v.id, name: v.name.trim(), hex: v.hex,
          price: v.price ? parseFloat(v.price) : null,
          available: v.available,
          image: v.image || undefined,
        }));

      const payload = {
        title: form.title.trim(), slug: form.slug.trim(), category: form.category,
        price: form.price ? parseFloat(form.price) : null,
        description: form.description.trim() || null,
        dimensions: form.dimensions.trim() || null,
        materials: form.materials.trim() || null,
        images: form.images.map((i) => i.url.trim()).filter(Boolean),
        variants,
        is_available: form.is_available,
        is_featured: form.is_featured,
      };

      const url = productId ? `/api/admin/products/${productId}` : "/api/admin/products";
      const res = await fetch(url, {
        method: productId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Hata");
      toast.success(productId ? "Eser güncellendi." : "Eser eklendi.");
      router.push("/admin/eserler");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Top bar */}
      <div className="bg-white border-b border-sand sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
        <Link
          href="/admin/eserler"
          className="flex items-center gap-2 font-label text-[#888480] text-[0.6rem] hover:text-brown transition-colors group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
          Eserler
        </Link>
        <h1 className="font-serif text-[#1a1a1a] text-xl absolute left-1/2 -translate-x-1/2" style={{ fontStyle: "italic" }}>
          {productId ? "Eseri Düzenle" : "Yeni Eser"}
        </h1>
        <button
          onClick={save}
          disabled={saving || !form.title || !form.slug}
          className="bg-brown text-cream font-label text-[0.6rem] px-6 py-2.5 hover:bg-brown-light transition-colors disabled:opacity-50"
        >
          {saving ? "Kaydediliyor…" : productId ? "Güncelle" : "Yayınla"}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Sol sütun ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Temel Bilgiler */}
          <div className="bg-white border border-sand p-6">
            <h2 className="font-label text-[0.6rem] text-[#888480] mb-5 pb-3 border-b border-sand uppercase tracking-widest">
              Temel Bilgiler
            </h2>
            <div className="space-y-5">
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                  Başlık <span className="text-gold">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitle(e.target.value)}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-base"
                  placeholder="Sonbahar Koleksiyonu"
                />
              </div>
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-1.5">
                  URL <span className="text-gold">*</span>
                  <span className="ml-2 normal-case text-[#888480]">
                    /eser/<span className="text-brown">{form.slug || "…"}</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] font-mono text-sm"
                  placeholder="sonbahar-koleksiyonu"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                    Kategori <span className="text-gold">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value as ProductCategory)}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] bg-transparent"
                  >
                    {(Object.keys(categoryLabels) as ProductCategory[]).map((k) => (
                      <option key={k} value={k}>{categoryLabels[k]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                    Baz Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className="w-full input-underline py-2.5 text-[#1a1a1a]"
                    placeholder="2400"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Açıklama & Detaylar */}
          <div className="bg-white border border-sand p-6">
            <h2 className="font-label text-[0.6rem] text-[#888480] mb-5 pb-3 border-b border-sand uppercase tracking-widest">
              Açıklama & Detaylar
            </h2>
            <div className="space-y-5">
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] resize-none text-sm leading-relaxed"
                  rows={4}
                  placeholder="Eser hakkında detaylı açıklama…"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Boyutlar</label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) => set("dimensions", e.target.value)}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="50×70 cm"
                  />
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Malzeme</label>
                  <input
                    type="text"
                    value={form.materials}
                    onChange={(e) => set("materials", e.target.value)}
                    className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                    placeholder="Kurutulmuş çiçekler, doğal lifler"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Görseller */}
          <div className="bg-white border border-sand p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-sand">
              <h2 className="font-label text-[0.6rem] text-[#888480] uppercase tracking-widest">Görseller</h2>
              <button onClick={addImage} className="flex items-center gap-1.5 font-label text-gold text-[0.55rem] hover:text-brown transition-colors">
                <Plus size={11} /> Ekle
              </button>
            </div>
            {/* Hidden file inputs */}
            <input
              ref={newFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleNewFile(f);
                e.target.value = "";
              }}
            />

            {form.images.length === 0 ? (
              <div
                className="w-full border border-dashed border-sand py-10 flex flex-col items-center gap-3 cursor-pointer hover:border-brown/30 transition-colors group"
                onClick={() => newFileRef.current?.click()}
              >
                <Upload size={20} className="text-sand-dark group-hover:text-brown/50 transition-colors" />
                <span className="font-label text-[#888480] text-[0.6rem]">Dosya seç veya URL ekle</span>
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); newFileRef.current?.click(); }}
                    className="font-label text-[0.55rem] px-3 py-1.5 bg-brown text-cream hover:bg-brown-light transition-colors"
                  >
                    Dosya Seç
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); addImage(); }}
                    className="font-label text-[0.55rem] px-3 py-1.5 border border-sand text-[#888480] hover:border-brown/40 transition-colors"
                  >
                    URL Ekle
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {form.images.map((img, idx) => {
                  const isUploading = uploadingIds.has(img.id);
                  return (
                    <div key={img.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 shrink-0 bg-sand border border-sand overflow-hidden relative">
                        {isUploading ? (
                          <div className="w-full h-full flex items-center justify-center bg-cream">
                            <Loader2 size={16} className="text-brown animate-spin" />
                          </div>
                        ) : img.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img.url} alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        {idx === 0 && (
                          <span className="font-label text-[0.5rem] text-gold block mb-1">Ana görsel</span>
                        )}
                        <input
                          type="url"
                          value={img.url}
                          onChange={(e) => setImageUrl(img.id, e.target.value)}
                          className="w-full input-underline py-1.5 text-[#1a1a1a] text-sm"
                          placeholder="https://... veya dosya yükle →"
                          disabled={isUploading}
                        />
                      </div>
                      {/* Per-image file upload */}
                      <input
                        type="file"
                        id={`file-${img.id}`}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadFile(img.id, f);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById(`file-${img.id}`)?.click()}
                        disabled={isUploading}
                        title="Dosyadan yükle"
                        className="p-1.5 text-[#888480] hover:text-brown transition-colors shrink-0 disabled:opacity-40"
                      >
                        {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                      </button>
                      <button onClick={() => removeImage(img.id)} className="p-1 text-[#888480] hover:text-red-500 transition-colors shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => newFileRef.current?.click()}
                    className="flex items-center gap-1.5 font-label text-[0.55rem] text-brown hover:text-brown-light transition-colors"
                  >
                    <Upload size={11} /> Dosya yükle
                  </button>
                  <span className="text-sand-dark text-xs">·</span>
                  <button
                    type="button"
                    onClick={addImage}
                    className="flex items-center gap-1.5 font-label text-[#888480] text-[0.55rem] hover:text-brown transition-colors"
                  >
                    <Plus size={11} /> URL ekle
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Renk Varyantları */}
          <div className="bg-white border border-sand p-6">
            <div className="flex items-center justify-between mb-1 pb-3 border-b border-sand">
              <div>
                <h2 className="font-label text-[0.6rem] text-[#888480] uppercase tracking-widest">Renk Varyantları</h2>
                <p className="font-label text-[0.5rem] text-[#888480] mt-1 normal-case">
                  Her varyanta fiyat girilmezse baz fiyat geçerlidir.
                </p>
              </div>
              <button onClick={addVariant} className="flex items-center gap-1.5 font-label text-gold text-[0.55rem] hover:text-brown transition-colors">
                <Plus size={11} /> Renk Ekle
              </button>
            </div>

            {form.variants.length === 0 ? (
              <button
                onClick={addVariant}
                className="w-full border border-dashed border-sand py-10 flex flex-col items-center gap-3 hover:border-brown/30 transition-colors group mt-4"
              >
                <div className="flex gap-2.5">
                  {["#5c1a2e", "#c9a070", "#f0dde4", "#e8c99a", "#d4b0be"].map((hex) => (
                    <div key={hex} className="w-5 h-5 rounded-full border border-black/10" style={{ background: hex }} />
                  ))}
                </div>
                <span className="font-label text-[#888480] text-[0.6rem]">Renk varyantı ekle</span>
              </button>
            ) : (
              <div className="mt-4">
                {/* Swatch preview row */}
                <div className="flex items-center gap-2.5 flex-wrap mb-5">
                  {form.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVariant(activeVariant === v.id ? null : v.id)}
                      title={v.name || "İsimsiz"}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                        activeVariant === v.id ? "border-brown scale-110 shadow-md" : "border-sand hover:border-brown/40 hover:scale-105"
                      }`}
                      style={{ background: v.hex }}
                    />
                  ))}
                  <button
                    onClick={addVariant}
                    className="w-9 h-9 rounded-full border-2 border-dashed border-sand hover:border-brown/40 flex items-center justify-center transition-colors"
                  >
                    <Plus size={13} className="text-[#888480]" />
                  </button>
                </div>

                {/* Variant list */}
                <div className="space-y-2">
                  {form.variants.map((v) => (
                    <div
                      key={v.id}
                      className={`border transition-all duration-200 ${activeVariant === v.id ? "border-brown/40 shadow-sm" : "border-sand"}`}
                    >
                      {/* Header */}
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        onClick={() => setActiveVariant(activeVariant === v.id ? null : v.id)}
                      >
                        <div className="w-6 h-6 rounded-full shrink-0 border border-black/10 shadow-sm" style={{ background: v.hex }} />
                        <span className="font-label text-[0.62rem] text-[#1a1a1a] flex-1 truncate">
                          {v.name || <span className="text-[#888480] italic">İsimsiz renk</span>}
                        </span>
                        {v.price && (
                          <span className="font-serif text-brown text-sm shrink-0" style={{ fontStyle: "italic" }}>
                            ₺{parseFloat(v.price).toLocaleString("tr-TR")}
                          </span>
                        )}
                        <span className={`font-label text-[0.5rem] px-2 py-0.5 shrink-0 ${v.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
                          {v.available ? "Aktif" : "Tükendi"}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeVariant(v.id); }}
                          className="p-1 text-[#888480] hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </button>

                      {/* Expanded editor */}
                      {activeVariant === v.id && (
                        <div className="px-4 pb-5 pt-2 border-t border-sand bg-[#fdfcfb]">
                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="font-label text-[#888480] text-[0.5rem] block mb-2">Renk Adı</label>
                              <input
                                autoFocus
                                type="text"
                                value={v.name}
                                onChange={(e) => updateVariant(v.id, { name: e.target.value })}
                                className="w-full input-underline py-2 text-[#1a1a1a] text-sm"
                                placeholder="Bordo Şarap"
                              />
                            </div>
                            <div>
                              <label className="font-label text-[#888480] text-[0.5rem] block mb-2">Renk</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={v.hex}
                                  onChange={(e) => updateVariant(v.id, { hex: e.target.value })}
                                  className="w-10 h-9 cursor-pointer border-0 bg-transparent p-0 rounded"
                                />
                                <input
                                  type="text"
                                  value={v.hex}
                                  onChange={(e) => updateVariant(v.id, { hex: e.target.value })}
                                  className="flex-1 input-underline py-2 text-[#1a1a1a] text-sm font-mono"
                                  placeholder="#5c1a2e"
                                  maxLength={7}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="font-label text-[#888480] text-[0.5rem] block mb-2">
                                Fiyat (₺) <span className="normal-case text-[#888480]">— boş = baz fiyat</span>
                              </label>
                              <input
                                type="number"
                                value={v.price}
                                onChange={(e) => updateVariant(v.id, { price: e.target.value })}
                                className="w-full input-underline py-2 text-[#1a1a1a] text-sm"
                                placeholder={form.price || "Baz fiyatı kullan"}
                                min="0"
                              />
                            </div>
                            <div className="flex items-end pb-2">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <button
                                  type="button"
                                  onClick={() => updateVariant(v.id, { available: !v.available })}
                                  className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${v.available ? "bg-green-500" : "bg-gray-200"}`}
                                >
                                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${v.available ? "translate-x-5" : "translate-x-0.5"}`} />
                                </button>
                                <span className="font-label text-[#888480] text-[0.55rem]">Aktif (Satışta)</span>
                              </label>
                            </div>
                          </div>

                          {/* Varyant görseli */}
                          <div className="mt-4 pt-4 border-t border-sand">
                            <label className="font-label text-[#888480] text-[0.5rem] block mb-2">
                              Varyant Görseli <span className="normal-case text-[#888480]">— bu renk seçildiğinde gösterilir</span>
                            </label>
                            <div className="flex items-center gap-3">
                              {v.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={v.image} alt="" className="w-14 h-14 object-cover border border-sand shrink-0" />
                              )}
                              <div className="flex-1">
                                <input
                                  type="file"
                                  id={`variant-file-${v.id}`}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploadingIds((s) => new Set(s).add(`v-${v.id}`));
                                    try {
                                      const fd = new FormData();
                                      fd.append("file", file);
                                      fd.append("folder", "products");
                                      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                                      const json = await res.json();
                                      if (!res.ok) throw new Error(json.error);
                                      updateVariant(v.id, { image: json.url });
                                      toast.success("Görsel yüklendi.");
                                    } catch (err) {
                                      toast.error(err instanceof Error ? err.message : "Hata");
                                    } finally {
                                      setUploadingIds((s) => { const n = new Set(s); n.delete(`v-${v.id}`); return n; });
                                    }
                                    e.target.value = "";
                                  }}
                                />
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => document.getElementById(`variant-file-${v.id}`)?.click()}
                                    disabled={uploadingIds.has(`v-${v.id}`)}
                                    className="flex items-center gap-1.5 font-label text-[0.55rem] px-3 py-1.5 bg-brown text-cream hover:bg-brown-light transition-colors disabled:opacity-50"
                                  >
                                    {uploadingIds.has(`v-${v.id}`) ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
                                    {uploadingIds.has(`v-${v.id}`) ? "Yükleniyor…" : v.image ? "Değiştir" : "Görsel Yükle"}
                                  </button>
                                  {v.image && (
                                    <button
                                      type="button"
                                      onClick={() => updateVariant(v.id, { image: "" })}
                                      className="font-label text-[0.55rem] px-3 py-1.5 border border-sand text-[#888480] hover:border-red-200 hover:text-red-500 transition-colors"
                                    >
                                      Kaldır
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sağ sütun — sticky sidebar ── */}
        <div className="lg:col-span-1 space-y-4">
          {/* Kaydet */}
          <button
            onClick={save}
            disabled={saving || !form.title || !form.slug}
            className="w-full bg-brown text-cream font-label py-4 text-[0.65rem] hover:bg-brown-light transition-colors disabled:opacity-50"
          >
            {saving ? "Kaydediliyor…" : productId ? "Güncelle" : "Yayınla"}
          </button>

          {/* Durum */}
          <div className="bg-white border border-sand p-5 space-y-5">
            <h3 className="font-label text-[0.6rem] text-[#888480] pb-3 border-b border-sand uppercase tracking-widest">Durum</h3>
            <label className="flex items-center justify-between cursor-pointer gap-4">
              <div>
                <p className="font-label text-[#1a1a1a] text-[0.6rem]">Aktif</p>
                <p className="font-label text-[#888480] text-[0.5rem] mt-0.5">Galeride görünür, satışa açık</p>
              </div>
              <button
                type="button"
                onClick={() => set("is_available", !form.is_available)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${form.is_available ? "bg-green-500" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_available ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer gap-4">
              <div>
                <p className="font-label text-[#1a1a1a] text-[0.6rem]">Öne Çıkan</p>
                <p className="font-label text-[#888480] text-[0.5rem] mt-0.5">Anasayfada ve listenin üstünde</p>
              </div>
              <button
                type="button"
                onClick={() => set("is_featured", !form.is_featured)}
                className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${form.is_featured ? "bg-gold" : "bg-gray-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </label>
          </div>

          {/* Mini önizleme */}
          <div className="bg-white border border-sand p-5">
            <h3 className="font-label text-[0.6rem] text-[#888480] pb-3 border-b border-sand mb-4 uppercase tracking-widest">
              Önizleme
            </h3>
            <div className="border border-sand overflow-hidden">
              <div
                className="h-32 relative overflow-hidden"
                style={{ background: form.images[0]?.url ? undefined : "linear-gradient(135deg, #fdf8f3 0%, #f0dde4 100%)" }}
              >
                {form.images[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.images[0].url} alt="" key={form.images[0].url}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 140" fill="none">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <ellipse key={a} cx="100" cy="40" rx="12" ry="38" fill="#5c1a2e" transform={`rotate(${a} 100 70)`} />
                    ))}
                    <circle cx="100" cy="70" r="10" fill="#5c1a2e" />
                  </svg>
                )}
              </div>
              <div className="p-3">
                <p className="font-serif text-[#1a1a1a] text-sm truncate" style={{ fontStyle: "italic" }}>
                  {form.title || <span className="text-[#888480]">Eser başlığı</span>}
                </p>
                <p className="font-serif text-brown text-lg mt-1" style={{ fontStyle: "italic" }}>
                  {form.price ? `₺${parseFloat(form.price).toLocaleString("tr-TR")}` : "₺—"}
                </p>
                {form.variants.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {form.variants.slice(0, 6).map((v) => (
                      <div
                        key={v.id}
                        className="w-3.5 h-3.5 rounded-full border border-black/10"
                        style={{ background: v.hex }}
                        title={v.name}
                      />
                    ))}
                    {form.variants.length > 6 && (
                      <span className="font-label text-[0.45rem] text-[#888480]">+{form.variants.length - 6}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
