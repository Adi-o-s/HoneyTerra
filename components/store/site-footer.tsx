import Link from "next/link";
import { Logo } from "./logo";

// lucide-react dropped trademarked brand icons, so we inline simple social glyphs.
const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 1.8.25 2.2.42.6.22 1 .49 1.4.9.42.41.69.82.9 1.4.18.46.37 1.06.43 2.26.05 1.2.06 1.6.06 4.75s0 3.55-.07 4.75c-.06 1.2-.25 1.8-.42 2.2-.22.6-.49 1-.9 1.4-.41.42-.82.69-1.4.9-.46.18-1.06.37-2.26.43-1.2.05-1.6.06-4.75.06s-3.55 0-4.75-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.22-1-.49-1.4-.9-.42-.41-.69-.82-.9-1.4-.18-.46-.37-1.06-.43-2.26C2.21 15.55 2.2 15.15 2.2 12s0-3.55.07-4.75c.06-1.2.25-1.8.42-2.2.22-.6.49-1 .9-1.4.41-.42.82-.69 1.4-.9.46-.18 1.06-.37 2.26-.43C8.45 2.21 8.85 2.2 12 2.2zm0 3.65A6.15 6.15 0 1018.15 12 6.15 6.15 0 0012 5.85zm0 10.15A4 4 0 1116 12a4 4 0 01-4 4zm6.4-10.4a1.44 1.44 0 11-1.44-1.44 1.44 1.44 0 011.44 1.44z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23 7.5a3 3 0 00-2.1-2.13C19.05 5 12 5 12 5s-7.05 0-8.9.37A3 3 0 001 7.5 31.3 31.3 0 00.65 12 31.3 31.3 0 001 16.5a3 3 0 002.1 2.13C4.95 19 12 19 12 19s7.05 0 8.9-.37A3 3 0 0023 16.5 31.3 31.3 0 0023.35 12 31.3 31.3 0 0023 7.5zM9.75 15.27V8.73L15.5 12z",
  },
];

const COLS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Gel Ash Tray", href: "/shop/ash-trays" },
      { label: "Honey Comb Wrap", href: "/shop/wraps" },
      { label: "Gift Sets", href: "/shop?c=gift-set" },
      { label: "Accessories", href: "/shop?c=accessories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Sustainability", href: "/about#sustainability" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Track Order", href: "/track" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-900 text-brand-100">
      <div className="bg-honeycomb">
        <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo mono />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200">
              Sustainable living starts with smart choices. We create products that care for you and the planet.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-100 transition-colors hover:bg-honey-400 hover:text-brand-900"
                >
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-base font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-brand-200 transition-colors hover:text-honey-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-page flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-sm text-brand-300 sm:flex-row">
          <p>© {new Date().getFullYear()} HoneyTerra. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-brand-200">Secure payments</span>
            <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">UPI</span>
            <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">VISA</span>
            <span className="rounded bg-white/10 px-2 py-1 text-xs font-semibold">RuPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
