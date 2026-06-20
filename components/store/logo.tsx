"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** SVG fallback used only until the real artwork exists at /logo.png. */
function FallbackMark({ mono, className }: { mono?: boolean; className?: string }) {
  const left = mono ? "rgba(255,255,255,0.20)" : "#141414";
  const right = mono ? "#7cc45a" : "#5cb12f";
  const top = mono ? "#fffdf8" : "#f4eedd";
  const inner = mono ? "#0b362c" : "#141414";
  const comb = mono ? "#7cc45a" : "#5cb12f";

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <polygon points="5,11 20,19 20,34 5,26" fill={left} />
      <polygon points="20,19 35,11 35,26 20,34" fill={right} />
      <polygon points="20,3 35,11 20,19 5,11" fill={top} />
      <polygon points="20,7 27.5,11 20,15 12.5,11" fill={inner} opacity="0.92" />
      <g fill="none" stroke={comb} strokeWidth="0.9" strokeLinejoin="round">
        <polygon points="16.5,7.6 18.2,8.6 18.2,10.6 16.5,11.6 14.8,10.6 14.8,8.6" />
        <polygon points="20.5,9.4 22.2,10.4 22.2,12.4 20.5,13.4 18.8,12.4 18.8,10.4" />
      </g>
      <path d="M22.4 21 C 27.4 23.6, 27.4 28.4, 22.4 27.6" fill="none" stroke={mono ? "#0b362c" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 11 L20 19 L35 11 M20 19 L20 34" fill="none" stroke={mono ? "#0b362c" : "#ffffff"} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, mono }: { className?: string; mono?: boolean }) {
  // Prefer the real artwork at /public/logo.png; fall back to the SVG mark if
  // it isn't there yet. Add the file and it appears everywhere automatically.
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        {imgFailed ? (
          <FallbackMark mono={mono} className="h-9 w-9" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo.png"
            alt="HoneyTerra"
            className="h-9 w-9 object-contain"
            onError={() => setImgFailed(true)}
          />
        )}
      </span>
      <span
        className={cn(
          "font-display text-2xl font-semibold tracking-tight",
          mono ? "text-paper" : "text-ink",
        )}
      >
        Honey<span className={mono ? "text-honey-300" : "text-brand-600"}>Terra</span>
      </span>
    </Link>
  );
}
