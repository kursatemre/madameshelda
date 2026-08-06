/**
 * "Tema" içeriğinin tipleri + varsayılan (bugünkü, kod içine sabit yazılmış)
 * metinleri. Bu dosya SUNUCU-BAĞIMSIZ tutulur (Supabase/next-headers importu
 * yok) — hem server hem client component'lerden güvenle import edilebilir.
 * Gerçek Supabase okuma mantığı `@/lib/site-content` içindedir.
 */

export type GeneralContent = {
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_handle: string;
  instagram_url: string;
  footer_tagline: string;
  footer_copyright: string;
  footer_credit: string;
  logo_url: string;
  logo_dark_url: string;
  bank_name: string;
  bank_iban: string;
  bank_account_holder: string;
};

export type HomeHeroContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  title_line3: string;
  description: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  stat_eyebrow: string;
  stat_value: string;
  stat_label: string;
  image_url: string;
};

export type HomeFeaturedContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
};

export type HomeWorkshopTeaserContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
};

export type HomeCtaContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  title_line3: string;
  description: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  stats: { value: string; label: string }[];
};

export type AboutHeroContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
};

export type AboutIntroContent = {
  paragraph1: string;
  paragraph2: string;
};

export type AboutValuesContent = {
  eyebrow: string;
  items: { title: string; desc: string }[];
};

export type AboutStoryContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  paragraph1: string;
  paragraph2: string;
  quote: string;
  quote_attribution: string;
  cta_label: string;
  image_url: string;
};

export type ContactPageContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  intro: string;
};

export type SiteContent = {
  general: GeneralContent;
  home_hero: HomeHeroContent;
  home_featured: HomeFeaturedContent;
  home_workshop_teaser: HomeWorkshopTeaserContent;
  home_cta: HomeCtaContent;
  about_hero: AboutHeroContent;
  about_intro: AboutIntroContent;
  about_values: AboutValuesContent;
  about_story: AboutStoryContent;
  contact_page: ContactPageContent;
};

export const SITE_CONTENT_DEFAULTS: SiteContent = {
  general: {
    phone: "+90 500 123 45 67",
    whatsapp_number: "905309713538",
    email: "info@madameshelda.com",
    address: "Soma, Manisa, Türkiye",
    instagram_handle: "@madameshelda",
    instagram_url: "https://www.instagram.com",
    footer_tagline: "Soma, Manisa'da el yapımı dev çiçek tasarımları. Her eser, bir hikaye.",
    footer_copyright: "Madame Shelda Design Art. Tüm hakları saklıdır.",
    footer_credit: "OrionSoft.dev tarafından geliştirilmiştir",
    logo_url: "/logo.png",
    logo_dark_url: "/logo-dark.png",
    bank_name: "Ziraat Bankası",
    bank_iban: "TR00 0000 0000 0000 0000 0000 00",
    bank_account_holder: "Madame Shelda",
  },
  home_hero: {
    eyebrow: "— El Yapımı Çiçek Tasarımları",
    title_line1: "Madame",
    title_line2: "Shelda",
    title_line3: "Design Art",
    description: "Her mekan için özenle tasarlanmış, doğanın güzelliğini kalıcı kılan el yapımı çiçek sanatı.",
    cta_primary_label: "Eserleri Keşfet",
    cta_secondary_label: "Workshoplar",
    stat_eyebrow: "Bu yıl",
    stat_value: "120+",
    stat_label: "Tamamlanan Eser",
    image_url: "",
  },
  home_featured: {
    eyebrow: "— Seçkin Eserler",
    title_line1: "Her mekan için",
    title_line2: "özgün bir eser",
  },
  home_workshop_teaser: {
    eyebrow: "— Workshoplar",
    title_line1: "Atölyede bir gün",
    title_line2: "birlikte geçirelim",
  },
  home_cta: {
    eyebrow: "— Özel Sipariş",
    title_line1: "Hayalinizdeki",
    title_line2: "çiçeği birlikte",
    title_line3: "tasarlayalım.",
    description:
      "Eviniz, ofisiniz veya özel gününüz için tamamen size özel, benzersiz bir çiçek tasarımı. Boyut, renk ve stil tercihlerinizi dinliyoruz.",
    cta_primary_label: "Hemen İletişime Geç",
    cta_secondary_label: "İlham Al",
    stats: [
      { value: "8+", label: "Yıl Deneyim" },
      { value: "500+", label: "Mutlu Müşteri" },
      { value: "120+", label: "Tamamlanan Eser" },
      { value: "40+", label: "Workshop" },
    ],
  },
  about_hero: {
    eyebrow: "— Hakkımızda",
    title_line1: "Bir atölye,",
    title_line2: "bin hikaye.",
  },
  about_intro: {
    paragraph1:
      "Madame Shelda Design Art, 2017 yılında Soma, Manisa'da el yapımı büyük ölçekli çiçek tasarımları üzerine kuruldu. Her eser; rengin, dokunun ve formun özgün bir dansı.",
    paragraph2:
      "Standart çiçek düzenlemelerinin ötesine geçerek, her mekanın ruhuna ve sahibinin kişiliğine uygun, tamamen el yapımı tasarımlar yaratıyoruz. Doğadan ilham alarak, sanatın kalıcı güzelliğini hayatınıza taşıyoruz.",
  },
  about_values: {
    eyebrow: "— Değerlerimiz",
    items: [
      { title: "El Emeği", desc: "Her eserde makinenin değil, insan elinin dokunuşu hissedilir. Hiçbir iki eser birbirinin aynısı değildir." },
      { title: "Özgünlük", desc: "Standart kalıpların dışında, her müşteri için yeni bir tasarım dili geliştiririz." },
      { title: "Kalıcılık", desc: "Geçici değil, yıllarca sizinle kalacak eserler yaratıyoruz. Kalite her zaman önce gelir." },
    ],
  },
  about_story: {
    eyebrow: "— Hikayemiz",
    title_line1: "Çiçeğe aşk,",
    title_line2: "tasarıma tutku",
    paragraph1:
      "Küçük bir atölyede başlayan serüven, bugün yüzlerce mutlu müşteriye ve onlarca başarılı workshop'a dönüştü. Çiçeği sadece bir nesne olarak değil, duygusal bir iletişim aracı olarak görüyoruz.",
    paragraph2:
      "Eğitimlerimizde teknik bilginin ötesinde, katılımcılara kendi tasarım seslerini bulmalarına yardımcı oluyoruz. Çünkü en güzel eser, içinizden gelenidir.",
    quote: "Her çiçek, bir his; her düzenleme, bir hikaye anlatır.",
    quote_attribution: "— Madame Shelda",
    cta_label: "Bize Ulaşın",
    image_url: "",
  },
  contact_page: {
    eyebrow: "— İletişim",
    title_line1: "Birlikte",
    title_line2: "konuşalım",
    intro: "Özel sipariş, workshop soruları veya genel bilgi için bize ulaşabilirsiniz. En kısa sürede yanıt vermeye çalışıyoruz.",
  },
};
