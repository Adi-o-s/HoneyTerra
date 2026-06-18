"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantName: string;
  pricePaise: number;
  image: string; // "visual:<hue>" or url
  family: "ash-tray" | "honey-comb-wrap";
  qty: number;
  isSample?: boolean;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, qty: number) => void;
  clear: () => void;
}

const key = (l: { variantId: string; isSample?: boolean }) =>
  `${l.variantId}${l.isSample ? ":sample" : ""}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (line, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => key(l) === key(line));
          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                key(l) === key(line) ? { ...l, qty: l.qty + qty } : l,
              ),
            };
          }
          return { isOpen: true, lines: [...state.lines, { ...line, qty }] };
        }),
      remove: (variantId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.variantId !== variantId) })),
      setQty: (variantId, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => (l.variantId === variantId ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "honeyterra-cart" },
  ),
);

export const selectCount = (s: CartState) =>
  s.lines.reduce((n, l) => n + l.qty, 0);
export const selectSubtotal = (s: CartState) =>
  s.lines.reduce((sum, l) => sum + l.pricePaise * l.qty, 0);
