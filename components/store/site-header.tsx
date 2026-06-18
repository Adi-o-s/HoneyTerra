"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { useCart, selectCount } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Honey Comb Wrap", href: "/shop/wraps" },
  { label: "Gel Ash Tray", href: "/shop/ash-trays" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const count = useCart(selectCount);
  const open = useCart((s) => s.open);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    // Defer initial reads out of the effect body (avoids synchronous setState).
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      onScroll();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-paper/85 backdrop-blur-md shadow-[0_1px_0_rgba(231,222,208,0.9)]"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-ink-soft transition-colors hover:text-brand-700 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-brand-500 after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={open}
            aria-label="Open cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-honey-400 px-1 text-[11px] font-bold text-brand-900">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-brand-50 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-paper px-5 py-4 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-base font-medium text-ink-soft hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
