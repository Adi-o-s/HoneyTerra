import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden>
          {/* honeycomb cluster */}
          <g
            fill="none"
            stroke={mono ? "#fffdf8" : "#1c8160"}
            strokeWidth="2.4"
            strokeLinejoin="round"
          >
            <path d="M14 8l5 3v6l-5 3-5-3v-6z" />
            <path d="M24 8l5 3v6l-5 3-5-3v-6z" />
            <path d="M19 18l5 3v6l-5 3-5-3v-6z" />
          </g>
          {/* bee */}
          <circle cx="29" cy="11" r="3.2" fill={mono ? "#fbf6ec" : "#e8a33d"} />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-2xl font-semibold tracking-tight",
          mono ? "text-paper" : "text-ink",
        )}
      >
        honey<span className={mono ? "text-honey-300" : "text-brand-600"}>terra</span>
      </span>
    </Link>
  );
}
