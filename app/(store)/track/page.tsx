"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TrackPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = value.trim().toUpperCase();
    if (!num) return;
    // Pass the email so the order page can authorize the view — the order number
    // alone no longer reveals a stranger's details. If it's blank or wrong, the
    // order page shows its own "confirm it's your order" prompt.
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    router.push(`/order/${encodeURIComponent(num)}${q}`);
  }

  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
        <PackageSearch className="h-8 w-8 text-brand-600" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold">Track your order</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Enter your order number (e.g. <span className="font-semibold">HT-123456</span>) and the email you used to see
        live delivery status.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex w-full max-w-md flex-col gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="HT-123456"
          className="h-12 w-full rounded-full border border-line bg-paper px-5 text-center outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email used at checkout"
          className="h-12 w-full rounded-full border border-line bg-paper px-5 text-center outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <Button type="submit" variant="primary" size="lg">Track order</Button>
      </form>
    </div>
  );
}
