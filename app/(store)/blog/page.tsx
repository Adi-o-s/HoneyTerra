import { BookOpen, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/store/reveal";

export const metadata = {
  title: "Blog",
  description:
    "Tips, guides and stories on sustainable living, low-waste habits and getting the most out of your HoneyTerra essentials.",
};

type Post = {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMins: number;
  image: string;
};

const POSTS: Post[] = [
  {
    title: "5 simple swaps to cut plastic from your kitchen",
    excerpt:
      "You don't need to overhaul your whole life overnight. Start with these five easy changes — beginning with the humble cling-film roll.",
    category: "Low-waste living",
    date: "June 12, 2026",
    readMins: 4,
    image: "/products/gel-ashtray/lifestyle.jpg",
  },
  {
    title: "How to care for your Honey Comb wraps (so they last a year)",
    excerpt:
      "A few small habits make all the difference. Here's exactly how to wash, store and refresh your beeswax wraps to get the most life out of them.",
    category: "Product care",
    date: "May 28, 2026",
    readMins: 3,
    image: "/products/gel-ashtray/packaging.png",
  },
  {
    title: "The story behind the Gel Ash Tray",
    excerpt:
      "Why we made it, how the odour-trapping gel actually works, and what we learned designing a product that keeps shared spaces fresh.",
    category: "Behind the scenes",
    date: "May 9, 2026",
    readMins: 5,
    image: "/products/gel-ashtray/premium.png",
  },
  {
    title: "Beeswax wraps vs cling film: what the numbers say",
    excerpt:
      "One reusable wrap replaces hundreds of metres of single-use plastic. We did the math on waste, cost and freshness.",
    category: "Sustainability",
    date: "April 22, 2026",
    readMins: 6,
    image: "/products/gel-ashtray/real-pack.jpg",
  },
  {
    title: "A low-waste lunchbox, packed in 5 minutes",
    excerpt:
      "Wraps, pouches and a bit of planning. Here's how to pack a plastic-free lunch the whole family will actually eat.",
    category: "Low-waste living",
    date: "April 3, 2026",
    readMins: 4,
    image: "/products/gel-ashtray/extinguish.png",
  },
  {
    title: "What 'sustainable' really means to us",
    excerpt:
      "It's an easy word to slap on a label. We break down what we measure, where we still fall short, and what we're working on next.",
    category: "Behind the scenes",
    date: "March 18, 2026",
    readMins: 5,
    image: "/products/gel-ashtray/banner.webp",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-paper to-cream" />
        <div className="absolute inset-0 -z-10 bg-honeycomb opacity-60" />
        <div className="container-page py-16 text-center lg:py-20">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-4 py-1.5 text-sm font-semibold text-brand-700">
              <BookOpen className="h-4 w-4" /> The Journal
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Notes on cleaner, kinder living
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Practical tips, product care guides and the occasional story from behind the
              scenes at HoneyTerra.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page pb-20">
        {/* Featured */}
        <Reveal>
          <article className="group grid overflow-hidden rounded-3xl bg-paper shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-brand-600">
                <span>{featured.category}</span>
                <span className="text-ink-muted">·</span>
                <span className="text-ink-muted">{featured.readMins} min read</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-snug sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-ink-soft">{featured.excerpt}</p>
              <p className="mt-5 text-sm text-ink-muted">{featured.date}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-700">
                Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </article>
        </Reveal>

        {/* Grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.title} delay={(i % 3) * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600">
                    <span>{post.category}</span>
                    <span className="text-ink-muted">·</span>
                    <span className="text-ink-muted">{post.readMins} min</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-ink-muted">{post.date}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
