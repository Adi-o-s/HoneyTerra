# HoneyTerra

Full-stack storefront + admin for the HoneyTerra eco-brand (Gel Ash Trays &
Honey Comb beeswax wraps). Built with Next.js 16 (App Router), TypeScript,
Tailwind v4, and a custom brand design system.

> Plan & roadmap: see `/Users/aditya/.claude/plans/hello-i-want-to-lazy-liskov.md`

## Run locally

```bash
npm run dev          # http://localhost:3000
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

## What's built (Phase 1 — storefront frontend)

| Area | Path |
|------|------|
| Brand design system (tokens, fonts, honeycomb motif) | `app/globals.css`, `app/layout.tsx` |
| Home (matches approved mockup) | `app/(store)/page.tsx` + `components/store/home/*` |
| Shop listing + category filters | `app/(store)/shop/`, `shop/ash-trays/`, `shop/wraps/` |
| Product detail (variants, add-to-cart, sample, reviews) | `app/(store)/product/[slug]/page.tsx` |
| Cart (client store + slide-out drawer) | `lib/store/cart.ts`, `components/store/cart-drawer.tsx` |
| Header / footer / nav | `components/store/site-header.tsx`, `site-footer.tsx` |
| Real product photos + demo videos | `public/products/gel-ashtray/`, `components/store/product-gallery.tsx` |
| Checkout → order confirmation → tracking | `app/(store)/checkout/`, `order/[orderNumber]/`, `track/` |
| Database schema + migration + RLS | `lib/db/schema.ts`, `drizzle/`, `supabase/policies.sql` |

Product catalogue is seed data in `lib/data/products.ts`. Domain types live in
`lib/types.ts` and are mirrored by the Drizzle schema in `lib/db/schema.ts`.

### Live backend (Supabase Postgres + Razorpay + Resend)
- **DB** — Supabase Postgres via Drizzle (`lib/db/`). Schema migrated, catalogue seeded, RLS + triggers applied.
- **Cart** — `lib/store/cart.ts` (zustand + localStorage).
- **Checkout** — `POST /api/checkout` recomputes totals server-side
  (`lib/checkout/pricing.ts`), writes the order to the DB (`lib/db/queries/orders.ts`),
  and for online payment creates a Razorpay order. COD confirms immediately.
- **Payment verify** — `POST /api/checkout/verify` checks the Razorpay HMAC
  signature (`lib/payments/razorpay.ts`) then marks the order paid.
- **Email** — `lib/email/resend.ts` sends a branded order confirmation after COD/payment.
- **Order/tracking** — `order/[orderNumber]` is a server component reading from the DB.
- **Auth** — Supabase email/password. `proxy.ts` (Next 16's middleware) refreshes the
  session (`lib/supabase/proxy.ts`); server actions in `lib/auth/actions.ts`; pages
  `login/`, `signup/`, protected `account/` (order history). Checkout links orders to the
  signed-in user (`getCurrentUser` in `lib/auth/user.ts`); guest checkout still works.
- **Catalogue is DB-driven** — storefront reads from Supabase via
  `lib/db/queries/catalog.ts` (assembles products + variants + images + reviews into the
  `Product` shape). Seed data in `lib/data/products.ts` is now only the input to `db:seed`.
- **Admin panel** — `app/(admin)/admin/*`, gated by `requireAdmin` (`profile.role='admin'`).
  - **Dashboard** — revenue, AOV, 14-day sales chart, top products, status breakdown, recent orders.
  - **Orders** — list + detail: update status (→ customer timeline) + carrier/tracking.
  - **Products** — full CRUD: create, edit (name/price/stock/badge/visibility), add/remove
    variants, **image upload to Supabase Storage** (`components/admin/product-images.tsx`,
    bucket `product-images`), and delete. All reflect on the storefront.
  - Queries in `lib/db/queries/admin.ts`, server actions in `app/(admin)/admin/actions.ts`.
  - Make a user admin: `update profiles set role='admin' where id=…`.

### Database commands (all read `.env.local`)
- `npm run db:generate` → migration in `drizzle/` (17 tables).
- `npm run db:migrate` → applies to Supabase. Then apply RLS once: `psql "$DATABASE_URL" -f supabase/policies.sql`.
- `npm run db:seed` loads the catalogue.

> **Auth/Storage:** Supabase clients are configured (`lib/supabase/`) but login/account
> pages aren't built yet. **Email to real customers** needs a verified domain in Resend
> (currently limited to the account owner's address via `onboarding@resend.dev`).

## Design system

- **Colours**: `brand-*` (botanical green), `honey-*` (amber), `cream/sand/paper/ink` neutrals.
- **Fonts**: Fraunces (display) + Plus Jakarta Sans (body) via `next/font`.
- **Utilities**: `bg-honeycomb`, `container-page`, `--shadow-soft`, `--shadow-lift`.
- All colours are CSS variables in `@theme` — change the brand in one place.

## Next steps (need credentials)

To wire the backend, the following accounts/keys are required (added to `.env.local`):

```env
# Supabase (DB + Auth + Storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=               # Postgres connection string for Drizzle

# Razorpay (payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Resend (transactional email)
RESEND_API_KEY=
```

Then: Drizzle schema + migrations → auth & accounts → checkout (Razorpay + COD)
→ samples/reviews submission + emails → admin panel & analytics. See the plan
file for the full phased roadmap.
