# Final Changes — R2 Update

This update converts key admin sections from popup-based forms to dedicated routed pages,
makes the homepage fully data-driven from the database, optimizes images, fixes the admin
sidebar styling, and tightens API safety.

## Admin Panel — Page-Based Routing

The following sections now use **dedicated pages** instead of popup modals:

- **Brands**
  - `/admin/brands` — list page with search, filter by type, edit/view/delete actions
  - `/admin/brands/new` — create form
  - `/admin/brands/[id]` — view page (full details, images, product count)
  - `/admin/brands/[id]/edit` — edit form
- **Products**
  - `/admin/products` — list page with pagination, search, filter by type
  - `/admin/products/new` — create form
  - `/admin/products/[id]` — view page (gallery, specs, brand/category, all metadata)
  - `/admin/products/[id]/edit` — edit form
- **Sliders**
  - `/admin/sliders` — list page with placement filter
  - `/admin/sliders/new` — create form
  - `/admin/sliders/[id]` — view page (live preview of how it renders)
  - `/admin/sliders/[id]/edit` — edit form

Form components are reused between `new` and `edit` (BrandForm, ProductForm, SliderForm in
`components/admin/`). Each form handles validation, slug generation, image upload, and
returns the user to the appropriate list page on success.

Other admin sections (Categories, Events, Boutiques, Media, Content, Contact Messages,
Users) retain their existing popup pattern — they were working as-is and were not part
of this round of changes.

## Homepage — Fully Data-Driven

`app/public/page.tsx` no longer contains any hardcoded slider, brand, category, or
content data. Everything renders from the database:

- Hero slider → `/api/sliders?placement=HOME`
- Jewellery categories → `/api/categories`
- Watch sections → `/api/brands?type=WATCH&status=true`
- Brand grid → `/api/brands?type=JEWELLERY&status=true`
- Featured products → `/api/products?featured=true&limit=4`
- Heritage / Founder copy → `/api/content` (content blocks `heritage_intro`, `ceo_name`)
- Recent events → `/api/events?limit=3`
- Boutique list → `/api/boutiques`

If the database is empty, sections render gracefully (empty placeholders or hidden).

## Admin Sidebar Fixes

- Replaced the ugly internal scrollbar with a slim, gold-tinted custom scrollbar
  (`.admin-sidebar-scroll` class)
- Removed the dead "Settings" link that pointed to a non-existent page
- Reorganized nav into clearer sections: Catalog / Boutiques & Events / Media & Content
  / Communications / System
- Topbar now derives a smarter page label for nested routes (e.g. `/admin/brands/new` ->
  "New Brand")

## Image Cleanup

- Founder image (Gope Shahani) replaced with a higher-quality version from AG_Images,
  resized to 900px tall, 60KB
- Sheikh Nawaf BMP converted to JPG (45KB) at `public/images/founder/sheikh-nawaf.jpg`
- Large source images (DSC_0520.jpg, d5c5e114-...jpg, 72a12244-...jpg, ring-1.png,
  amiri-gems-gold.png, amiri-gems-icon.png) all resized to max 1920px and re-encoded at
  quality 82
- Total `public/images` footprint dropped to ~15 MB

## API & Validation Hardening

- `DELETE /api/brands/[id]` now refuses to delete brands that still have associated
  products and returns a clear error message
- `GET /api/brands/[id]` now also returns `_count.products`
- `POST /api/sliders` and `PUT /api/sliders/[id]` now strip `id`, `createdAt`,
  `updatedAt` from the payload before passing to Prisma
- All admin form pages handle 404 gracefully

## What's Still on the Popup Pattern

Categories, Events, Boutiques, Media, Content, Contact Messages, Users use modal
popups. They are functional. If you want them converted to the page-based pattern as
well, that's a follow-up pass — the templates are in BrandForm / ProductForm and the
folder convention is `[section]/page.tsx`, `[section]/new/page.tsx`,
`[section]/[id]/page.tsx`, `[section]/[id]/edit/page.tsx`.

## Setup (unchanged)

```bash
cp .env.example .env          # edit DATABASE_URL and NEXTAUTH_SECRET
npm install
npx prisma generate
npx prisma migrate deploy     # or: npx prisma db push
npm run prisma:seed           # or: npx ts-node prisma/seed.ts
npm run dev
```

Admin login: `admin@amirigems.com` / `Admin@12345` (change in production).
