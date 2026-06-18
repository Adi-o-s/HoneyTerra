# HoneyTerra — Full-Stack E-Commerce Platform

## Context

HoneyTerra is a D2C eco-brand (Gel Ash Trays, Honey Comb beeswax Wraps). The founder wants a **one-stop store**: browse products, request samples, order, track orders, manage an account — plus a **self-serve admin panel** with full analytics for a non-technical client to run the business.

Two hard requirements drive every decision:
1. **It must not look templated or "AI-generated."** This is a premium brand site whose job is to *convert visitors into buyers*. Design is a first-class feature, not an afterthought.
2. **The admin must be operable by a non-technical owner** — no code, no SQL, point-and-click product/order/content management.

Build is **fully custom (Next.js + Supabase)**, payments via **Razorpay (₹) + COD**, shipped **MVP-first** then expanded along an ambitious roadmap. The codebase is maintained by a developer, so code is typed, documented, and clean.

**Traffic & cost reality (answered for the founder):** 10k visitors/day ≈ 300k/mo, ~150–200 concurrent at peak — *modest*. Serverless autoscales through it. Validation phase runs at **₹0/mo** (free tiers); the 10k/day target runs at **~₹4,000–5,500/mo (~$45–65)** infra — Vercel Pro $20 + Supabase Pro $25 + email. Real cost is payment processing (~2% per order), unavoidable on any platform. No "concurrent user limit" to fear at this scale.

---

## Tech Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | SSR/RSC for SEO + speed (conversion), one repo for store + admin + API |
| Styling | **Tailwind + shadcn/ui (heavily themed)** | Speed, but with a *custom design system* so it never looks like stock shadcn |
| Motion | **Framer Motion** | Tasteful micro-interactions = premium feel |
| DB / Auth / Storage | **Supabase (Postgres + Auth + Storage + RLS)** | One backend for data, login, product images; generous free tier |
| Query layer | **Drizzle ORM** | Type-safe SQL over Supabase Postgres; clean for a dev to maintain |
| Validation | **Zod** | Shared client/server schemas |
| Payments | **Razorpay** (Orders API + webhook verification) **+ COD** | India-first; UPI/cards/netbanking. COD lifts conversion |
| Email | **Resend** + React Email | Order confirmation, shipping/tracking emails |
| Order updates (Phase 2) | **MSG91 / WhatsApp** | SMS + WhatsApp order updates — expected by Indian shoppers |
| Customer analytics | **PostHog** (free tier) | Funnels, session insight, feeds admin dashboard |
| Hosting | **Vercel** (Hobby → Pro) + Supabase Cloud | Autoscaling, zero-ops |
| Testing | **Playwright** (checkout E2E) + **Vitest** | Protect the money path |

---

## Design Direction (the "not-AI" mandate)

Derived from the existing mockup — this is a deliberate, branded system, not defaults:

- **Palette:** eco-green/teal (logo green), **honey amber** accent, warm cream/off-white backgrounds, charcoal text. Two-tone headings (e.g. green + charcoal) as in the hero.
- **Type:** distinctive pairing (characterful display + clean body) — *avoid Inter-everywhere*. Weight contrast in headlines.
- **Motif:** subtle **honeycomb texture** + bee illustration accents (already brand-coded).
- **Feel:** editorial whitespace, real product photography, custom radii/shadows, scroll reveals, sticky add-to-cart on PDP.
- **Conversion levers baked in:** reviews/ratings, trust badges (secure payment, eco-certified), "Made with Care" value props, free-sample CTA, urgency/stock cues, fast LCP. Target Lighthouse 90+.

---

## Data Model (core tables)

`products`, `product_variants` (Crystal Round / Square Minimal / Classic Round / Diamond Cut, sizes), `categories`, `collections`, `product_images`, `inventory` ·
`carts`, `cart_items` (guest cookie + user-synced) ·
`orders`, `order_items`, `order_status_history` (tracking timeline), `shipments` (carrier, tracking #) ·
`profiles`, `addresses` (extends Supabase `auth.users`) ·
`sample_requests`, `reviews`, `coupons`, `newsletter_subscribers` ·
`analytics_events` (funnel), `admin_audit_log` ·
**RLS policies** so customers only see their own orders/data; admin role bypasses.

---

## Build Phases

### Phase 0 — Foundation
Scaffold Next.js + TS + Tailwind + shadcn; Supabase project; Drizzle schema + migrations + seed data; **design tokens / theme** (palette, type, motif); env config; CI lint/typecheck. *Outcome: themed shell + DB ready.*

### Phase 1 — MVP (get it selling) ← first deliverable
- **Storefront matching mockup:** Home (hero, catalogue, shop-by-category, Honey Comb Wrap section, value props, newsletter, footer), product listing + category filters, **PDP** (gallery, variants, sticky add-to-cart, reviews, *Request Sample*), cart drawer.
- **Checkout:** address → **Razorpay + COD** → webhook-verified order. Guest checkout supported.
- **Auth & account:** email/password + Google + **phone OTP**; order history, **order tracking timeline**, addresses, profile.
- **Sample requests** feature (form, address, admin queue).
- **Reviews & ratings:** verified-buyer reviews on PDP (star rating, text, optional photo), aggregate rating on product cards, sort/filter by rating. Submit from the account/order page after delivery.
- **Order confirmation + tracking emails** (Resend); **post-delivery review-request email** to drive review collection.
- **Minimal admin:** products CRUD (image upload, variants, stock), orders list, update status + add tracking #.
- **Deploy** to Vercel + Supabase; Playwright test on the order path.

### Phase 2 — Full Admin & Analytics (the "complete analytical view")
- **Dashboard:** revenue, orders, AOV, conversion rate, sales-over-time charts, top products, low-stock alerts, traffic sources.
- **Funnel analytics:** visits → product views → add-to-cart → checkout → purchase; **abandoned-cart** report (+ recovery email).
- **Reviews management:** moderation queue (approve/reject/reply), flag spam, feature top reviews on homepage, **ratings analytics** (avg rating per product, review volume over time, low-rated alerts), automated review-request scheduling.
- Coupons/discounts, customers view, **content manager** (edit hero/banners/featured — no code), shipping & COD settings.
- **WhatsApp/SMS** order updates (MSG91), PostHog integration.

### Phase 3 — Growth (ambitious)
Wishlist · faceted search (Typesense/Algolia) · product recommendations · **gift sets/bundles** · **wrap refill subscriptions** · loyalty/referrals · blog/SEO content · structured data + sitemap · A/B testing on PDP/checkout.

---

## Critical Files / Structure (new repo)

```
app/(store)/...        # storefront routes (home, shop, product, cart, checkout, account, track)
app/(admin)/admin/...  # admin panel (role-gated)
app/api/...            # route handlers: razorpay webhook, cart, orders, samples
lib/db/schema.ts       # Drizzle schema (source of truth)
lib/db/queries/        # typed query functions reused by store + admin
lib/payments/razorpay.ts
lib/auth.ts            # Supabase auth helpers + role guard
lib/email/             # React Email templates
components/ui/         # themed shadcn primitives
components/store/      # branded storefront components
styles/theme           # design tokens (palette, type, honeycomb motif)
```

---

## Verification

- **Local:** `pnpm dev`; Supabase + Razorpay in **test mode**; seed catalog (the 4 ash trays + wraps).
- **Money path (must pass before launch):** Playwright E2E — browse → add to cart → checkout → Razorpay test payment → webhook marks order paid → confirmation email → order appears in account + admin → admin adds tracking → tracking timeline updates → COD variant.
- **Sample flow:** submit request → appears in admin queue → status update reflects to customer.
- **Admin usability:** non-technical walkthrough — add a product with photo, fulfill an order, edit homepage banner, all without code.
- **Quality gates:** `tsc` + lint clean; **Lighthouse ≥ 90** on home + PDP (perf = conversion); RLS verified (user A cannot read user B's orders).

---

## Open / Deferred Decisions (not blocking Phase 1)
- Shipping/courier integration (Shiprocket/Delhivery API) vs. manual tracking # entry — start manual, automate in Phase 2.
- Real product copy, photography, prices — client provides; we ship with structured placeholders.
- Domain + business Razorpay KYC — client action before live payments.
