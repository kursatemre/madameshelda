import Link from "next/link";

const categoryLabels: Record<string, string> = {
  ev: "Ev",
  magaza: "Mağaza",
  ofis: "Ofis",
  ozel: "Özel Sipariş",
};

const heights = ["h-64", "h-72", "h-80", "h-64", "h-96", "h-72", "h-80", "h-64", "h-72"];

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: string;
  bg: string;
}

export function GalleryCard({ product, index }: { product: Product; index: number }) {
  const height = heights[index % heights.length];

  return (
    <Link href={`/eser/${product.slug}`} className="group block img-zoom">
      <div className={`relative w-full ${height} overflow-hidden`}>
        {/* Gradient placeholder */}
        <div
          className="img-inner absolute inset-0"
          style={{ background: product.bg }}
        />

        {/* Flower overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-25"
          viewBox="0 0 400 300"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="200"
              cy="80"
              rx="28"
              ry="85"
              fill="#a07850"
              transform={`rotate(${angle} 200 150)`}
            />
          ))}
          <circle cx="200" cy="150" r="22" fill="#a07850" />
        </svg>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown/85 via-brown/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

        {/* Info — appears on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <span className="font-label text-gold text-[0.55rem] mb-1.5">
            {categoryLabels[product.category] ?? product.category}
          </span>
          <h3
            className="font-serif text-cream text-xl mb-3"
            style={{ fontStyle: "italic" }}
          >
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span
              className="font-serif text-gold-light text-lg"
              style={{ fontStyle: "italic" }}
            >
              {product.price}
            </span>
            <span className="font-label text-cream/60 text-[0.55rem]">
              Detaylar →
            </span>
          </div>
        </div>

        {/* Category badge — always visible */}
        <div className="absolute top-4 left-4">
          <span className="font-label text-[0.55rem] bg-cream/90 text-brown px-3 py-1.5">
            {categoryLabels[product.category] ?? product.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
