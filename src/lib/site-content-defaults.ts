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

export type LegalDocContent = {
  title: string;
  /** Paragraflar boş satırla ayrılır, sayfada olduğu gibi (pre-line) gösterilir. */
  content: string;
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
  legal_kvkk: LegalDocContent;
  legal_privacy: LegalDocContent;
  legal_distance_sales: LegalDocContent;
  legal_return_policy: LegalDocContent;
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

  /**
   * Aşağıdaki 4 sözleşme/metin, yaygın kullanılan Türkçe e-ticaret şablonlarının
   * İSKELETİDİR — hukuki tavsiye değildir. [Doldurulacak] ile işaretli alanlar
   * (unvan, vergi/MERSİS no, adres vb.) admin panelinden doldurulmalı; yayına
   * almadan önce bir hukuk danışmanına kontrol ettirilmesi önerilir.
   */
  legal_kvkk: {
    title: "KVKK Aydınlatma Metni",
    content: `Veri Sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, [Doldurulacak: İşletme Unvanı] ("Veri Sorumlusu") olarak, [Doldurulacak: Adres] adresinde faaliyet göstermekteyiz.

İşlenen Kişisel Veriler

Sitemiz ve mağazamız üzerinden sipariş, workshop kaydı veya iletişim formu yoluyla; ad-soyad, e-posta, telefon, teslimat adresi ve sipariş/ödeme bilgileriniz işlenmektedir.

İşleme Amaçları

Kişisel verileriniz; siparişlerinizin oluşturulması ve teslimatı, workshop kayıtlarınızın yönetimi, müşteri talep ve şikayetlerinizin karşılanması, yasal yükümlülüklerimizin yerine getirilmesi amaçlarıyla işlenmektedir.

Hukuki Sebep

Kişisel verileriniz, bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması ve hukuki yükümlülüğün yerine getirilmesi hukuki sebeplerine dayanılarak işlenmektedir (KVKK m.5/2).

Aktarım

Kişisel verileriniz; kargo/lojistik firmaları, ödeme altyapısı sağlayıcıları ve yasal olarak yetkili kamu kurum/kuruluşları ile, yalnızca hizmetin ifası için gerekli ölçüde paylaşılabilir.

Haklarınız (KVKK m.11)

Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde/yurt dışında aktarıldığı üçüncü kişileri bilme, eksik/yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme, kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.

Taleplerinizi [Doldurulacak: e-posta adresi] adresine iletebilirsiniz.`,
  },
  legal_privacy: {
    title: "Gizlilik Politikası",
    content: `Bu Gizlilik Politikası, [Doldurulacak: İşletme Unvanı] ("Madame Shelda Design Art") olarak topladığımız kişisel verilerin nasıl kullanıldığını açıklar.

Topladığımız Bilgiler

Sipariş verirken veya iletişime geçtiğinizde ad-soyad, e-posta, telefon, adres ve sipariş içeriği gibi bilgileri topluyoruz. Siteyi ziyaret ettiğinizde, kullanılan analitik araçlar (varsa) standart kullanım verilerini (sayfa görüntüleme, cihaz türü vb.) toplayabilir.

Bilgilerin Kullanımı

Topladığımız bilgiler yalnızca siparişlerinizin işlenmesi, teslimatı, müşteri desteği sağlanması ve yasal yükümlülüklerin yerine getirilmesi amacıyla kullanılır. Bilgileriniz pazarlama amacıyla üçüncü taraflarla satılmaz veya kiralanmaz.

Çerezler

Sitemiz, temel işlevsellik (ör. sepet, oturum) için çerezler kullanabilir. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.

Veri Güvenliği

Kişisel verilerinizin güvenliğini sağlamak için makul teknik ve idari önlemler alıyoruz. Ancak internet üzerinden hiçbir iletimin %100 güvenli olmadığını belirtmek isteriz.

İletişim

Bu politikayla ilgili sorularınız için [Doldurulacak: e-posta adresi] adresinden bize ulaşabilirsiniz.`,
  },
  legal_distance_sales: {
    title: "Mesafeli Satış Sözleşmesi",
    content: `Madde 1 — Taraflar

Satıcı: [Doldurulacak: İşletme Unvanı], [Doldurulacak: Adres], [Doldurulacak: Vergi Dairesi/No].
Alıcı: Sitemiz üzerinden sipariş veren müşteri.

Madde 2 — Sözleşmenin Konusu

İşbu sözleşme, Alıcı'nın Satıcı'ya ait internet sitesinden elektronik ortamda sipariş verdiği ürün/hizmetin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.

Madde 3 — Ürün/Hizmet Bilgileri

Ürünün türü, adedi, satış bedeli ve ödeme şekli, sipariş onayı sırasında Alıcı'ya sunulan bilgilerde belirtildiği gibidir. El yapımı ürünler doğası gereği görselden hafif farklılık gösterebilir.

Madde 4 — Teslimat

Ürünler, sipariş onayından itibaren belirtilen süre içinde, Alıcı'nın bildirdiği adrese kargo ile teslim edilir. Teslimat süresi ürün sayfasında/sipariş onayında ayrıca belirtilir.

Madde 5 — Cayma Hakkı

Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Ancak Alıcı'nın istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan (kişiye özel üretilen) ürünlerde, Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca cayma hakkı kullanılamayabilir — özel sipariş ürünler için bu istisna geçerlidir.

Madde 6 — Ödeme

Ödeme, sitede belirtilen yöntemlerle (banka havalesi/EFT veya WhatsApp üzerinden onay) gerçekleştirilir.

Madde 7 — Uyuşmazlıkların Çözümü

İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen değere kadar Alıcı'nın veya Satıcı'nın yerleşim yerindeki Tüketici Hakem Heyetleri, bu değerin üzerindeki uyuşmazlıklarda ise Tüketici Mahkemeleri yetkilidir.`,
  },
  legal_return_policy: {
    title: "İptal ve İade Koşulları",
    content: `Cayma Hakkı Süresi

Sipariş ettiğiniz ürünü teslim aldığınız tarihten itibaren 14 gün içinde, herhangi bir gerekçe göstermeksizin iade edebilirsiniz.

İstisna — Özel Sipariş Ürünler

El yapımı, sizin talebiniz doğrultusunda kişiye özel hazırlanan (Özel Sipariş kategorisindeki) ürünlerde, ilgili mevzuat gereği cayma hakkı bulunmamaktadır. Bu ürünler yalnızca ayıplı/hasarlı teslim edilmesi durumunda iade/değişime konu olabilir.

İade Süreci

İade talebiniz için [Doldurulacak: e-posta adresi] veya WhatsApp üzerinden bizimle iletişime geçin. Ürünün kullanılmamış, orijinal ambalajında ve tekrar satılabilir durumda olması gerekir.

İade Kargo Ücreti

Ürünün ayıplı/hatalı teslim edilmesi durumunda kargo ücreti tarafımızca karşılanır. Cayma hakkı kapsamındaki iadelerde kargo ücreti, aksi belirtilmedikçe Alıcı'ya aittir.

Geri Ödeme

İade edilen ürün elimize ulaştıktan ve kontrol edildikten sonra, ödemeniz kullandığınız ödeme yöntemine uygun şekilde en geç 14 gün içinde iade edilir.`,
  },
};
