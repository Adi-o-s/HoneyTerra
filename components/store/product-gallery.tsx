"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./product-visual";
import { cn } from "@/lib/utils";

type Slide =
  | { type: "image"; url: string; alt: string }
  | { type: "video"; url: string };

export function ProductGallery({ product }: { product: Product }) {
  const slides: Slide[] = [
    ...product.images.map((img) => ({ type: "image" as const, url: img.url, alt: img.alt })),
    ...(product.video ? [{ type: "video" as const, url: product.video }] : []),
  ];
  const [active, setActive] = useState(0);
  const current = slides[active] ?? slides[0];

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream shadow-[var(--shadow-soft)]">
        {current.type === "video" ? (
          <video
            key={current.url}
            src={current.url}
            className="h-full w-full object-cover"
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <ProductVisual src={current.url} family={product.family} />
        )}
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View ${s.type} ${i + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 bg-cream transition-all",
                active === i ? "border-brand-500" : "border-transparent hover:border-brand-200",
              )}
            >
              {s.type === "video" ? (
                <>
                  <video src={`${s.url}#t=0.1`} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                    <Play className="h-5 w-5 fill-white text-white" />
                  </span>
                </>
              ) : (
                <ProductVisual src={s.url} family={product.family} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
