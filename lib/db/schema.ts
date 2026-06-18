// HoneyTerra database schema (Drizzle ORM + Postgres/Supabase).
// Money is stored as integer paise. Mirrors the domain types in lib/types.ts.
// Auth is handled by Supabase (auth.users); `profiles.id` equals the auth user id.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

// ── Enums ────────────────────────────────────────────────────────────────
export const productFamily = pgEnum("product_family", ["ash-tray", "honey-comb-wrap"]);
export const orderStatus = pgEnum("order_status", [
  "pending", // created, awaiting payment
  "confirmed", // paid or COD confirmed
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
]);
export const paymentMethod = pgEnum("payment_method", ["razorpay", "cod"]);
export const paymentStatus = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);
export const sampleStatus = pgEnum("sample_status", ["requested", "approved", "shipped", "fulfilled", "rejected"]);
export const reviewStatus = pgEnum("review_status", ["pending", "approved", "rejected"]);
export const userRole = pgEnum("user_role", ["customer", "admin"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

// ── Catalogue ────────────────────────────────────────────────────────────
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    family: productFamily("family").notNull(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull().default(""),
    description: text("description").notNull().default(""),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    basePricePaise: integer("base_price_paise").notNull(),
    compareAtPaise: integer("compare_at_paise"),
    badge: text("badge"),
    sampleAvailable: boolean("sample_available").notNull().default(false),
    video: text("video"),
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (t) => [uniqueIndex("products_slug_idx").on(t.slug), index("products_family_idx").on(t.family)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("product_images_product_idx").on(t.productId)],
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sku: text("sku").notNull(),
    pricePaise: integer("price_paise").notNull(),
    compareAtPaise: integer("compare_at_paise"),
    swatchHex: text("swatch_hex"),
    width: text("width"), // dimensioned products, e.g. honeycomb wrap: '10"'
    length: text("length"), // e.g. '50m'
    stock: integer("stock").notNull().default(0),
    position: integer("position").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("product_variants_sku_idx").on(t.sku), index("product_variants_product_idx").on(t.productId)],
);

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  family: productFamily("family").notNull(),
  position: integer("position").notNull().default(0),
});

export const productCategories = pgTable(
  "product_categories",
  {
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.productId, t.categoryId] })],
);

// ── Customers ────────────────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // == supabase auth.users.id
  fullName: text("full_name"),
  phone: text("phone"),
  role: userRole("role").notNull().default("customer"),
  ...timestamps,
});

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    pincode: text("pincode").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("addresses_user_idx").on(t.userId)],
);

// ── Orders ───────────────────────────────────────────────────────────────
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: text("order_number").notNull(), // human-friendly, e.g. HT-100023
    userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }), // null for guest
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    status: orderStatus("status").notNull().default("pending"),
    paymentMethod: paymentMethod("payment_method").notNull(),
    paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
    // Razorpay references
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    // Money (paise)
    subtotalPaise: integer("subtotal_paise").notNull(),
    shippingPaise: integer("shipping_paise").notNull().default(0),
    discountPaise: integer("discount_paise").notNull().default(0),
    totalPaise: integer("total_paise").notNull(),
    couponCode: text("coupon_code"),
    shippingAddress: jsonb("shipping_address").$type<ShippingAddressSnapshot>().notNull(),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("orders_number_idx").on(t.orderNumber),
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
  ],
);

export interface ShippingAddressSnapshot {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    // Snapshot of name/price at purchase time
    name: text("name").notNull(),
    variantName: text("variant_name").notNull(),
    image: text("image"),
    unitPricePaise: integer("unit_price_paise").notNull(),
    qty: integer("qty").notNull(),
    isSample: boolean("is_sample").notNull().default(false),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    status: orderStatus("status").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("order_status_history_order_idx").on(t.orderId)],
);

export const shipments = pgTable(
  "shipments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    carrier: text("carrier"),
    trackingNumber: text("tracking_number"),
    trackingUrl: text("tracking_url"),
    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("shipments_order_idx").on(t.orderId)],
);

// ── Samples, reviews, marketing ──────────────────────────────────────────
export const sampleRequests = pgTable(
  "sample_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    status: sampleStatus("status").notNull().default("requested"),
    shippingAddress: jsonb("shipping_address").$type<ShippingAddressSnapshot>(),
    ...timestamps,
  },
  (t) => [index("sample_requests_status_idx").on(t.status)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
    author: text("author").notNull(),
    rating: integer("rating").notNull(),
    title: text("title").notNull().default(""),
    body: text("body").notNull().default(""),
    photoUrl: text("photo_url"),
    verified: boolean("verified").notNull().default(false),
    status: reviewStatus("status").notNull().default("pending"),
    ...timestamps,
  },
  (t) => [index("reviews_product_idx").on(t.productId), index("reviews_status_idx").on(t.status)],
);

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  percentOff: integer("percent_off"), // either percent…
  amountOffPaise: integer("amount_off_paise"), // …or flat amount
  minSubtotalPaise: integer("min_subtotal_paise").notNull().default(0),
  maxRedemptions: integer("max_redemptions"),
  timesRedeemed: integer("times_redeemed").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Analytics & audit ────────────────────────────────────────────────────
export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").notNull(), // page_view | product_view | add_to_cart | begin_checkout | purchase …
    sessionId: text("session_id"),
    userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    path: text("path"),
    referrer: text("referrer"),
    valuePaise: integer("value_paise"),
    meta: jsonb("meta").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("analytics_events_type_idx").on(t.type), index("analytics_events_created_idx").on(t.createdAt)],
);

export const adminAuditLog = pgTable("admin_audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: text("entity_id"),
  meta: jsonb("meta").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
