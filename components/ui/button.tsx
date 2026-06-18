import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap transition-all duration-200 ease-[var(--ease-out-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(16,83,65,0.55)] hover:bg-brand-700 hover:-translate-y-0.5",
        honey:
          "bg-honey-400 text-brand-900 shadow-[0_8px_20px_-8px_rgba(185,113,26,0.55)] hover:bg-honey-500 hover:text-white hover:-translate-y-0.5",
        outline:
          "border border-brand-600/30 text-brand-700 bg-transparent hover:bg-brand-50 hover:border-brand-600/60",
        ghost: "text-ink-soft hover:bg-brand-50 hover:text-brand-700",
        dark: "bg-ink text-paper hover:bg-brand-900",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-full",
        md: "h-11 px-6 text-sm rounded-full",
        lg: "h-13 px-8 text-base rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { buttonVariants };
