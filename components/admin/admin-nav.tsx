"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white/15 text-white" : "text-brand-100 hover:bg-white/10 hover:text-white",
            )}
          >
            <l.icon className="h-4.5 w-4.5" />
            {l.label}
          </Link>
        );
      })}
      <Link
        href="/"
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-200 hover:bg-white/10 hover:text-white"
      >
        <ExternalLink className="h-4.5 w-4.5" /> View store
      </Link>
    </nav>
  );
}
