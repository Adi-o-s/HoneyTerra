"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./product-visual";
import { formatINR } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-square overflow-hidden bg-cream">
        <div className="h-full w-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-105">
          <ProductVisual src={product.images[0].url} family={product.family} />
        </div>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        )}
        {product.compareAtPaise && (
          <span className="absolute right-3 top-3 rounded-full bg-honey-400 px-3 py-1 text-xs font-bold text-brand-900">
            Save {formatINR(product.compareAtPaise - product.basePricePaise)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center gap-1 text-honey-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs font-semibold text-ink-soft">{product.rating}</span>
          <span className="text-xs text-ink-muted">({product.reviewCount})</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-ink">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{product.tagline}</p>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold text-brand-700">{formatINR(product.basePricePaise)}</span>
            {product.compareAtPaise && (
              <span className="text-sm text-ink-muted line-through">{formatINR(product.compareAtPaise)}</span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-all group-hover:gap-2">
            View <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
