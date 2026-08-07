"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Upload, Check } from "lucide-react";
import { SITE_CONTENT_DEFAULTS, type SiteContent } from "@/lib/site-content-defaults";

const TABS = ["genel", "anasayfa", "hakkimizda", "iletisim"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = {
  genel: "Genel",
  anasayfa: "Ana Sayfa",
  hakkimizda: "Hakkımızda",
  iletisim: "İletişim",
};

export default function SiteIcerigiPage() {
  const [tab, setTab] = useState<Tab>("genel");
  const [content, setContent] = useState<SiteContent>(SITE_CONTENT_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setContent(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof SiteContent>(key: K, patch: Partial<SiteContent[K]>) =>
    setContent((c) => ({ ...c, [key]: { ...c[key], ...patch } }));

  const save = async (key: keyof SiteContent) => {
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: content[key] }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Hata");
      toast.success("Kaydedildi.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Kaydetme başarısız.");
    } finally {
      setSavingKey(null);
    }
  };

  const uploadImage = async (field: string, file: File, onDone: (url: string) => void) => {
    setUploadingField(field);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "site");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Yükleme hatası");
      onDone(json.url);
      toast.success("Görsel yüklendi.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yükleme hatası");
    } finally {
      setUploadingField(null);
    }
  };

  const updateStat = (idx: number, patch: Partial<{ value: string; label: string }>) =>
    setContent((c) => {
      const stats = [...c.home_cta.stats];
      stats[idx] = { ...stats[idx], ...patch };
      return { ...c, home_cta: { ...c.home_cta, stats } };
    });

  const updateValueItem = (idx: number, patch: Partial<{ title: string; desc: string }>) =>
    setContent((c) => {
      const items = [...c.about_values.items];
      items[idx] = { ...items[idx], ...patch };
      return { ...c, about_values: { ...c.about_values, items } };
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <p className="font-label text-[#888480] text-[0.6rem] mb-1">Yönetim</p>
        <h1 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl" style={{ fontStyle: "italic" }}>
          Site İçeriği
        </h1>
        <p className="font-label text-[#888480] text-[0.6rem] mt-2 normal-case leading-relaxed">
          Anasayfa, Hakkımızda, İletişim ve genel iletişim bilgilerini buradan düzenleyebilirsiniz.
          Her kart kendi başına kaydedilir.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-sand mb-8 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-label text-[0.6rem] px-3 sm:px-5 py-3 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              tab === t ? "border-brown text-brown" : "border-transparent text-[#888480] hover:text-brown/60"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center font-label text-[#888480] text-[0.65rem]">Yükleniyor…</div>
      ) : (
        <>
          {/* ── GENEL ── */}
          {tab === "genel" && (
            <SectionCard title="Genel Ayarlar" onSave={() => save("general")} saving={savingKey === "general"}>
              <FieldGroup label="İletişim Bilgileri">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Telefon" value={content.general.phone} onChange={(v) => update("general", { phone: v })} placeholder="+90 500 123 45 67" />
                  <TextField label="WhatsApp Numarası" value={content.general.whatsapp_number} onChange={(v) => update("general", { whatsapp_number: v })} placeholder="905001234567" hint="Ülke koduyla, boşluksuz" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="E-posta" value={content.general.email} onChange={(v) => update("general", { email: v })} placeholder="info@madameshelda.com" />
                  <TextField label="Adres" value={content.general.address} onChange={(v) => update("general", { address: v })} placeholder="Soma, Manisa, Türkiye" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Instagram Kullanıcı Adı" value={content.general.instagram_handle} onChange={(v) => update("general", { instagram_handle: v })} placeholder="@madameshelda" />
                  <TextField label="Instagram URL" value={content.general.instagram_url} onChange={(v) => update("general", { instagram_url: v })} placeholder="https://instagram.com/madameshelda" />
                </div>
              </FieldGroup>

              <FieldGroup label="Banka Bilgileri (Havale ile Ödeme)">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Banka Adı" value={content.general.bank_name} onChange={(v) => update("general", { bank_name: v })} placeholder="Ziraat Bankası" />
                  <TextField label="Hesap Sahibi" value={content.general.bank_account_holder} onChange={(v) => update("general", { bank_account_holder: v })} placeholder="Madame Shelda" />
                </div>
                <TextField label="IBAN" value={content.general.bank_iban} onChange={(v) => update("general", { bank_iban: v })} placeholder="TR00 0000 0000 0000 0000 0000 00" />
              </FieldGroup>

              <FieldGroup label="Footer & Logo">
                <TextAreaField label="Footer Tanıtım Metni" value={content.general.footer_tagline} onChange={(v) => update("general", { footer_tagline: v })} rows={2} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Telif Metni" value={content.general.footer_copyright} onChange={(v) => update("general", { footer_copyright: v })} hint="Yıl otomatik eklenir" />
                  <TextField label="Geliştirici Notu" value={content.general.footer_credit} onChange={(v) => update("general", { footer_credit: v })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ImageUploadRow
                    id="logo-light"
                    label="Logo (Açık zeminde / şeffaf header)"
                    url={content.general.logo_url}
                    uploading={uploadingField === "logo-light"}
                    onUpload={(f) => uploadImage("logo-light", f, (url) => update("general", { logo_url: url }))}
                    onUrlChange={(url) => update("general", { logo_url: url })}
                    onClear={() => update("general", { logo_url: "" })}
                  />
                  <ImageUploadRow
                    id="logo-dark"
                    label="Logo (Koyu / scroll sonrası header)"
                    url={content.general.logo_dark_url}
                    uploading={uploadingField === "logo-dark"}
                    onUpload={(f) => uploadImage("logo-dark", f, (url) => update("general", { logo_dark_url: url }))}
                    onUrlChange={(url) => update("general", { logo_dark_url: url })}
                    onClear={() => update("general", { logo_dark_url: "" })}
                  />
                </div>
              </FieldGroup>
            </SectionCard>
          )}

          {/* ── ANA SAYFA ── */}
          {tab === "anasayfa" && (
            <div className="space-y-5">
              <SectionCard title="Hero (Üst Bölüm)" onSave={() => save("home_hero")} saving={savingKey === "home_hero"}>
                <TextField label="Üst Etiket" value={content.home_hero.eyebrow} onChange={(v) => update("home_hero", { eyebrow: v })} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <TextField label="Başlık 1. Satır" value={content.home_hero.title_line1} onChange={(v) => update("home_hero", { title_line1: v })} />
                  <TextField label="Başlık 2. Satır" value={content.home_hero.title_line2} onChange={(v) => update("home_hero", { title_line2: v })} />
                  <TextField label="Başlık 3. Satır" value={content.home_hero.title_line3} onChange={(v) => update("home_hero", { title_line3: v })} />
                </div>
                <TextAreaField label="Açıklama" value={content.home_hero.description} onChange={(v) => update("home_hero", { description: v })} rows={2} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Birincil Buton" value={content.home_hero.cta_primary_label} onChange={(v) => update("home_hero", { cta_primary_label: v })} />
                  <TextField label="İkincil Buton" value={content.home_hero.cta_secondary_label} onChange={(v) => update("home_hero", { cta_secondary_label: v })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <TextField label="İstatistik Etiketi" value={content.home_hero.stat_eyebrow} onChange={(v) => update("home_hero", { stat_eyebrow: v })} placeholder="Bu yıl" />
                  <TextField label="İstatistik Değeri" value={content.home_hero.stat_value} onChange={(v) => update("home_hero", { stat_value: v })} placeholder="120+" />
                  <TextField label="İstatistik Açıklaması" value={content.home_hero.stat_label} onChange={(v) => update("home_hero", { stat_label: v })} placeholder="Tamamlanan Eser" />
                </div>
                <ImageUploadRow
                  id="hero-image"
                  label="Hero Görseli"
                  hint="boşsa mevcut gradient/desen görünümü kullanılır"
                  url={content.home_hero.image_url}
                  uploading={uploadingField === "hero-image"}
                  onUpload={(f) => uploadImage("hero-image", f, (url) => update("home_hero", { image_url: url }))}
                  onUrlChange={(url) => update("home_hero", { image_url: url })}
                  onClear={() => update("home_hero", { image_url: "" })}
                />
              </SectionCard>

              <SectionCard title="Öne Çıkan Eserler — Başlık" onSave={() => save("home_featured")} saving={savingKey === "home_featured"}>
                <p className="font-label text-[0.5rem] text-[#888480] normal-case -mt-2">
                  Kartların kendisi Eserler&apos;de &quot;Öne Çıkan&quot; işaretlenen ürünlerden otomatik gelir.
                </p>
                <TextField label="Üst Etiket" value={content.home_featured.eyebrow} onChange={(v) => update("home_featured", { eyebrow: v })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Başlık 1. Satır" value={content.home_featured.title_line1} onChange={(v) => update("home_featured", { title_line1: v })} />
                  <TextField label="Başlık 2. Satır" value={content.home_featured.title_line2} onChange={(v) => update("home_featured", { title_line2: v })} />
                </div>
              </SectionCard>

              <SectionCard title="Workshop Bölümü — Başlık" onSave={() => save("home_workshop_teaser")} saving={savingKey === "home_workshop_teaser"}>
                <p className="font-label text-[0.5rem] text-[#888480] normal-case -mt-2">
                  Kartlar Workshoplar&apos;daki aktif workshoplardan otomatik gelir.
                </p>
                <TextField label="Üst Etiket" value={content.home_workshop_teaser.eyebrow} onChange={(v) => update("home_workshop_teaser", { eyebrow: v })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Başlık 1. Satır" value={content.home_workshop_teaser.title_line1} onChange={(v) => update("home_workshop_teaser", { title_line1: v })} />
                  <TextField label="Başlık 2. Satır" value={content.home_workshop_teaser.title_line2} onChange={(v) => update("home_workshop_teaser", { title_line2: v })} />
                </div>
              </SectionCard>

              <SectionCard title="CTA Banner (Özel Sipariş)" onSave={() => save("home_cta")} saving={savingKey === "home_cta"}>
                <TextField label="Üst Etiket" value={content.home_cta.eyebrow} onChange={(v) => update("home_cta", { eyebrow: v })} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <TextField label="Başlık 1. Satır" value={content.home_cta.title_line1} onChange={(v) => update("home_cta", { title_line1: v })} />
                  <TextField label="Başlık 2. Satır" value={content.home_cta.title_line2} onChange={(v) => update("home_cta", { title_line2: v })} />
                  <TextField label="Başlık 3. Satır" value={content.home_cta.title_line3} onChange={(v) => update("home_cta", { title_line3: v })} />
                </div>
                <TextAreaField label="Açıklama" value={content.home_cta.description} onChange={(v) => update("home_cta", { description: v })} rows={2} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Birincil Buton" value={content.home_cta.cta_primary_label} onChange={(v) => update("home_cta", { cta_primary_label: v })} />
                  <TextField label="İkincil Buton" value={content.home_cta.cta_secondary_label} onChange={(v) => update("home_cta", { cta_secondary_label: v })} />
                </div>
                <FieldGroup label="İstatistikler">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.home_cta.stats.map((s, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-sand p-3">
                        <TextField label={`Değer ${i + 1}`} value={s.value} onChange={(v) => updateStat(i, { value: v })} placeholder="120+" />
                        <TextField label={`Etiket ${i + 1}`} value={s.label} onChange={(v) => updateStat(i, { label: v })} placeholder="Tamamlanan Eser" />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              </SectionCard>
            </div>
          )}

          {/* ── HAKKIMIZDA ── */}
          {tab === "hakkimizda" && (
            <div className="space-y-5">
              <SectionCard title="Hero (Üst Bölüm)" onSave={() => save("about_hero")} saving={savingKey === "about_hero"}>
                <TextField label="Üst Etiket" value={content.about_hero.eyebrow} onChange={(v) => update("about_hero", { eyebrow: v })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Başlık 1. Satır" value={content.about_hero.title_line1} onChange={(v) => update("about_hero", { title_line1: v })} />
                  <TextField label="Başlık 2. Satır" value={content.about_hero.title_line2} onChange={(v) => update("about_hero", { title_line2: v })} />
                </div>
              </SectionCard>

              <SectionCard title="Giriş Metni" onSave={() => save("about_intro")} saving={savingKey === "about_intro"}>
                <TextAreaField label="1. Paragraf" value={content.about_intro.paragraph1} onChange={(v) => update("about_intro", { paragraph1: v })} rows={3} />
                <TextAreaField label="2. Paragraf" value={content.about_intro.paragraph2} onChange={(v) => update("about_intro", { paragraph2: v })} rows={3} />
              </SectionCard>

              <SectionCard title="Değerlerimiz" onSave={() => save("about_values")} saving={savingKey === "about_values"}>
                <TextField label="Üst Etiket" value={content.about_values.eyebrow} onChange={(v) => update("about_values", { eyebrow: v })} />
                <div className="space-y-4">
                  {content.about_values.items.map((item, i) => (
                    <div key={i} className="border border-sand p-4">
                      <span className="font-label text-gold/60 text-[0.55rem] block mb-3">0{i + 1}</span>
                      <div className="space-y-4">
                        <TextField label="Başlık" value={item.title} onChange={(v) => updateValueItem(i, { title: v })} />
                        <TextAreaField label="Açıklama" value={item.desc} onChange={(v) => updateValueItem(i, { desc: v })} rows={2} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Hikayemiz" onSave={() => save("about_story")} saving={savingKey === "about_story"}>
                <TextField label="Üst Etiket" value={content.about_story.eyebrow} onChange={(v) => update("about_story", { eyebrow: v })} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Başlık 1. Satır" value={content.about_story.title_line1} onChange={(v) => update("about_story", { title_line1: v })} />
                  <TextField label="Başlık 2. Satır" value={content.about_story.title_line2} onChange={(v) => update("about_story", { title_line2: v })} />
                </div>
                <TextAreaField label="1. Paragraf" value={content.about_story.paragraph1} onChange={(v) => update("about_story", { paragraph1: v })} rows={3} />
                <TextAreaField label="2. Paragraf" value={content.about_story.paragraph2} onChange={(v) => update("about_story", { paragraph2: v })} rows={3} />
                <TextAreaField label="Alıntı" value={content.about_story.quote} onChange={(v) => update("about_story", { quote: v })} rows={2} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <TextField label="Alıntı İmzası" value={content.about_story.quote_attribution} onChange={(v) => update("about_story", { quote_attribution: v })} />
                  <TextField label="Buton Metni" value={content.about_story.cta_label} onChange={(v) => update("about_story", { cta_label: v })} />
                </div>
                <ImageUploadRow
                  id="story-image"
                  label="Hikaye Görseli"
                  hint="boşsa mevcut gradient/desen görünümü kullanılır"
                  url={content.about_story.image_url}
                  uploading={uploadingField === "story-image"}
                  onUpload={(f) => uploadImage("story-image", f, (url) => update("about_story", { image_url: url }))}
                  onUrlChange={(url) => update("about_story", { image_url: url })}
                  onClear={() => update("about_story", { image_url: "" })}
                />
              </SectionCard>
            </div>
          )}

          {/* ── İLETİŞİM ── */}
          {tab === "iletisim" && (
            <SectionCard title="İletişim Sayfası" onSave={() => save("contact_page")} saving={savingKey === "contact_page"}>
              <p className="font-label text-[0.5rem] text-[#888480] normal-case -mt-2">
                Telefon, e-posta, adres ve Instagram bilgileri &quot;Genel&quot; sekmesinden yönetilir.
              </p>
              <TextField label="Üst Etiket" value={content.contact_page.eyebrow} onChange={(v) => update("contact_page", { eyebrow: v })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField label="Başlık 1. Satır" value={content.contact_page.title_line1} onChange={(v) => update("contact_page", { title_line1: v })} />
                <TextField label="Başlık 2. Satır" value={content.contact_page.title_line2} onChange={(v) => update("contact_page", { title_line2: v })} />
              </div>
              <TextAreaField label="Giriş Metni" value={content.contact_page.intro} onChange={(v) => update("contact_page", { intro: v })} rows={2} />
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}

/* ────────────────────────────── Ortak alt bileşenler ────────────────────────────── */

function SectionCard({
  title, onSave, saving, children,
}: {
  title: string;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-sand p-6">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-sand">
        <h2 className="font-label text-[0.6rem] text-[#888480] uppercase tracking-widest">{title}</h2>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-brown text-cream font-label text-[0.55rem] px-4 py-2.5 hover:bg-brown-light transition-colors disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5 pt-5 border-t border-sand first:pt-0 first:border-t-0">
      <p className="font-label text-gold text-[0.55rem]">{label}</p>
      {children}
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
        {label}
        {hint && <span className="ml-2 normal-case text-[#888480]">— {hint}</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm"
        placeholder={placeholder}
      />
    </div>
  );
}

function TextAreaField({
  label, value, onChange, rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="font-label text-[#888480] text-[0.55rem] block mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full input-underline py-2.5 text-[#1a1a1a] text-sm leading-relaxed resize-none"
      />
    </div>
  );
}

function ImageUploadRow({
  id, label, hint, url, uploading, onUpload, onUrlChange, onClear,
}: {
  id: string;
  label: string;
  hint?: string;
  url: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onUrlChange: (url: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <label className="font-label text-[#888480] text-[0.55rem] block mb-2">
        {label}
        {hint && <span className="ml-2 normal-case text-[#888480]">— {hint}</span>}
      </label>
      <input
        type="file"
        id={`file-${id}`}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      <div className="flex items-center gap-3">
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            className="w-16 h-16 object-cover border border-sand shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="flex-1 space-y-2 min-w-0">
          <input
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            className="w-full input-underline py-2 text-[#1a1a1a] text-sm"
            placeholder="https://... veya dosya yükle →"
            disabled={uploading}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => document.getElementById(`file-${id}`)?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 font-label text-[0.55rem] px-3 py-1.5 bg-brown text-cream hover:bg-brown-light transition-colors disabled:opacity-50"
            >
              {uploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
              {uploading ? "Yükleniyor…" : "Dosya Yükle"}
            </button>
            {url && (
              <button
                type="button"
                onClick={onClear}
                className="font-label text-[0.55rem] px-3 py-1.5 border border-sand text-[#888480] hover:border-red-200 hover:text-red-500 transition-colors"
              >
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
