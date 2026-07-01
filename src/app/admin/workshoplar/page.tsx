"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Image as ImageIcon, X, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { toSlug } from "@/data/products";

type WorkshopImage = { id: string; url: string; caption: string; sort_order: number };
type WorkshopRow = {
  id: string; slug: string; title: string; description: string | null;
  duration_hours: number; level: string; includes: string[] | null; is_active: boolean;
};

const emptyWsForm = { title: "", slug: "", description: "", duration_hours: "3", level: "Başlangıç", includes: "" };
const LEVELS = ["Başlangıç", "Orta", "İleri"];

export default function AdminWorkshoplarPage() {
  const [tab, setTab] = useState<"gorseller" | "workshoplar">("workshoplar");

  /* ── IMAGES ── */
  const [images, setImages] = useState<WorkshopImage[]>([]);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgModal, setImgModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [imgSaving, setImgSaving] = useState(false);

  const fetchImages = useCallback(async () => {
    setImgLoading(true);
    try {
      const res = await fetch("/api/admin/workshop-images");
      if (!res.ok) throw new Error();
      setImages(await res.json());
    } catch { toast.error("Görseller yüklenemedi."); }
    finally { setImgLoading(false); }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const addImage = async () => {
    if (!newUrl.trim()) return;
    setImgSaving(true);
    try {
      const res = await fetch("/api/admin/workshop-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl.trim(), caption: newCaption.trim(), sort_order: images.length }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Hata");
      setImages((p) => [...p, json as WorkshopImage]);
      setNewUrl(""); setNewCaption(""); setImgModal(false);
      toast.success("Görsel eklendi.");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Hata"); }
    finally { setImgSaving(false); }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("Görseli sil?")) return;
    setImages((p) => p.filter((i) => i.id !== id));
    try {
      const res = await fetch("/api/admin/workshop-images", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Silindi.");
    } catch { toast.error("Silme başarısız."); fetchImages(); }
  };

  /* ── WORKSHOPS ── */
  const [workshops, setWorkshops] = useState<WorkshopRow[]>([]);
  const [wsLoading, setWsLoading] = useState(true);
  const [wsModal, setWsModal] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkshopRow | null>(null);
  const [wsForm, setWsForm] = useState(emptyWsForm);
  const [wsSaving, setWsSaving] = useState(false);

  const fetchWorkshops = useCallback(async () => {
    setWsLoading(true);
    try {
      const res = await fetch("/api/admin/workshops");
      if (!res.ok) throw new Error();
      setWorkshops(await res.json());
    } catch { toast.error("Workshoplar yüklenemedi."); }
    finally { setWsLoading(false); }
  }, []);

  useEffect(() => { fetchWorkshops(); }, [fetchWorkshops]);

  const openAdd = () => {
    setEditTarget(null);
    setWsForm(emptyWsForm);
    setWsModal(true);
  };

  const openEdit = (ws: WorkshopRow) => {
    setEditTarget(ws);
    setWsForm({
      title: ws.title,
      slug: ws.slug,
      description: ws.description ?? "",
      duration_hours: ws.duration_hours.toString(),
      level: ws.level,
      includes: (ws.includes ?? []).join("\n"),
    });
    setWsModal(true);
  };

  const saveWorkshop = async () => {
    if (!wsForm.title || !wsForm.slug || !wsForm.level) {
      toast.error("Başlık, slug ve seviye zorunludur."); return;
    }
    setWsSaving(true);
    try {
      const payload = {
        title: wsForm.title,
        slug: wsForm.slug,
        description: wsForm.description || null,
        duration_hours: parseInt(wsForm.duration_hours) || 3,
        level: wsForm.level,
        includes: wsForm.includes.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      const url = editTarget ? `/api/admin/workshops/${editTarget.id}` : "/api/admin/workshops";
      const method = editTarget ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Hata");
      toast.success(editTarget ? "Güncellendi." : "Workshop eklendi.");
      setWsModal(false);
      fetchWorkshops();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Hata"); }
    finally { setWsSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    setWorkshops((p) => p.map((w) => w.id === id ? { ...w, is_active: !current } : w));
    try {
      const res = await fetch(`/api/admin/workshops/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !current }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setWorkshops((p) => p.map((w) => w.id === id ? { ...w, is_active: current } : w));
      toast.error("Güncelleme başarısız.");
    }
  };

  const deleteWorkshop = async (id: string, title: string) => {
    if (!confirm(`"${title}" silinsin mi?`)) return;
    setWorkshops((p) => p.filter((w) => w.id !== id));
    try {
      const res = await fetch(`/api/admin/workshops/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Workshop silindi.");
    } catch { toast.error("Silme başarısız."); fetchWorkshops(); }
  };

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
          <h1 className="font-serif text-[#1a1a1a] text-3xl" style={{ fontStyle: "italic" }}>
            Workshoplar
          </h1>
        </div>
        <button
          onClick={tab === "gorseller" ? () => setImgModal(true) : openAdd}
          className="inline-flex items-center gap-2 bg-brown text-white font-label px-5 py-3 hover:bg-brown-light transition-colors duration-200"
        >
          <Plus size={14} />
          {tab === "gorseller" ? "Görsel Ekle" : "Workshop Ekle"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sand mb-8">
        {(["workshoplar", "gorseller"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-label text-[0.6rem] px-5 py-3 border-b-2 transition-colors ${
              tab === t ? "border-brown text-brown" : "border-transparent text-[#888480] hover:text-brown/60"
            }`}
          >
            {t === "workshoplar" ? "Workshop Kartları" : "Atölye Görselleri"}
          </button>
        ))}
      </div>

      {/* ── Workshop Kartları Tab ── */}
      {tab === "workshoplar" && (
        <>
          {wsLoading ? (
            <div className="py-20 text-center font-label text-[#888480] text-[0.65rem]">Yükleniyor…</div>
          ) : workshops.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-sand">
              <p className="font-serif text-brown/40 text-xl mb-4" style={{ fontStyle: "italic" }}>
                Henüz workshop eklenmedi.
              </p>
              <button onClick={openAdd} className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
                İlk workshopu ekle →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {workshops.map((ws) => (
                <div key={ws.id} className="border border-sand p-5 flex items-start gap-5 hover:border-brown/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-label text-[0.55rem] border border-sand px-2 py-0.5 text-[#888480]">
                        {ws.level}
                      </span>
                      <span className="font-label text-[0.55rem] text-[#888480]">
                        {ws.duration_hours} saat
                      </span>
                    </div>
                    <p className="font-label text-[#1a1a1a] text-[0.65rem] mb-1">{ws.title}</p>
                    <p className="font-label text-[#888480] text-[0.55rem]">/{ws.slug}</p>
                    {ws.description && (
                      <p className="text-[#888480] text-xs font-light mt-2 line-clamp-2">{ws.description}</p>
                    )}
                    {ws.includes && ws.includes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {ws.includes.map((inc) => (
                          <span key={inc} className="font-label text-[0.5rem] bg-cream px-2 py-0.5 text-[#888480]">
                            {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(ws.id, ws.is_active)}
                      className={`font-label text-[0.55rem] px-2.5 py-1 transition-colors ${
                        ws.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
                      }`}
                    >
                      {ws.is_active ? "Aktif" : "Pasif"}
                    </button>
                    <button onClick={() => openEdit(ws)} className="p-1.5 text-[#888480] hover:text-brown transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteWorkshop(ws.id, ws.title)} className="p-1.5 text-[#888480] hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Görseller Tab ── */}
      {tab === "gorseller" && (
        <>
          <p className="font-label text-[#888480] text-[0.6rem] mb-6">
            Bu görseller workshop sayfasında atölye atmosferini yansıtır.
          </p>
          {imgLoading ? (
            <div className="py-20 text-center font-label text-[#888480] text-[0.65rem]">Yükleniyor…</div>
          ) : images.length === 0 ? (
            <div className="border border-dashed border-sand py-20 flex flex-col items-center gap-4">
              <ImageIcon size={32} className="text-sand-dark" />
              <p className="font-label text-[#888480] text-[0.65rem]">Henüz görsel eklenmedi.</p>
              <button onClick={() => setImgModal(true)} className="font-label text-gold text-[0.6rem] hover:text-brown transition-colors">
                İlk görseli ekle →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="group relative">
                  <div className="aspect-square bg-sand overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                  </div>
                  {img.caption && (
                    <p className="font-label text-[#888480] text-[0.55rem] mt-1.5 truncate">{img.caption}</p>
                  )}
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setImgModal(true)}
                className="aspect-square border border-dashed border-sand flex flex-col items-center justify-center gap-2 hover:border-brown/40 transition-colors"
              >
                <Plus size={20} className="text-[#888480]" />
                <span className="font-label text-[#888480] text-[0.55rem]">Ekle</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Görsel Modal ── */}
      {imgModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-label text-[#1a1a1a] text-[0.7rem]">Görsel Ekle</h2>
              <button onClick={() => setImgModal(false)} className="text-[#888480] hover:text-brown transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Görsel URL <span className="text-gold">*</span></label>
                <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" placeholder="https://..." autoFocus />
              </div>
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Açıklama (opsiyonel)</label>
                <input type="text" value={newCaption} onChange={(e) => setNewCaption(e.target.value)} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" placeholder="Atölye ortamı..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setImgModal(false)} className="flex-1 border border-sand font-label text-[#888480] text-[0.6rem] py-3 hover:border-brown/40 transition-colors">İptal</button>
                <button onClick={addImage} disabled={!newUrl.trim() || imgSaving} className="flex-1 bg-brown text-cream font-label text-[0.6rem] py-3 hover:bg-brown-light transition-colors disabled:opacity-50">
                  {imgSaving ? "Ekleniyor…" : "Ekle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Workshop Modal ── */}
      {wsModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-sand">
              <h2 className="font-label text-[#1a1a1a] text-[0.7rem]">{editTarget ? "Workshop Düzenle" : "Workshop Ekle"}</h2>
              <button onClick={() => setWsModal(false)} className="text-[#888480] hover:text-brown transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Başlık <span className="text-gold">*</span></label>
                <input
                  type="text"
                  value={wsForm.title}
                  onChange={(e) => setWsForm((f) => ({ ...f, title: e.target.value, slug: editTarget ? f.slug : toSlug(e.target.value) }))}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                  placeholder="Başlangıç Çiçek Sanatı"
                  autoFocus
                />
              </div>
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Slug <span className="text-gold">*</span></label>
                <input
                  type="text"
                  value={wsForm.slug}
                  onChange={(e) => setWsForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
                  placeholder="baslangic-cicek-sanati"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Seviye <span className="text-gold">*</span></label>
                  <select value={wsForm.level} onChange={(e) => setWsForm((f) => ({ ...f, level: e.target.value }))} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm bg-transparent">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Süre (saat)</label>
                  <input type="number" value={wsForm.duration_hours} onChange={(e) => setWsForm((f) => ({ ...f, duration_hours: e.target.value }))} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm" min="1" max="12" />
                </div>
              </div>
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">Açıklama</label>
                <textarea value={wsForm.description} onChange={(e) => setWsForm((f) => ({ ...f, description: e.target.value }))} className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm resize-none" rows={3} placeholder="Workshop hakkında kısa bilgi…" />
              </div>
              <div>
                <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
                  Dahil olanlar <span className="text-[#888480]">(her satıra bir madde)</span>
                </label>
                <textarea
                  value={wsForm.includes}
                  onChange={(e) => setWsForm((f) => ({ ...f, includes: e.target.value }))}
                  className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm resize-none"
                  rows={4}
                  placeholder={"Tüm malzemeler dahil\nÇay & ikram\nDijital fotoğraflar"}
                />
              </div>
              <div className="flex gap-3 pt-2 border-t border-sand">
                <button onClick={() => setWsModal(false)} className="flex-1 border border-sand font-label text-[#888480] text-[0.6rem] py-3 hover:border-brown/40 transition-colors">İptal</button>
                <button onClick={saveWorkshop} disabled={wsSaving || !wsForm.title || !wsForm.slug} className="flex-1 bg-brown text-cream font-label text-[0.6rem] py-3 hover:bg-brown-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {wsSaving ? "Kaydediliyor…" : <><Check size={12} /> {editTarget ? "Güncelle" : "Ekle"}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
