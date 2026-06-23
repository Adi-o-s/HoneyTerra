import Link from "next/link";
import { Leaf, Recycle, Sprout, Sun, HandHeart, PackageCheck, Hexagon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/store/reveal";

export const metadata = {
  title: "About Us",
  description:
    "HoneyTerra makes eco-friendly home essentials — Gel Ash Trays and reusable Honey Comb beeswax wraps — designed for cleaner living and a lighter footprint.",
};

const STATS = [
  { value: "600+", label: "Happy homes" },
  { value: "4.8★", label: "Average rating" },
  { value: "100%", label: "Reusable wraps" },
  { value: "0", label: "Single-use plastic" },
];

const PILLARS = [
  {
    icon: Sprout,
    title: "Natural materials",
    body: "Our Honey Comb wraps are made from cotton, beeswax, tree resin and jojoba oil — nothing synthetic, nothing you can't pronounce.",
  },
  {
    icon: Recycle,
    title: "Built to be reused",
    body: "A single wrap replaces hundreds of metres of cling film over its life. Wash it, fold it, use it again — for a year or more.",
  },
  {
    icon: Sun,
    title: "Low-impact by design",
    body: "We make in small batches, ship in plastic-free packaging, and choose recyclable materials wherever we possibly can.",
  },
  {
    icon: PackageCheck,
    title: "Honest products",
    body: "No greenwashing. If something can be made better or cleaner, we say so — and we keep working on it.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-paper to-cream" />
        <div className="absolute inset-0 -z-10 bg-honeycomb opacity-60" />
        <div className="container-page py-20 text-center lg:py-28">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-4 py-1.5 text-sm font-semibold text-brand-700">
              <Hexagon className="h-4 w-4" /> Our Story
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Small, everyday swaps for a{" "}
              <span className="text-brand-600">cleaner home</span> and a kinder planet
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              HoneyTerra began with a simple frustration — too much single-use waste in
              the things we use every day. So we set out to design beautiful, practical
              essentials you&rsquo;ll actually reach for, again and again.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-8 pb-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-paper p-8 shadow-[var(--shadow-soft)] sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <p className="font-display text-3xl font-semibold text-brand-700 sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="scroll-mt-24">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Our Story</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              It started in a kitchen
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>
                A roll of cling film, half a bin of plastic by the end of the week, and the
                nagging feeling there had to be a better way. That was the start of HoneyTerra
                — a small team in India trying to make sustainable living feel effortless
                rather than like a sacrifice.
              </p>
              <p>
                We began with the Honey Comb wrap: a reusable beeswax cloth that keeps food
                fresh without a scrap of plastic. From there came the Gel Ash Tray — designed
                to trap ash and odour so shared spaces stay fresh and clean. Different
                products, same belief: the things we use daily should be good for us and gentle
                on the world.
              </p>
              <p>
                Today we&rsquo;re a growing family of 600+ homes, and we&rsquo;re just getting started.
                Every product we add has to earn its place — useful, well-made, and a genuine
                step away from throwaway habits.
              </p>
            </div>
            <div className="mt-8">
              <ButtonLink href="/shop" variant="primary" size="lg">
                Explore our products
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-b from-white to-brand-50 shadow-[var(--shadow-lift)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/products/gel-ashtray/lifestyle.jpg"
                alt="HoneyTerra products in a home setting"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="scroll-mt-24 bg-gradient-to-b from-brand-50/60 to-paper">
        <div className="container-page py-16 lg:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
              <Leaf className="h-4 w-4" /> Sustainability
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Sustainability isn&rsquo;t a feature. It&rsquo;s the whole point.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              We can&rsquo;t claim to be perfect — but we can be honest about what we do, and keep
              raising the bar. Here&rsquo;s how we think about our footprint.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="flex h-full gap-4 rounded-2xl bg-paper p-6 shadow-[var(--shadow-soft)]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100/70 text-brand-600">
                    <p.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values / mission CTA */}
      <section className="container-page py-16 lg:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-14 text-center shadow-[var(--shadow-lift)]">
            <div className="absolute inset-0 bg-honeycomb opacity-30" />
            <div className="relative mx-auto max-w-xl">
              <HandHeart className="mx-auto h-10 w-10 text-honey-300" />
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                Made with care, for people who care
              </h2>
              <p className="mt-3 text-brand-100">
                Have a question, an idea, or just want to say hello? We read every message.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/contact" variant="honey" size="lg">
                  Get in touch
                </ButtonLink>
                <Link
                  href="/faqs"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white underline-offset-4 hover:underline"
                >
                  Read our FAQs
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
