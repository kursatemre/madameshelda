import Link from "next/link";
import { ArrowRight } from "lucide-react";

const featured = [
  {
    id: "1",
    slug: "sonbahar-koleksiyonu",
    title: "Sonbahar Koleksiyonu",
    category: "Özel Sipariş",
    size: "large",
    accent: "#e8c99a",
    bg: "linear-gradient(135deg, #f5eef0 0%, #d4b0be 50%, #5c1a2e 100%)",
  },
  {
    id: "2",
    slug: "beyaz-peonies",
    title: "Beyaz Peonies",
    category: "Ev",
    size: "small",
    accent: "#faf0f3",
    bg: "linear-gradient(160deg, #fdf8f3 0%, #f5eef0 40%, #f0dde4 100%)",
  },
  {
    id: "3",
    slug: "altin-nisan",
    title: "Altın Nisan",
    category: "Mağaza",
    size: "small",
    accent: "#c9a070",
    bg: "linear-gradient(135deg, #faf0f3 0%, #e8c99a 60%, #7a2440 100%)",
  },
  {
    id: "4",
    slug: "ofis-serisi",
    title: "Ofis Serisi",
    category: "Ofis",
    size: "medium",
    accent: "#d4b0be",
    bg: "linear-gradient(180deg, #f5eef0 0%, #d4b0be 100%)",
  },
];

export function FeaturedGallery() {
  return (
    <section className="py-20 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6">
        <div>
          <p className="font-label text-gold text-[0.65rem] mb-4">
            — Seçkin Eserler
          </p>
          <h2
            className="font-serif text-[#1a1a1a] leading-tight"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontStyle: "italic",
            }}
          >
            Her mekan için
            <br />
            <span className="text-brown">özgün bir eser</span>
          </h2>
        </div>
        <Link
          href="/galeri"
          className="inline-flex items-center gap-3 font-label text-brown/70 hover:text-gold transition-colors duration-300 group self-start lg:self-auto"
        >
          Tüm Galeri
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Asymmetric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Large card — spans 2 rows on desktop */}
        <div className="lg:row-span-2 img-zoom group relative cursor-pointer">
          <Link href={`/eser/${featured[0].slug}`}>
            <div
              className="w-full h-72 sm:h-80 lg:h-full min-h-[420px] relative overflow-hidden"
              style={{ background: featured[0].bg }}
            >
              <FlowerDecor color={featured[0].accent} size="large" />
              <CardOverlay title={featured[0].title} category={featured[0].category} />
            </div>
          </Link>
        </div>

        {/* Top right small */}
        <div className="img-zoom group relative cursor-pointer sm:col-span-1">
          <Link href={`/eser/${featured[1].slug}`}>
            <div
              className="w-full h-60 lg:h-64 relative overflow-hidden"
              style={{ background: featured[1].bg }}
            >
              <FlowerDecor color={featured[1].accent} size="small" />
              <CardOverlay title={featured[1].title} category={featured[1].category} />
            </div>
          </Link>
        </div>

        {/* Top right medium */}
        <div className="img-zoom group relative cursor-pointer">
          <Link href={`/eser/${featured[2].slug}`}>
            <div
              className="w-full h-60 lg:h-64 relative overflow-hidden"
              style={{ background: featured[2].bg }}
            >
              <FlowerDecor color={featured[2].accent} size="small" />
              <CardOverlay title={featured[2].title} category={featured[2].category} />
            </div>
          </Link>
        </div>

        {/* Bottom spanning */}
        <div className="img-zoom group relative cursor-pointer sm:col-span-2 lg:col-span-2">
          <Link href={`/eser/${featured[3].slug}`}>
            <div
              className="w-full h-60 lg:h-64 relative overflow-hidden"
              style={{ background: featured[3].bg }}
            >
              <FlowerDecor color={featured[3].accent} size="medium" />
              <CardOverlay title={featured[3].title} category={featured[3].category} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlowerDecor({ color, size }: { color: string; size: "small" | "medium" | "large" }) {
  const r = size === "large" ? 130 : size === "medium" ? 90 : 70;
  const cx = 300;
  const cy = 200;

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30 transition-opacity duration-500 group-hover:opacity-40"
      viewBox="0 0 600 400"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse
          key={angle}
          cx={cx}
          cy={cy - r}
          rx={r * 0.35}
          ry={r}
          fill={color}
          opacity="0.6"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.22} fill={color} opacity="0.8" />
    </svg>
  );
}

function CardOverlay({ title, category }: { title: string; category: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
      <span className="font-label text-gold text-[0.55rem] mb-2">{category}</span>
      <h3
        className="font-serif text-cream text-xl"
        style={{ fontStyle: "italic" }}
      >
        {title}
      </h3>
    </div>
  );
}
