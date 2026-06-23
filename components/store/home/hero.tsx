"use client";

import { motion } from "framer-motion";
import { Sparkles, Wind, Droplets, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const PILLS = [
  { icon: Wind, label: "Odour Control" },
  { icon: Droplets, label: "Easy to Clean" },
  { icon: ShieldCheck, label: "Durable & Long Lasting" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft gradient wash */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-50 via-paper to-cream" />
      <div className="absolute inset-0 -z-10 bg-honeycomb opacity-60" />
      <div className="absolute -right-32 top-10 -z-10 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />

      <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-100/70 px-4 py-1.5 text-sm font-semibold text-brand-700"
          >
            <Sparkles className="h-4 w-4" /> New Product
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            <span className="text-brand-600">Gel</span> Ash Tray
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-3 font-display text-2xl text-ink-soft"
          >
            Clean. Stylish. Smoke-Friendly.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft"
          >
            Our innovative Gel Ash Tray traps ash and odour, keeping your space
            clean, fresh and smoke-friendly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/shop/ash-trays" variant="primary" size="lg">
              Explore Catalogue
            </ButtonLink>
            <ButtonLink href="/samples" variant="outline" size="lg">
              Get a free sample
            </ButtonLink>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {PILLS.map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-sm font-medium text-ink-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper shadow-[var(--shadow-soft)]">
                  <p.icon className="h-4.5 w-4.5 text-brand-600" />
                </span>
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* product showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          {/* smoke wisps */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-6 h-40 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-t from-transparent via-white to-transparent blur-md"
              style={{ marginLeft: (i - 1) * 26 }}
              animate={{ opacity: [0, 0.7, 0], y: [-10, -70], scaleX: [1, 2.4] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            />
          ))}
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-b from-white to-brand-50 shadow-[var(--shadow-lift)]">
            <video
              className="h-full w-full object-cover"
              src="/products/gel-ashtray/hero.mp4"
              poster="/products/gel-ashtray/hero.png"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-paper px-5 py-4 shadow-[var(--shadow-lift)] sm:block">
            <p className="font-display text-2xl font-semibold text-brand-700">4.8★</p>
            <p className="text-xs text-ink-muted">600+ happy homes</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
