import "server-only";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, orderStatusHistory, productVariants, type ShippingAddressSnapshot } from "@/lib/db/schema";
import { CheckoutError, type PricedLine } from "@/lib/checkout/pricing";

export interface NewOrderInput {
  email: string;
  phone: string;
  address: ShippingAddressSnapshot;
  items: PricedLine[];
  subtotalPaise: number;
  shippingPaise: number;
  paymentMethod: "cod" | "razorpay";
  userId?: string | null;
}

async function generateOrderNumber(): Promise<string> {
  for (let i = 0; i < 6; i++) {
    const candidate = `HT-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, candidate),
      columns: { id: true },
    });
    if (!existing) return candidate;
  }
  return `HT-${Date.now().toString().slice(-8)}`;
}

/**
 * Create an order + items + initial status, and reserve stock — all in one
 * transaction. Stock is decremented with a guarded UPDATE (`stock >= qty`) so
 * concurrent checkouts can't oversell; if any line can't be reserved the whole
 * transaction rolls back and a CheckoutError is thrown.
 *
 * Note (v1): stock is reserved at order creation for online orders too, so an
 * abandoned Razorpay payment holds stock until the pending order is cleaned up.
 * Acceptable at current volume; revisit with a pending-order reaper later.
 */
export async function createOrder(input: NewOrderInput) {
  const orderNumber = await generateOrderNumber();
  const total = input.subtotalPaise + input.shippingPaise;
  const isCod = input.paymentMethod === "cod";

  return db.transaction(async (tx) => {
    // Reserve stock for each real (non-sample) line.
    for (const l of input.items) {
      if (l.isSample) continue;
      const reserved = await tx
        .update(productVariants)
        .set({ stock: sql`${productVariants.stock} - ${l.qty}` })
        .where(and(eq(productVariants.id, l.variantId), gte(productVariants.stock, l.qty)))
        .returning({ id: productVariants.id });
      if (reserved.length === 0) {
        throw new CheckoutError(`"${l.name}" is out of stock.`);
      }
    }

    const [order] = await tx
      .insert(orders)
      .values({
        orderNumber,
        userId: input.userId ?? null,
        email: input.email,
        phone: input.phone,
        status: isCod ? "confirmed" : "pending",
        paymentMethod: input.paymentMethod,
        paymentStatus: "pending",
        subtotalPaise: input.subtotalPaise,
        shippingPaise: input.shippingPaise,
        totalPaise: total,
        shippingAddress: input.address,
      })
      .returning();

    if (input.items.length) {
      await tx.insert(orderItems).values(
        input.items.map((l) => ({
          orderId: order.id,
          productId: l.isSample ? null : l.productId,
          variantId: l.isSample ? null : l.variantId,
          name: l.name,
          variantName: l.variantName,
          image: l.image,
          unitPricePaise: l.unitPricePaise, // server-authoritative, not the client value
          qty: l.qty,
          isSample: Boolean(l.isSample),
        })),
      );
    }

    await tx.insert(orderStatusHistory).values({
      orderId: order.id,
      status: order.status,
      note: isCod ? "Order placed (Cash on Delivery)" : "Awaiting payment",
    });

    return order;
  });
}

/**
 * Mark a Razorpay order as paid + confirmed. Idempotent: a no-op if the order
 * is already paid (so the client verify call and the webhook can both fire
 * without double-confirming or double-emailing). Returns true only on the
 * transition pending → paid.
 */
export async function markOrderPaid(orderId: string, razorpayPaymentId: string): Promise<boolean> {
  const updated = await db
    .update(orders)
    .set({ paymentStatus: "paid", status: "confirmed", razorpayPaymentId, updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.paymentStatus, "pending")))
    .returning({ id: orders.id });
  if (updated.length === 0) return false;
  await db.insert(orderStatusHistory).values({
    orderId,
    status: "confirmed",
    note: "Payment received",
  });
  return true;
}

export async function attachRazorpayOrder(orderId: string, razorpayOrderId: string) {
  await db.update(orders).set({ razorpayOrderId }).where(eq(orders.id, orderId));
}

export async function getOrderByNumber(orderNumber: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.orderNumber, orderNumber.trim().toUpperCase()),
  });
  if (!order) return null;
  const items = await db.query.orderItems.findMany({ where: eq(orderItems.orderId, order.id) });
  const history = await db.query.orderStatusHistory.findMany({
    where: eq(orderStatusHistory.orderId, order.id),
  });
  return { order, items, history };
}

export async function getOrderById(orderId: string) {
  return db.query.orders.findFirst({ where: eq(orders.id, orderId) });
}

/** All orders for a signed-in customer, newest first. */
export async function getOrdersByUser(userId: string) {
  return db.query.orders.findMany({
    where: eq(orders.userId, userId),
    orderBy: (o, { desc }) => [desc(o.createdAt)],
  });
}
