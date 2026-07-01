import type { Database } from "@/types/database";

export type ProductCategory = "ev" | "magaza" | "ofis" | "ozel";

export type ProductVariant = {
  id: string;
  name: string;
  hex: string;
  price: number | null;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  price: number;
  description: string;
  details: string[];
  bg: string;
  available: boolean;
  featured: boolean;
  images?: string[];
  variants?: ProductVariant[];
};

export type DBProduct = Database["public"]["Tables"]["products"]["Row"];

const categoryGradients: Record<string, string> = {
  ev:     "linear-gradient(135deg, #fdf8f3 0%, #f0dde4 100%)",
  magaza: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 100%)",
  ofis:   "linear-gradient(135deg, #fdf8f3 0%, #d4b0be 100%)",
  ozel:   "linear-gradient(135deg, #f5eef0 0%, #5c1a2e 100%)",
};

export function mapDBProduct(row: DBProduct): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: (row.category as ProductCategory) || "ev",
    price: row.price ?? 0,
    description: row.description ?? "",
    details: [
      row.dimensions ? `Boyut: ${row.dimensions}` : null,
      row.materials  ? `Malzeme: ${row.materials}` : null,
      "Teslimat: 2–3 hafta",
    ].filter(Boolean) as string[],
    bg: categoryGradients[row.category] ?? categoryGradients.ev,
    available: row.is_available,
    featured: row.is_featured,
    images: row.images ?? [],
    variants: Array.isArray(row.variants) ? (row.variants as ProductVariant[]) : [],
  };
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const categoryLabels: Record<ProductCategory, string> = {
  ev: "Ev & Yaşam",
  magaza: "Mağaza",
  ofis: "Ofis",
  ozel: "Özel Sipariş",
};

export const products: Product[] = [
  {
    id: "1",
    slug: "sonbahar-koleksiyonu",
    title: "Sonbahar Koleksiyonu",
    category: "ozel",
    price: 4800,
    description:
      "Sonbaharın zengin renk paleti ilhamıyla tasarlanan bu eser; akçaağaç yapraklarının kızıl-altın tonları, kuru lavanta dalları ve büyük solmuş pembe peonies'lerden oluşuyor. Salon veya giriş holü için ideal büyük format.",
    details: ["Boyut: 80×120 cm", "Malzeme: Kurutulmuş çiçekler, doğal lifler", "Çerçeve: Ahşap (meşe)", "Teslimat: 2–3 hafta"],
    bg: "linear-gradient(135deg, #f5eef0 0%, #d4b0be 50%, #5c1a2e 100%)",
    available: true,
    featured: true,
    variants: [],
  },
  {
    id: "2",
    slug: "beyaz-peonies",
    title: "Beyaz Peonies",
    category: "ev",
    price: 2400,
    description:
      "Saf beyaz peonies'lerin zarifliğini yaşayan mekânınıza taşıyın. Minimal ve modern iç mekânlar için tasarlanan bu eser, kalıcı bir doğallık hissi yaratır.",
    details: ["Boyut: 50×70 cm", "Malzeme: Kurutulmuş beyaz peonies", "Çerçeve: Beyaz ahşap", "Teslimat: 2–3 hafta"],
    bg: "linear-gradient(160deg, #fdf8f3 0%, #f5eef0 40%, #f0dde4 100%)",
    available: true,
    featured: true,
  },
  {
    id: "3",
    slug: "altin-nisan",
    title: "Altın Nisan",
    category: "magaza",
    price: 3600,
    description:
      "İlkbaharın ilk altın ışıklarından ilham alan bu düzenleme, butik mağaza veya showroom girişleri için tasarlanmıştır. Canlı altın tonları mekâna davet edici bir atmosfer katar.",
    details: ["Boyut: 60×90 cm", "Malzeme: Kurutulmuş çiçekler, altın sprey", "Çerçeve: Altın metal", "Teslimat: 3–4 hafta"],
    bg: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 60%, #7a2440 100%)",
    available: true,
    featured: false,
  },
  {
    id: "4",
    slug: "ofis-serisi",
    title: "Ofis Serisi",
    category: "ofis",
    price: 1800,
    description:
      "Çalışma ortamınıza doğallık ve huzur katan sade düzenleme. Resepsiyon veya toplantı odaları için idealdir.",
    details: ["Boyut: 40×60 cm", "Malzeme: Kurutulmuş çiçekler, okaliptüs", "Çerçeve: Ahşap (kayın)", "Teslimat: 1–2 hafta"],
    bg: "linear-gradient(180deg, #f5eef0 0%, #d4b0be 100%)",
    available: false,
    featured: false,
  },
  {
    id: "5",
    slug: "bahar-esintisi",
    title: "Bahar Esintisi",
    category: "ev",
    price: 2100,
    description:
      "Pastel tonlarıyla yatak odası veya oturma odanıza romantik bir hava katan hafif düzenleme. Taze bahar enerjisini mekânınıza taşır.",
    details: ["Boyut: 45×65 cm", "Malzeme: Kurutulmuş çiçekler, örgü tel", "Çerçeve: Beyaz ahşap", "Teslimat: 2–3 hafta"],
    bg: "linear-gradient(135deg, #faf0f3 0%, #f0dde4 100%)",
    available: true,
    featured: true,
  },
  {
    id: "6",
    slug: "lila-romansi",
    title: "Lila Romansi",
    category: "ozel",
    price: 5200,
    description:
      "Özel bir mekân için tasarlanan bu büyük format eser, yoğun lila ve bordo tonlarıyla güçlü bir ifadeye sahip. Nişan, düğün veya kurumsal mekânlar için de sipariş edilebilir.",
    details: ["Boyut: 90×130 cm", "Malzeme: Kurutulmuş çiçekler, lif, tel", "Çerçeve: Koyu ahşap", "Teslimat: 3–4 hafta"],
    bg: "linear-gradient(160deg, #f0dde4 0%, #7a2440 100%)",
    available: true,
    featured: false,
  },
  {
    id: "7",
    slug: "modern-ofis",
    title: "Modern Ofis",
    category: "ofis",
    price: 2800,
    description:
      "Minimalist çizgilerle tasarlanan bu düzenleme, modern ofis ortamlarının estetiğini tamamlar. Beyaz ve krem tonları her dekorla uyum sağlar.",
    details: ["Boyut: 50×70 cm", "Malzeme: Kurutulmuş çiçekler, pamuk dalları", "Çerçeve: Siyah metal", "Teslimat: 2–3 hafta"],
    bg: "linear-gradient(135deg, #fdf8f3 0%, #d4b0be 100%)",
    available: true,
    featured: false,
  },
  {
    id: "8",
    slug: "magaza-cephesi",
    title: "Mağaza Cephesi",
    category: "magaza",
    price: 6500,
    description:
      "Butik mağaza girişleri için özel tasarlanan bu monumental eser, müşterilerinize unutulmaz bir ilk izlenim yaşatır. Fiyat büyüklük ve karmaşıklığa göre değişir.",
    details: ["Boyut: 100×150 cm", "Malzeme: Kuru & taze çiçek karışımı", "Montaj: Dahil", "Teslimat: 4–6 hafta"],
    bg: "linear-gradient(160deg, #e8c99a 0%, #5c1a2e 100%)",
    available: true,
    featured: false,
  },
  {
    id: "9",
    slug: "gunes-cicekleri",
    title: "Güneş Çiçekleri",
    category: "ev",
    price: 1950,
    description:
      "Sıcak sarı ve turuncu tonlarıyla mutfak veya yemek odanıza neşe katan düzenleme. Küçük ama etkileyici bir detay.",
    details: ["Boyut: 35×50 cm", "Malzeme: Kurutulmuş papatya, kuru çiçekler", "Çerçeve: Doğal ahşap", "Teslimat: 1–2 hafta"],
    bg: "linear-gradient(135deg, #f5eef0 0%, #e8c99a 100%)",
    available: true,
    featured: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
