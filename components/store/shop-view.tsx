import Link from "next/link";
import type { Product, ProductFamily } from "@/lib/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

// Categories here are only used for the filter links, so a loose shape keeps the
// "All" pseudo-category (slug "all" / "all-trays" / "all-wraps") simple to pass in.
type FilterCategory = { slug: string; label: string };

export function ShopView({
  title,
  subtitle,
  products,
  categories,
  activeCategory,
  basePath = "/shop",
}: {
  title: string;
  subtitle: string;
  products: Product[];
  categories: FilterCategory[];
  activeCategory?: string;
  basePath?: string;
}) {
  return (
    <div className="container-page py-12">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-ink-soft">{subtitle}</p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2.5">
        {categories.map((c, i) => {
          const isActive = activeCategory ? activeCategory === c.slug : i === 0;
          return (
            <Link
              key={c.slug}
              href={`${basePath}?c=${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "border-brand-500 bg-brand-600 text-white"
                  : "border-line text-ink-soft hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <p className="mb-5 text-sm text-ink-muted">{products.length} products</p>

      {products.length === 0 ? (
        <p className="py-16 text-center text-ink-muted">No products in this category yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export function familyLabel(family: ProductFamily) {
  return family === "ash-tray" ? "Gel Ash Tray" : "Honey Comb Wrap";
}
