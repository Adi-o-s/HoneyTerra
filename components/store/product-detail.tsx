"use client";

import { useState } from "react";
import { Minus, Plus, Star, Truck, RotateCcw, Leaf, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductGallery } from "./product-gallery";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";
import { cn, formatINR } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  const price = variant.pricePaise;
  const compareAt = variant.compareAtPaise ?? product.compareAtPaise;

  // Dimensioned products (e.g. honeycomb wrap) get two selectors derived from the
  // variants: length (the primary "selection bar") × width. Not all combos exist.
  const dimensioned = product.variants.some((v) => v.length);
  const uniq = (arr: (string | undefined)[]) => [...new Set(arr.filter(Boolean) as string[])];
  const lengths = uniq(product.variants.map((v) => v.length));
  const widths = uniq(product.variants.map((v) => v.width));
  const widthAvailable = (length: string, width: string) =>
    product.variants.some((v) => v.length === length && v.width === width);
  function selectDim(nextLength: string, nextWidth: string) {
    const width = widthAvailable(nextLength, nextWidth)
      ? nextWidth
      : widths.find((w) => widthAvailable(nextLength, w))!;
    const v = product.variants.find((x) => x.length === nextLength && x.width === width);
    if (v) setVariant(v);
  }

  function addToCart(isSample = false) {
    add(
      {
        productId: product.id,
        variantId: isSample ? `${variant.id}-sample` : variant.id,
        slug: product.slug,
        name: product.name,
        variantName: isSample ? `Sample · ${variant.name}` : variant.name,
        pricePaise: isSample ? 4900 : price,
        image: product.images[0].url,
        family: product.family,
        isSample,
      },
      isSample ? 1 : qty,
    );
    if (!isSample) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      {/* Gallery */}
      <ProductGallery product={product} />

      {/* Info */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-honey-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) && "fill-current")} />
            ))}
          </div>
          <span className="text-sm font-semibold">{product.rating}</span>
          <span className="text-sm text-ink-muted">({product.reviewCount} reviews)</span>
        </div>

        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{product.name}</h1>
        <p className="mt-2 text-lg text-ink-soft">{product.tagline}</p>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-3xl font-semibold text-brand-700">{formatINR(price)}</span>
          {compareAt && (
            <>
              <span className="text-lg text-ink-muted line-through">{formatINR(compareAt)}</span>
              <span className="rounded-full bg-honey-100 px-2.5 py-1 text-xs font-bold text-honey-700">
                Save {formatINR(compareAt - price)}
              </span>
            </>
          )}
        </div>

        <p className="mt-5 leading-relaxed text-ink-soft">{product.description}</p>

        {/* Variant selector */}
        {dimensioned ? (
          <div className="mt-6 space-y-5">
            {/* Length — primary selection bar */}
            <div>
              <p className="text-sm font-semibold text-ink">
                Length: <span className="text-ink-soft">{variant.length}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {lengths.map((l) => (
                  <button
                    key={l}
                    onClick={() => selectDim(l, variant.width!)}
                    className={cn(
                      "min-w-16 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                      variant.length === l
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-line text-ink-soft hover:border-brand-300",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Width — secondary, options vary per length */}
            <div>
              <p className="text-sm font-semibold text-ink">
                Width: <span className="text-ink-soft">{variant.width}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {widths.map((w) => {
                  const avail = widthAvailable(variant.length!, w);
                  return (
                    <button
                      key={w}
                      disabled={!avail}
                      onClick={() => selectDim(variant.length!, w)}
                      className={cn(
                        "min-w-16 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        variant.width === w
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : avail
                            ? "border-line text-ink-soft hover:border-brand-300"
                            : "border-line text-ink-muted opacity-40 line-through cursor-not-allowed",
                      )}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-sm font-semibold text-ink">
              {product.family === "ash-tray" ? "Pack size" : "Size"}:{" "}
              <span className="text-ink-soft">{variant.name}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                    variant.id === v.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-line text-ink-soft hover:border-brand-300",
                  )}
                >
                  {v.swatchHex && (
                    <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: v.swatchHex }} />
                  )}
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty + add */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-line">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-ink-soft hover:text-brand-700" aria-label="Decrease">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3 text-ink-soft hover:text-brand-700" aria-label="Increase">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={() => addToCart(false)} variant="primary" size="lg" className="flex-1 min-w-48">
            {added ? (<><Check className="h-5 w-5" /> Added to cart</>) : `Add to cart · ${formatINR(price * qty)}`}
          </Button>
        </div>

        {product.sampleAvailable && (
          <button
            onClick={() => addToCart(true)}
            className="mt-3 text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Not sure yet? Order a sample for {formatINR(4900)} →
          </button>
        )}

        {/* Highlights */}
        <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-ink-soft">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {h}
            </li>
          ))}
        </ul>

        {/* Trust row */}
        <div className="mt-7 grid grid-cols-3 gap-3 rounded-2xl border border-line bg-cream/60 p-4 text-center">
          {[
            { icon: Truck, label: "Free shipping over ₹999" },
            { icon: RotateCcw, label: "7-day easy returns" },
            { icon: Leaf, label: "Eco-friendly & reusable" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1.5">
              <t.icon className="h-5 w-5 text-brand-600" />
              <span className="text-xs text-ink-muted">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
