import { ButtonLink } from "@/components/ui/button";
import { ProductVisual } from "../product-visual";
import { Reveal } from "../reveal";

export function WrapFeature() {
  return (
    <section className="relative overflow-hidden bg-sand">
      <div className="absolute inset-0 bg-honeycomb opacity-50" />
      <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-wider text-honey-600">
            Sustainable Packaging
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            <span className="text-honey-500">Honey</span>comb Wrap
          </h2>
          <p className="mt-2 font-display text-2xl text-ink-soft">Protect more. Plastic less.</p>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Plastic-free honeycomb paper that cushions fragile shipments — the
            sustainable alternative to bubble wrap for e-commerce, retail &amp; gifting.
          </p>
          <ButtonLink href="/shop/wraps" variant="honey" size="lg" className="mt-8">
            Explore Honeycomb Wrap
          </ButtonLink>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
            <ProductVisual src="visual:honey" family="honey-comb-wrap" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
