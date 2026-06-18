import { Hexagon } from "lucide-react";
import { Hero } from "@/components/store/home/hero";
import { CategoryPills } from "@/components/store/home/category-pills";
import { WrapFeature } from "@/components/store/home/wrap-feature";
import { ValueProps } from "@/components/store/home/value-props";
import { Newsletter } from "@/components/store/newsletter";
import { ProductCard } from "@/components/store/product-card";
import { Reveal } from "@/components/store/reveal";
import { getProductsByFamily } from "@/lib/db/queries/catalog";
import { ASH_TRAY_CATEGORIES, WRAP_CATEGORIES } from "@/lib/data/categories";

export default async function HomePage() {
  const ashTrays = await getProductsByFamily("ash-tray");

  return (
    <>
      <Hero />

      {/* Catalogue */}
      <section className="container-page py-20">
        <div className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
            <Hexagon className="h-4 w-4" /> Gel Ash Tray
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Catalogue</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-honey-400" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ashTrays.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <CategoryPills title="Shop by Category" categories={ASH_TRAY_CATEGORIES} />
        </div>
      </section>

      <WrapFeature />

      <section className="container-page py-14">
        <CategoryPills title="Shop by Category" categories={WRAP_CATEGORIES} tone="honey" />
      </section>

      <ValueProps />
      <Newsletter />
    </>
  );
}
