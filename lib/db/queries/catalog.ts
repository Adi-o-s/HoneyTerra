import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  products as P,
  productImages as PI,
  productVariants as PV,
  productCategories as PCat,
  categories as C,
  reviews as R,
} from "@/lib/db/schema";
import type { Product, ProductVariant, Review, CategorySlug, ProductFamily } from "@/lib/types";

function groupBy<T, K extends keyof T>(rows: T[], key: K) {
  const map = new Map<T[K], T[]>();
  for (const row of rows) {
    const k = row[key];
    (map.get(k) ?? map.set(k, []).get(k)!).push(row);
  }
  return map;
}

// Assemble the full catalogue from the normalised tables into the Product shape
// the storefront components already expect. Cached per request.
export const getAllProducts = cache(async (): Promise<Product[]> => {
  const [prows, irows, vrows, pcrows, crows, rrows] = await Promise.all([
    db.select().from(P).where(eq(P.isActive, true)).orderBy(P.createdAt),
    db.select().from(PI).orderBy(PI.position),
    db.select().from(PV).orderBy(PV.position),
    db.select().from(PCat),
    db.select().from(C),
    db.select().from(R).where(eq(R.status, "approved")),
  ]);

  const catSlug = new Map(crows.map((c) => [c.id, c.slug]));
  const imgByP = groupBy(irows, "productId");
  const varByP = groupBy(vrows, "productId");
  const pcByP = groupBy(pcrows, "productId");
  const revByP = groupBy(rrows, "productId");

  return prows.map((p): Product => {
    const variants: ProductVariant[] = (varByP.get(p.id) ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      pricePaise: v.pricePaise,
      compareAtPaise: v.compareAtPaise ?? undefined,
      sku: v.sku,
      inStock: v.stock > 0,
      swatchHex: v.swatchHex ?? undefined,
      width: v.width ?? undefined,
      length: v.length ?? undefined,
    }));
    const reviews: Review[] = (revByP.get(p.id) ?? []).map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      title: r.title,
      body: r.body,
      createdAt: r.createdAt.toISOString(),
      verified: r.verified,
    }));
    return {
      id: p.id,
      slug: p.slug,
      family: p.family as ProductFamily,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      highlights: p.highlights,
      categories: (pcByP.get(p.id) ?? [])
        .map((pc) => catSlug.get(pc.categoryId))
        .filter(Boolean) as CategorySlug[],
      images: (imgByP.get(p.id) ?? []).map((i) => ({ url: i.url, alt: i.alt })),
      video: p.video ?? undefined,
      variants,
      basePricePaise: p.basePricePaise,
      compareAtPaise: p.compareAtPaise ?? undefined,
      badge: p.badge ?? undefined,
      sampleAvailable: p.sampleAvailable,
      rating: p.rating,
      reviewCount: p.reviewCount,
      reviews: reviews.length ? reviews : undefined,
    };
  });
});

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

export async function getProductsByFamily(family: ProductFamily): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.family === family);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (category === "all" || !category) return all;
  if (category === "all-trays") return all.filter((p) => p.family === "ash-tray");
  if (category === "all-wraps") return all.filter((p) => p.family === "honey-comb-wrap");
  return all.filter((p) => p.categories.includes(category as CategorySlug));
}
