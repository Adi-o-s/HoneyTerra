// Seeds the catalogue (categories + products + variants + images) from the
// in-repo seed data into Postgres. Idempotent: clears catalogue tables first.
// Run once DATABASE_URL is set:  npm run db:seed

import { db } from "./index";
import {
  products,
  productImages,
  productVariants,
  categories,
  productCategories,
  reviews,
} from "./schema";
import { PRODUCTS } from "../data/products";
import { ASH_TRAY_CATEGORIES, WRAP_CATEGORIES } from "../data/categories";

async function main() {
  console.log("Seeding catalogue…");

  // Clear in FK-safe order.
  await db.delete(reviews);
  await db.delete(productCategories);
  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(products);
  await db.delete(categories);

  // Categories
  const catDefs = [...ASH_TRAY_CATEGORIES, ...WRAP_CATEGORIES];
  const insertedCats = await db
    .insert(categories)
    .values(catDefs.map((c, i) => ({ slug: c.slug, label: c.label, family: c.family, position: i })))
    .returning({ id: categories.id, slug: categories.slug });
  const catBySlug = new Map(insertedCats.map((c) => [c.slug, c.id]));

  // Products
  for (const p of PRODUCTS) {
    const [row] = await db
      .insert(products)
      .values({
        slug: p.slug,
        family: p.family,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        highlights: p.highlights,
        basePricePaise: p.basePricePaise,
        compareAtPaise: p.compareAtPaise,
        badge: p.badge,
        sampleAvailable: p.sampleAvailable,
        video: p.video,
        rating: p.rating,
        reviewCount: p.reviewCount,
      })
      .returning({ id: products.id });

    await db.insert(productImages).values(
      p.images.map((img, i) => ({ productId: row.id, url: img.url, alt: img.alt, position: i })),
    );

    await db.insert(productVariants).values(
      p.variants.map((v, i) => ({
        productId: row.id,
        name: v.name,
        sku: v.sku,
        pricePaise: v.pricePaise,
        compareAtPaise: v.compareAtPaise,
        swatchHex: v.swatchHex,
        width: v.width,
        length: v.length,
        stock: v.inStock ? 100 : 0,
        position: i,
      })),
    );

    const catLinks = p.categories
      .map((slug) => catBySlug.get(slug))
      .filter((id): id is string => Boolean(id))
      .map((categoryId) => ({ productId: row.id, categoryId }));
    if (catLinks.length) await db.insert(productCategories).values(catLinks);

    if (p.reviews?.length) {
      await db.insert(reviews).values(
        p.reviews.map((r) => ({
          productId: row.id,
          author: r.author,
          rating: r.rating,
          title: r.title,
          body: r.body,
          verified: r.verified,
          status: "approved" as const,
          createdAt: new Date(r.createdAt),
        })),
      );
    }

    console.log(`  ✓ ${p.name} (${p.variants.length} variants)`);
  }

  console.log(`Done. Seeded ${PRODUCTS.length} products, ${catDefs.length} categories.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
