// Domain types shared across the storefront, admin, and (later) the Drizzle layer.
// All money is stored as integer paise to avoid floating-point drift.

export type ProductFamily = "ash-tray" | "honey-comb-wrap";

export type CategorySlug =
  | "all-trays"
  | "round"
  | "square"
  | "crystal"
  | "premium"
  | "portable"
  | "gift-set"
  | "all-wraps"
  | "rolls"
  | "pre-cut"
  | "bags-pouches"
  | "kids"
  | "wrap-gift-sets"
  | "accessories";

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Emerald", "Large (3-pack)", '15" × 100m'
  pricePaise: number;
  compareAtPaise?: number; // for showing a strike-through
  sku: string;
  inStock: boolean;
  swatchHex?: string; // for colour variants
  // For dimensioned products (e.g. honeycomb wrap), the PDP renders two
  // selectors derived from these: length is the primary "selection bar".
  width?: string; // e.g. '10"'
  length?: string; // e.g. '50m'
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  title: string;
  body: string;
  createdAt: string; // ISO
  verified: boolean;
}

export interface Product {
  id: string;
  slug: string;
  family: ProductFamily;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  categories: CategorySlug[];
  images: ProductImage[];
  video?: string; // optional product demo video (served from /public)
  variants: ProductVariant[];
  basePricePaise: number;
  compareAtPaise?: number;
  badge?: string; // e.g. "New", "Bestseller"
  sampleAvailable: boolean;
  rating: number; // aggregate
  reviewCount: number;
  reviews?: Review[];
}

export interface CategoryDef {
  slug: CategorySlug;
  label: string;
  family: ProductFamily;
}
