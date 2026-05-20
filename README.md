# 🏆 Amiri Gems — Full-Stack Next.js Website

**The Home of Luxury Diamonds and Watches**  
Complete Next.js 14 project with public website, admin panel, MySQL database, authentication, and image uploads.

---

## 🚀 Quick Start

### Step 1 — Prerequisites

- Node.js 18+ installed
- phpMyAdmin / MySQL running (XAMPP, WAMP, or MySQL server)
- Git (optional)

---

### Step 2 — Create MySQL Database

1. Open **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Click **New** → Database name: `amiri_gems` → Collation: `utf8mb4_unicode_ci` → **Create**

---

### Step 3 — Environment Setup

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` and set your database URL:

```env
# For XAMPP (no password):
DATABASE_URL="mysql://root:@localhost:3306/amiri_gems"

# For WAMP or if you have a MySQL password:
DATABASE_URL="mysql://root:yourpassword@localhost:3306/amiri_gems"

# Generate a secure secret (run in terminal):
# openssl rand -base64 32
NEXTAUTH_SECRET="paste-your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

---

### Step 4 — Install & Setup

```bash
# Install all dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# Seed database with brands, events, boutiques, admin user
npx prisma db seed
```

---

### Step 5 — Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` — website is live! 🎉

---

## 🔐 Admin Panel

**URL:** `http://localhost:3000/admin`  
**Login:** `http://localhost:3000/admin/login`

| Field    | Value                     |
|----------|---------------------------|
| Email    | `admin@amirigems.com`     |
| Password | `Admin@12345`             |

> ⚠️ **IMPORTANT:** Change the admin password before going live!  
> Go to `/admin/users` → Edit admin → Set new password

---

## 📁 Project Structure

```
amiri-gems/
├── app/
│   ├── (public pages)
│   │   ├── home/page.tsx          → Homepage
│   │   ├── public/heritage/       → Heritage page
│   │   ├── public/jewellery/      → Jewellery + categories
│   │   ├── public/brands/[slug]/  → Brand pages
│   │   ├── public/watches/        → Watches
│   │   ├── public/events/         → Events
│   │   ├── public/boutiques/      → Boutique locator
│   │   ├── public/media/          → Media page
│   │   └── public/contact/        → Contact page
│   ├── admin/                     → Full admin panel
│   │   ├── login/                 → Admin login
│   │   ├── brands/                → Brands CRUD
│   │   ├── products/              → Products CRUD
│   │   ├── categories/            → Categories CRUD
│   │   ├── events/                → Events CRUD
│   │   ├── boutiques/             → Boutiques CRUD
│   │   ├── sliders/               → Hero sliders
│   │   ├── media/                 → Media management
│   │   ├── content/               → Page content
│   │   ├── contact-messages/      → Contact inbox
│   │   └── users/                 → Admin users
│   └── api/                       → All API routes
├── components/
│   ├── public/
│   │   ├── Header.tsx             → Luxury header + nav
│   │   ├── Footer.tsx             → Taupe footer
│   │   ├── SearchModal.tsx        → Global search
│   │   └── BoutiqueMap.tsx        → Leaflet.js map
│   ├── admin/
│   │   ├── AdminSidebar.tsx       → Admin navigation
│   │   ├── AdminTopbar.tsx        → Admin header
│   │   ├── ImageUpload.tsx        → Upload component
│   │   ├── ConfirmModal.tsx       → Delete confirmation
│   │   └── Toast.tsx              → Notifications
│   └── providers.tsx              → NextAuth provider
├── lib/
│   ├── prisma.ts                  → Database client
│   ├── auth.ts                    → NextAuth config
│   ├── upload.ts                  → Upload utilities
│   ├── utils.ts                   → Helper functions
│   └── validations.ts             → Zod schemas
├── prisma/
│   ├── schema.prisma              → Database models
│   └── seed.ts                    → Initial data
├── public/
│   ├── uploads/                   → Uploaded files
│   └── images/                    → Static images
├── .env.example                   → Environment template
├── tailwind.config.ts             → Design tokens
└── next.config.js                 → Next.js config
```

---

## 🖼️ How to Upload Images

### Via Admin Panel:
1. Go to `/admin/brands` → Add/Edit a brand
2. Click the upload area or drag an image
3. Image uploads to `/public/uploads/images/brands/`
4. URL is saved automatically

### Manual Upload:
Place images in these folders:
```
/public/images/brands/      → Brand logos & hero images
/public/images/products/    → Product photos
/public/images/events/      → Event images
/public/images/boutiques/   → Boutique photos
/public/images/sliders/     → Hero slider images
/public/images/founders/    → Chairman/CEO photos
```

---

## 📋 Admin Panel Guide

### Adding a Brand
1. Go to `/admin/brands` → **Add Brand**
2. Fill: Name, Slug (auto-generated), Type (Jewellery/Watch)
3. Add description, upload logo and hero images
4. Toggle **Active** → **Create Brand**
5. Brand appears on `/jewellery` or `/watches` page
6. Brand page auto-created at `/brands/[slug]`

### Adding Products
1. Go to `/admin/products` → **Add Product**
2. Select brand and category
3. Upload product images (multiple supported)
4. Add price/SKU (optional — for future e-commerce)
5. Toggle **Featured** to show on homepage
6. Toggle **Published** → **Create Product**

### Adding Events
1. Go to `/admin/events` → **Add Event**
2. Fill title, date, location, description
3. Upload main image and gallery
4. Toggle **Featured** for homepage preview
5. Event page auto-created at `/events/[slug]`

### Managing Boutiques
1. Go to `/admin/boutiques` → **Add Boutique**
2. Add name, address, phone, email
3. Add latitude/longitude for map pin
   - Get coordinates from Google Maps → right-click → copy coordinates
4. Add opening hours as JSON:
   ```json
   {"Saturday - Thursday": "10:00 AM – 10:00 PM", "Friday": "2:00 PM – 10:00 PM"}
   ```
5. Add brands and services as JSON arrays:
   ```json
   ["ADLER", "CHATILA", "H. MOSER & CIE"]
   ```

### Hero Sliders
1. Go to `/admin/sliders`
2. Select page placement (HOME, JEWELLERY, WATCHES, etc.)
3. Upload slide image, add title/subtitle
4. Add CTA button text and link
5. Set sort order (lower = first)

### Editing Page Content
1. Go to `/admin/content`
2. Edit Heritage text, Chairman bio, CEO bio, footer text
3. Update contact information and social links
4. Click **Save Changes** per section

---

## 🗄️ Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Re-run seed only
npx prisma db seed

# Push schema changes without migration
npx prisma db push
```

---

## 🏗️ Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

---

## 🔮 Future E-Commerce Upgrade

The database is already structured for e-commerce. When ready:

1. **Products** already have: `price`, `salePrice`, `sku`, `stock` fields
2. Add these models to schema:
   - `Cart`, `CartItem`
   - `Order`, `OrderItem`
   - `Customer`
   - `Payment`
3. Integrate Qatar payment gateway (QPay, KNET, Tap Payments)
4. Or add Stripe/PayPal for international payments
5. Enable product listing pages with cart functionality

---

## 🎨 Design Tokens

The website uses these Amiri Gems brand colors:

| Token | Value | Usage |
|-------|-------|-------|
| `gold` | `#B8974A` | Buttons, accents, headings |
| `gold-light` | `#D4B468` | Hover states |
| `taupe` | `#8B7B6B` | Footer background |
| `navy` | `#1A2744` | Dark sections |
| `cream` | `#FAF8F5` | Section backgrounds |

Fonts: **Cormorant Garamond** (serif/headings) + **Montserrat** (sans/body)

---

## 🌍 Public Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/heritage` | Heritage & leadership |
| `/jewellery` | Jewellery overview |
| `/jewellery/high-jewellery` | High Jewellery |
| `/jewellery/rings` | Rings |
| `/jewellery/earrings` | Earrings |
| `/jewellery/engagement` | Engagement |
| `/jewellery/gifts` | Gifts |
| `/brands/[slug]` | Brand detail page |
| `/watches` | Watches overview |
| `/watches/h-moser-cie` | H. Moser & Cie |
| `/watches/hautlence` | Hautlence |
| `/events` | All events |
| `/events/[slug]` | Event detail |
| `/boutiques` | Boutique locator map |
| `/boutiques/[slug]` | Boutique detail |
| `/media` | Media & press |
| `/contact` | Contact form |

---

## 🛡️ Admin Routes

| Route | Section |
|-------|---------|
| `/admin` | Dashboard |
| `/admin/login` | Admin login |
| `/admin/brands` | Brands management |
| `/admin/products` | Products management |
| `/admin/categories` | Categories |
| `/admin/events` | Events |
| `/admin/boutiques` | Boutiques |
| `/admin/sliders` | Hero sliders |
| `/admin/media` | Media |
| `/admin/content` | Page content |
| `/admin/contact-messages` | Contact inbox |
| `/admin/users` | Admin users |

---

## 📞 Support

For setup issues, contact your development team or refer to:
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
