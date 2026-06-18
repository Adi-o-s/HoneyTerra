"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Wired to /api/newsletter in a later step; optimistic for now.
    setDone(true);
  }

  return (
    <section className="container-page py-16">
      <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-6 py-14 text-center shadow-[var(--shadow-lift)]">
        <div className="absolute inset-0 bg-honeycomb opacity-30" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Join the HoneyTerra Family
          </h2>
          <p className="mt-3 text-brand-100">
            Get tips, new product updates and exclusive offers straight to your inbox.
          </p>

          {done ? (
            <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-3 font-semibold text-white">
              <Check className="h-5 w-5 text-honey-300" /> You&apos;re in! Welcome to the hive.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 flex-1 rounded-full border-0 bg-white px-5 text-ink outline-none ring-honey-300 focus:ring-2"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-honey-400 px-6 font-semibold text-brand-900 transition-colors hover:bg-honey-300"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
