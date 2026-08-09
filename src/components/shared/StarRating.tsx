"use client";

import { Star } from "lucide-react";

export function StarRating({
  value, onChange, size = 16, readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" role={readOnly ? undefined : "radiogroup"} aria-label="Puan">
      {stars.map((s) => {
        const filled = s <= Math.round(value);
        return readOnly ? (
          <Star key={s} size={size} className={filled ? "fill-gold text-gold" : "text-sand"} />
        ) : (
          <button
            key={s}
            type="button"
            onClick={() => onChange?.(s)}
            aria-label={`${s} yıldız`}
            className="p-0.5"
          >
            <Star size={size} className={filled ? "fill-gold text-gold" : "text-sand hover:text-gold/60 transition-colors"} />
          </button>
        );
      })}
    </div>
  );
}
