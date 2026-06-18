import type { Product, ProductImage } from "@/lib/types";

// Real product photography (disposable foam ashtray with cigarette-extinguishing
// gel). Served from /public/products/gel-ashtray. Wraps still use the branded
// <ProductVisual> SVG renderer until real wrap photos are supplied.
const G = "/products/gel-ashtray";
const GEL: Record<string, ProductImage> = {
  hero: { url: `${G}/hero.png`, alt: "Disposable gel ashtray with blue extinguishing gel and MAX fill line" },
  extinguish: { url: `${G}/extinguish.png`, alt: "Water poured into the gel ashtray to put out smoke instantly" },
  premium: { url: `${G}/premium.png`, alt: "Stack of gel ashtrays styled on a travertine block" },
  lifestyle: { url: `${G}/lifestyle.jpg`, alt: "Group of disposable gel ashtrays with a resting cigarette" },
  packaging: { url: `${G}/packaging.png`, alt: "Gel ashtray pack with refill pouch" },
  realPack: { url: `${G}/real-pack.jpg`, alt: "Two shrink-wrapped stacks of HoneyTerra gel ashtrays" },
};
const GEL_DEMO_1 = `${G}/demo-1.mp4`;
const GEL_DEMO_2 = `${G}/demo-2.mp4`;

// Seed catalogue. Prices are in paise (₹ = paise / 100).

export const PRODUCTS: Product[] = [
  {
    id: "crystal-round",
    slug: "crystal-round-gel-ash-tray",
    family: "ash-tray",
    name: "Crystal Round",
    tagline: "Elegant round design with premium gel.",
    description:
      "Our signature round ashtray pairs a clean, sturdy disposable shell with HoneyTerra's cigarette-extinguishing gel. Stub out and the gel snuffs the smoke instantly — trapping ash and odour so the air stays fresh. When it's full, simply toss it. No scrubbing, ever.",
    highlights: [
      "Cigarette-extinguishing gel core",
      "Stops smoke & odour instantly",
      "No-mess, fully disposable",
      "MAX fill line for safe use",
    ],
    categories: ["all-trays", "round", "crystal", "premium"],
    images: [GEL.hero, GEL.extinguish, GEL.premium, GEL.lifestyle, GEL.packaging, GEL.realPack],
    video: GEL_DEMO_1,
    variants: [
      { id: "cr-5", name: "Pack of 5", pricePaise: 24900, sku: "HT-GA-5", inStock: true },
      { id: "cr-10", name: "Pack of 10", pricePaise: 44900, compareAtPaise: 49800, sku: "HT-GA-10", inStock: true },
      { id: "cr-20", name: "Pack of 20", pricePaise: 79900, compareAtPaise: 99600, sku: "HT-GA-20", inStock: true },
    ],
    basePricePaise: 24900,
    badge: "Bestseller",
    sampleAvailable: true,
    rating: 4.8,
    reviewCount: 214,
    reviews: [
      {
        id: "r1",
        author: "Aarav M.",
        rating: 5,
        title: "Genuinely controls the smell",
        body: "I was sceptical about the gel but the smoke smell is dramatically reduced. Looks gorgeous on my balcony table too.",
        createdAt: "2026-04-18T10:00:00Z",
        verified: true,
      },
      {
        id: "r2",
        author: "Priya S.",
        rating: 5,
        title: "Beautiful and practical",
        body: "Cleaning takes a wipe. Bought one for myself and gifted two more.",
        createdAt: "2026-05-02T10:00:00Z",
        verified: true,
      },
      {
        id: "r3",
        author: "Rohan K.",
        rating: 4,
        title: "Premium feel",
        body: "Heavy, solid glass. Wish it came in a bigger size.",
        createdAt: "2026-05-21T10:00:00Z",
        verified: true,
      },
    ],
  },
  {
    id: "square-minimal",
    slug: "square-minimal-gel-ash-tray",
    family: "ash-tray",
    name: "Square Minimal",
    tagline: "Minimal design for a modern look.",
    description:
      "Clean lines, calm presence. The same cigarette-extinguishing gel in a minimal disposable shell that looks at home on any desk, balcony or café table.",
    highlights: [
      "Cigarette-extinguishing gel core",
      "Minimal, modern silhouette",
      "Heat-safe, no-mess shell",
      "Toss when full — zero cleaning",
    ],
    categories: ["all-trays", "square", "premium"],
    images: [GEL.premium, GEL.hero, GEL.lifestyle, GEL.extinguish, GEL.packaging],
    video: GEL_DEMO_2,
    variants: [
      { id: "sq-5", name: "Pack of 5", pricePaise: 24900, sku: "HT-GS-5", inStock: true },
      { id: "sq-10", name: "Pack of 10", pricePaise: 44900, compareAtPaise: 49800, sku: "HT-GS-10", inStock: true },
    ],
    basePricePaise: 24900,
    sampleAvailable: true,
    rating: 4.7,
    reviewCount: 138,
  },
  {
    id: "classic-round",
    slug: "classic-round-gel-ash-tray",
    family: "ash-tray",
    name: "Classic Round",
    tagline: "The everyday classic that goes with everything.",
    description:
      "A timeless, understated classic. Versatile and built around the same clean, smoke-killing gel technology — perfect for homes, offices and outdoor seating.",
    highlights: [
      "Cigarette-extinguishing gel core",
      "Everyday, go-anywhere design",
      "Traps ash, smoke & odour",
      "Disposable — no scrubbing",
    ],
    categories: ["all-trays", "round", "portable"],
    images: [GEL.lifestyle, GEL.hero, GEL.premium, GEL.extinguish],
    video: GEL_DEMO_1,
    variants: [
      { id: "cl-5", name: "Pack of 5", pricePaise: 22900, sku: "HT-GC-5", inStock: true },
      { id: "cl-10", name: "Pack of 10", pricePaise: 39900, compareAtPaise: 45800, sku: "HT-GC-10", inStock: true },
    ],
    basePricePaise: 22900,
    sampleAvailable: true,
    rating: 4.6,
    reviewCount: 96,
  },
  {
    id: "diamond-cut",
    slug: "diamond-cut-gel-ash-tray",
    family: "ash-tray",
    name: "Bulk Value Pack",
    tagline: "Stock up for home, office or events.",
    description:
      "The same cigarette-extinguishing gel ashtrays in a value pack — ideal for offices, cafés, parties and events. Hand one out, use it, toss it. Always a fresh, clean ashtray on hand.",
    highlights: [
      "Cigarette-extinguishing gel core",
      "Great for events & offices",
      "Best value per ashtray",
      "Disposable — grab, use, toss",
    ],
    categories: ["all-trays", "round", "crystal", "premium", "gift-set"],
    images: [GEL.packaging, GEL.premium, GEL.realPack, GEL.hero, GEL.extinguish],
    video: GEL_DEMO_2,
    variants: [
      { id: "bv-20", name: "Pack of 20", pricePaise: 79900, sku: "HT-GB-20", inStock: true },
      { id: "bv-50", name: "Pack of 50", pricePaise: 169900, compareAtPaise: 199900, sku: "HT-GB-50", inStock: true },
      { id: "bv-100", name: "Pack of 100", pricePaise: 299900, compareAtPaise: 399900, sku: "HT-GB-100", inStock: true },
    ],
    basePricePaise: 79900,
    badge: "Best Value",
    sampleAvailable: true,
    rating: 4.9,
    reviewCount: 67,
  },
  // ── Honeycomb Wrap (eco-friendly packaging) ──────────────────────────
  {
    id: "honeycomb-wrap",
    slug: "honeycomb-wrap",
    family: "honey-comb-wrap",
    name: "Honeycomb Wrap",
    tagline: "The plastic-free alternative to bubble wrap.",
    description:
      "Eco-friendly honeycomb paper wrap for e-commerce, retail and shipping. It expands into a protective honeycomb cushion that hugs glass bottles, ceramics, electronics, cosmetics and gifts — keeping fragile items safe in transit. Lightweight, durable and 100% recyclable. (Prices exclusive of GST & shipping.)",
    highlights: [
      "Plastic-free & 100% recyclable",
      "Sustainable alternative to bubble wrap",
      "Lightweight, durable cushioning",
      "Ideal for e-commerce, retail & gifting",
    ],
    categories: ["all-wraps", "rolls"],
    images: [{ url: "visual:honey", alt: "Eco-friendly honeycomb packaging wrap roll" }],
    // Two dimensions: width (inches) × length (metres). Length is the primary
    // "selection bar"; width is the secondary option. Not all combos exist.
    variants: [
      { id: "hw-10-10", name: '10" × 10m', sku: "HT-HW-10-10", pricePaise: 8000, inStock: true, width: '10"', length: "10m" },
      { id: "hw-12-10", name: '12" × 10m', sku: "HT-HW-12-10", pricePaise: 8000, inStock: true, width: '12"', length: "10m" },
      { id: "hw-15-10", name: '15" × 10m', sku: "HT-HW-15-10", pricePaise: 8000, inStock: true, width: '15"', length: "10m" },
      { id: "hw-10-50", name: '10" × 50m', sku: "HT-HW-10-50", pricePaise: 18900, inStock: true, width: '10"', length: "50m" },
      { id: "hw-15-50", name: '15" × 50m', sku: "HT-HW-15-50", pricePaise: 27900, inStock: true, width: '15"', length: "50m" },
      { id: "hw-10-100", name: '10" × 100m', sku: "HT-HW-10-100", pricePaise: 29900, inStock: true, width: '10"', length: "100m" },
      { id: "hw-15-100", name: '15" × 100m', sku: "HT-HW-15-100", pricePaise: 39900, inStock: true, width: '15"', length: "100m" },
    ],
    basePricePaise: 8000,
    badge: "Bestseller",
    sampleAvailable: true,
    rating: 4.9,
    reviewCount: 118,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByFamily(family: Product["family"]): Product[] {
  return PRODUCTS.filter((p) => p.family === family);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all-trays") return getProductsByFamily("ash-tray");
  if (category === "all-wraps") return getProductsByFamily("honey-comb-wrap");
  return PRODUCTS.filter((p) => p.categories.includes(category as never));
}
