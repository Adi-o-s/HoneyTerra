import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Reveal } from "@/components/store/reveal";

export const metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about HoneyTerra products, shipping, returns, payments and caring for your Gel Ash Tray and Honey Comb wraps.",
};

const GROUPS: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "Products",
    items: [
      {
        q: "What is the Gel Ash Tray and how does it work?",
        a: "The Gel Ash Tray uses a specially formulated gel that traps ash and absorbs smoke odour, keeping your space cleaner and fresher. It's durable, easy to wipe down, and designed to last through everyday use.",
      },
      {
        q: "What are Honey Comb wraps made of?",
        a: "They're made from organic cotton infused with beeswax, tree resin and jojoba oil. That blend makes the cloth pliable and naturally clingy, so it seals around food, bowls and produce without any plastic.",
      },
      {
        q: "How long do the wraps last?",
        a: "With normal use and proper care, a wrap lasts around a year. When it eventually wears out, it's compostable — simply cut it up and add it to your compost or use it as a natural firestarter.",
      },
      {
        q: "Are your products safe and non-toxic?",
        a: "Yes. Our wraps are made with food-safe, natural ingredients, and the Gel Ash Tray is built from durable, non-toxic materials. Everything is designed to be safe around your home and family.",
      },
    ],
  },
  {
    heading: "Care & use",
    items: [
      {
        q: "How do I clean a Honey Comb wrap?",
        a: "Wash it in cool water with a little mild dish soap, then air dry. Avoid hot water, the dishwasher or the microwave — heat melts the beeswax. Don't use wraps with raw meat or fish.",
      },
      {
        q: "How do I clean the Gel Ash Tray?",
        a: "Let it cool fully, then wipe it with a damp cloth or rinse with cool water. Avoid harsh abrasives so the surface stays smooth and the gel keeps working well.",
      },
    ],
  },
  {
    heading: "Orders & shipping",
    items: [
      {
        q: "Where do you ship?",
        a: "We ship across India. You'll see available delivery options and any charges at checkout based on your pin code.",
      },
      {
        q: "How long will my order take?",
        a: "Orders are usually dispatched within 1–2 business days and arrive within 3–7 business days, depending on your location. You'll get a tracking link by email as soon as it ships.",
      },
      {
        q: "How can I track my order?",
        a: "Use the Track Order page with your order number, or follow the tracking link in your confirmation email.",
      },
    ],
  },
  {
    heading: "Payments & returns",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, major debit and credit cards (Visa, Mastercard, RuPay) and other popular methods through our secure payment partner. Your payment details are never stored on our servers.",
      },
      {
        q: "What is your return policy?",
        a: "If something arrives damaged or isn't right, contact us within 7 days of delivery and we'll make it right with a replacement or refund. For hygiene reasons, used wraps and ash trays can't be returned unless they're faulty.",
      },
      {
        q: "How do I request a refund?",
        a: "Email us at hello@honeyterra.in with your order number and a photo if the item arrived damaged. Approved refunds are processed to your original payment method within 5–7 business days.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-paper to-cream" />
        <div className="absolute inset-0 -z-10 bg-honeycomb opacity-60" />
        <div className="container-page py-16 text-center lg:py-20">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-4 py-1.5 text-sm font-semibold text-brand-700">
              <HelpCircle className="h-4 w-4" /> Help Centre
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Everything you need to know about our products, orders and care. Can&rsquo;t find
              your answer? We&rsquo;re a message away.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-page max-w-3xl pb-20">
        <div className="space-y-12">
          {GROUPS.map((group) => (
            <Reveal key={group.heading}>
              <h2 className="font-display text-2xl font-semibold text-brand-800">{group.heading}</h2>
              <div className="mt-4 divide-y divide-brand-100 overflow-hidden rounded-2xl bg-paper shadow-[var(--shadow-soft)]">
                {group.items.map((item) => (
                  <details key={item.q} className="group px-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink marker:hidden">
                      {item.q}
                      <ChevronDown className="h-5 w-5 shrink-0 text-brand-500 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="pb-5 text-sm leading-relaxed text-ink-soft">{item.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 rounded-2xl border border-brand-100 bg-brand-50/50 p-8 text-center">
            <h3 className="font-display text-xl font-semibold">Still have a question?</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Reach our team at{" "}
              <a href="mailto:hello@honeyterra.in" className="font-semibold text-brand-700 hover:underline">
                hello@honeyterra.in
              </a>{" "}
              or head to our{" "}
              <Link href="/contact" className="font-semibold text-brand-700 hover:underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
