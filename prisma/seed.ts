// prisma/seed.ts
// ─────────────────────────────────────────────────────────────────────────────
// Safe seed — only creates admin user and default content blocks.
// Brands, Categories, Products, Events, Boutiques are managed from Admin Panel.
// ─────────────────────────────────────────────────────────────────────────────
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting safe seed...')

  // ─── Admin User ───────────────────────────────────────────────────────────
  // update: {} means existing admin password/data is NEVER overwritten
  const hashedPassword = await bcrypt.hash('Admin@12345', 12)
  await prisma.user.upsert({
    where: { email: 'admin@amirigems.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@amirigems.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin user ready')

  // ─── Default Content Blocks ───────────────────────────────────────────────
  // update: {} means existing real content is NEVER overwritten
  const contentBlocks = [
    { key: 'home_jewellery_image', title: 'Home — Jewellery Section Image', content: 'Image shown in the Jewellery card on the homepage', image: '/images/jewellery/DSC_0520.jpg' },
    { key: 'home_watches_image', title: 'Home — Watches Section Image', content: 'Image shown in the Watches card on the homepage', image: '/images/watches/hmoser-6500-1200-streamliner-small-seconds-st-aquablue-sdt-w.jpg' },
    { key: 'heritage_hero_image', title: 'Heritage Hero Image', content: 'Hero banner shown at the top of the Heritage page.', image: '/images/sliders/shutterstock-1172392699.jpg' },
    { key: 'heritage_intro', title: 'Heritage', content: 'Edit from Admin → Page Content.', image: '/images/sliders/dsc-0143-s.jpg' },
    { key: 'chairman_name', title: 'Sheikh Nawaf Bin Nasser Bin Khaled Al Thani', content: 'Edit from Admin → Page Content.', image: '/images/founder/sheikh-nawaf.jpg', metadata: JSON.stringify({ role: 'Chairman — Amiri Gems' }) },
    { key: 'ceo_name', title: 'Gope Shahani', content: 'Edit from Admin → Page Content.', image: '/images/founder/gope-shahani.jpg', metadata: JSON.stringify({ role: 'CEO — Amiri Gems' }) },
    { key: 'footer_description', title: 'Amiri Gems', content: 'Amiri Gems jewellery is crafted to meet uncompromising quality standards.' },
    { key: 'contact_address', title: 'Main Address', content: 'Barwa Al Sadd, Suhaim Bin Hamad Street, P.O. Box 376, Doha - Qatar', metadata: JSON.stringify({ phone1: '+974 4452 0000', phone2: '+974 4452 0014', fax: '+974 4444 3607', email: 'info@amirigems.net', pinterest: 'https://pinterest.com/amirigems', instagram: 'https://instagram.com/amirigems', facebook: 'https://facebook.com/amirigems' }) },
  ]

  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      update: {},
      create: block,
    })
  }
  console.log('✅ Content blocks ready')

  console.log('\n🎉 Safe seed completed!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin: admin@amirigems.com / Admin@12345')
  console.log('NOTE: Brands, Categories, Products, Events')
  console.log('and Boutiques are managed from Admin Panel.')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })