"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const categories = [
  { value: "", label: "Tümü" },
  { value: "ev", label: "Ev" },
  { value: "magaza", label: "Mağaza" },
  { value: "ofis", label: "Ofis" },
  { value: "ozel", label: "Özel Sipariş" },
];

function FilterBarInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("kategori") ?? "";

  const setCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("kategori", value);
    } else {
      params.delete("kategori");
    }
    router.push(`/galeri?${params.toString()}`);
  };

  return (
    <div className="sticky top-16 lg:top-20 z-40 bg-cream/95 backdrop-blur-sm border-b border-sand">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`shrink-0 font-label text-[0.65rem] px-5 py-2.5 transition-all duration-300 ${
                active === cat.value
                  ? "bg-brown text-cream"
                  : "text-brown/50 hover:text-brown border border-transparent hover:border-sand"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilterBar() {
  return (
    <Suspense fallback={<div className="h-14 border-b border-sand" />}>
      <FilterBarInner />
    </Suspense>
  );
}
