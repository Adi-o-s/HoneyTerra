import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getProductsByFamily, getAllProducts } from "@/lib/db/queries/catalog";
import { ProductDetail } from "@/components/store/product-detail";
import { ReviewsSection } from "@/components/store/reviews-section";
import { ProductCard } from "@/components/store/product-card";

export async function generateStaticParams() {
  return (await getAllProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.tagline };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getProductsByFamily(product.family))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-page py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/shop" className="hover:text-brand-700">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductDetail product={product} />
      <ReviewsSection product={product} />

      {related.length > 0 && (
        <section className="py-8">
          <h2 className="mb-6 font-display text-3xl font-semibold">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
