import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  orderStatusHistory,
  shipments,
  products,
  productVariants,
  productImages,
  orderStatus,
  productFamily,
} from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

export type OrderStatusValue = (typeof orderStatus.enumValues)[number];

// ── Dashboard + analytics ──────────────────────────────────────────────
export async function getDashboardData() {
  const [allOrders, prods, vars, items] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(products),
    db.select().from(productVariants),
    db.select().from(orderItems),
  ]);
  const live = allOrders.filter((o) => o.status !== "cancelled" && o.status !== "refunded");
  const revenuePaise = live.reduce((s, o) => s + o.totalPaise, 0);

  // Sales over the last 14 days.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const salesByDay = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (13 - i));
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const dayOrders = live.filter((o) => {
      const c = new Date(o.createdAt);
      return c >= day && c < next;
    });
    return {
      label: day.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenuePaise: dayOrders.reduce((s, o) => s + o.totalPaise, 0),
      orders: dayOrders.length,
    };
  });

  // Top products by units sold.
  const byName = new Map<string, { units: number; revenuePaise: number }>();
  for (const it of items) {
    if (it.isSample) continue;
    const e = byName.get(it.name) ?? { units: 0, revenuePaise: 0 };
    e.units += it.qty;
    e.revenuePaise += it.unitPricePaise * it.qty;
    byName.set(it.name, e);
  }
  const topProducts = [...byName.entries()]
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Status breakdown.
  const statusCounts: Record<string, number> = {};
  for (const o of allOrders) statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;

  return {
    orderCount: allOrders.length,
    revenuePaise,
    aovPaise: live.length ? Math.round(revenuePaise / live.length) : 0,
    openCount: allOrders.filter((o) => o.status === "pending" || o.status === "confirmed" || o.status === "processing").length,
    productCount: prods.length,
    lowStock: vars.filter((v) => v.stock < 10).length,
    recent: allOrders.slice(0, 6),
    salesByDay,
    topProducts,
    statusCounts,
  };
}

// ── Orders ─────────────────────────────────────────────────────────────
export async function getAllOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderDetail(id: string) {
  const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
  if (!order) return null;
  const [items, history, shipment] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, id)),
    db.select().from(orderStatusHistory).where(eq(orderStatusHistory.orderId, id)).orderBy(orderStatusHistory.createdAt),
    db.query.shipments.findFirst({ where: eq(shipments.orderId, id) }),
  ]);
  return { order, items, history, shipment: shipment ?? null };
}

export async function updateOrderStatusDb(id: string, status: OrderStatusValue, note?: string) {
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
  await db.insert(orderStatusHistory).values({ orderId: id, status, note: note || null });
}

export async function setTrackingDb(id: string, carrier: string, trackingNumber: string) {
  const existing = await db.query.shipments.findFirst({ where: eq(shipments.orderId, id) });
  if (existing) {
    await db
      .update(shipments)
      .set({ carrier, trackingNumber, shippedAt: existing.shippedAt ?? new Date(), updatedAt: new Date() })
      .where(eq(shipments.orderId, id));
  } else {
    await db.insert(shipments).values({ orderId: id, carrier, trackingNumber, shippedAt: new Date() });
  }
}

// ── Products ───────────────────────────────────────────────────────────
export async function getAdminProducts() {
  const [prods, vars] = await Promise.all([
    db.select().from(products).orderBy(products.createdAt),
    db.select().from(productVariants),
  ]);
  return prods.map((p) => ({ ...p, variants: vars.filter((v) => v.productId === p.id) }));
}

export async function getProductForEdit(id: string) {
  const product = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!product) return null;
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, id))
    .orderBy(productVariants.position);
  return { product, variants };
}

export async function updateProductDb(
  id: string,
  fields: Partial<{ name: string; tagline: string; description: string; badge: string | null; basePricePaise: number; sampleAvailable: boolean; isActive: boolean }>,
) {
  await db.update(products).set({ ...fields, updatedAt: new Date() }).where(eq(products.id, id));
}

export async function updateVariantDb(id: string, fields: Partial<{ pricePaise: number; stock: number }>) {
  await db.update(productVariants).set({ ...fields, updatedAt: new Date() }).where(eq(productVariants.id, id));
}

export type ProductFamilyValue = (typeof productFamily.enumValues)[number];

async function uniqueSlug(base: string) {
  const existing = new Set((await db.select({ slug: products.slug }).from(products)).map((r) => r.slug));
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

/** Create a product with one default variant; returns the new product. */
export async function createProductDb(input: { name: string; family: ProductFamilyValue; basePricePaise: number }) {
  const slug = await uniqueSlug(slugify(input.name) || "product");
  const [p] = await db
    .insert(products)
    .values({
      slug,
      family: input.family,
      name: input.name,
      tagline: "",
      description: "",
      basePricePaise: input.basePricePaise,
      isActive: false, // hidden until the owner adds details + images
    })
    .returning();
  await db.insert(productVariants).values({
    productId: p.id,
    name: "Default",
    sku: `${slug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}-1`,
    pricePaise: input.basePricePaise,
    stock: 0,
    position: 0,
  });
  return p;
}

export async function deleteProductDb(id: string) {
  await db.delete(products).where(eq(products.id, id)); // cascades variants/images/categories/reviews
}

export async function addVariantDb(productId: string, input: { name: string; sku: string; pricePaise: number; stock: number }) {
  const existing = await db.select({ id: productVariants.id }).from(productVariants).where(eq(productVariants.productId, productId));
  await db.insert(productVariants).values({ productId, ...input, position: existing.length });
}

export async function deleteVariantDb(id: string) {
  await db.delete(productVariants).where(eq(productVariants.id, id));
}

export async function addImageDb(productId: string, url: string, alt: string) {
  const existing = await db.select({ id: productImages.id }).from(productImages).where(eq(productImages.productId, productId));
  await db.insert(productImages).values({ productId, url, alt, position: existing.length });
}

export async function deleteImageDb(id: string) {
  await db.delete(productImages).where(eq(productImages.id, id));
}

export async function getProductImages(productId: string) {
  return db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.position);
}
