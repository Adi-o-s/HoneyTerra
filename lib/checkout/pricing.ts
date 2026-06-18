import "server-only";
import { inArray } from "drizzle-orm";
import type { CartLine } from "@/lib/store/cart";
import { db } from "@/lib/db";
import { productVariants } from "@/lib/db/schema";

// Authoritative pricing. The server recomputes totals from the DB so a tampered
// client cart can't change what's charged.
export const SAMPLE_PRICE_PAISE = 4900;
export const FREE_SHIP_THRESHOLD = 99900;
export const SHIP_FEE_PAISE = 4900;

/** A checkout-level failure the API route turns into a 4xx with this message. */
export class CheckoutError extends Error {
  status: number;
  constructor(message: string, status = 409) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

/** A cart line resolved against the DB, with the price actually charged. */
export interface PricedLine extends CartLine {
  /** Server-authoritative unit price (paise). Never trusts the client value. */
  unitPricePaise: number;
}

export interface PricedCart {
  subtotal: number;
  shipping: number;
  total: number;
  lines: PricedLine[];
}

export async function priceCart(items: CartLine[]): Promise<PricedCart> {
  const variantIds = items.filter((i) => !i.isSample).map((i) => i.variantId);
  const rows = variantIds.length
    ? await db
        .select({
          id: productVariants.id,
          productId: productVariants.productId,
          price: productVariants.pricePaise,
          stock: productVariants.stock,
        })
        .from(productVariants)
        .where(inArray(productVariants.id, variantIds))
    : [];
  const byId = new Map(rows.map((r) => [r.id, r]));

  let subtotal = 0;
  const lines: PricedLine[] = [];
  for (const l of items) {
    const qty = Math.max(1, Math.floor(l.qty));
    let unit: number;
    let productId = l.productId;

    if (l.isSample) {
      unit = SAMPLE_PRICE_PAISE;
    } else {
      const v = byId.get(l.variantId);
      // Unknown variant → reject. Never fall back to the client-supplied price.
      if (!v) throw new CheckoutError("One or more items are no longer available. Please refresh your cart.");
      if (v.stock < qty) {
        throw new CheckoutError(
          v.stock <= 0
            ? `"${l.name}" is out of stock.`
            : `Only ${v.stock} of "${l.name}" left — please reduce the quantity.`,
        );
      }
      unit = v.price;
      productId = v.productId; // trust the DB's product↔variant link, not the client
    }

    subtotal += unit * qty;
    lines.push({ ...l, qty, productId, unitPricePaise: unit });
  }

  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : SHIP_FEE_PAISE;
  return { subtotal, shipping, total: subtotal + shipping, lines };
}
