// app/(public)/heritage/page.tsx
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Heritage',
  description: 'Discover the story of Amiri Gems — a legacy of luxury jewellery and fine watches since 1994.',
}

// Fetch ALL content blocks at once, key them by slug
async function getBlocks() {
  const rows = await prisma.contentBlock.findMany()
  return Object.fromEntries(rows.map(r => [r.key, r]))
}

function parseMetadata(v: any): Record<string, string> {
  if (!v) return {}
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return {} }
}

// Split multi-paragraph content stored as \n\n
function Paragraphs({ text }: { text: string }) {
  const paras = text.split('\n\n').map(p => p.trim()).filter(Boolean)
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  )
}

export default async function HeritagePage() {
  const blocks = await getBlocks()

  const heroBlock = blocks['heritage_hero_image']
  const heritageBlock = blocks['heritage_intro']
  const chairmanBlock = blocks['chairman_name']
  const ceoBlock = blocks['ceo_name']

  const chairmanMeta = parseMetadata(chairmanBlock?.metadata)
  const ceoMeta = parseMetadata(ceoBlock?.metadata)

  // Fallback values so page never crashes if a block is missing
  const heroImage = heroBlock?.image || '/images/sliders/shutterstock-1172392699.jpg'
  const heritageTitle = heritageBlock?.title || 'Heritage'
  const heritageText = heritageBlock?.content || ''
  const heritageImage = heritageBlock?.image || '/images/sliders/dsc-0143-s.jpg'

  const chairmanName = chairmanBlock?.title || 'Sheikh Nawaf Bin Nasser Bin Khaled Al Thani'
  const chairmanRole = chairmanMeta.role || 'Chairman — Amiri Gems'
  const chairmanText = chairmanBlock?.content || ''
  const chairmanImage = chairmanBlock?.image || '/images/founder/sheikh-nawaf.jpg'

  const ceoName = ceoBlock?.title || 'Gope Shahani'
  const ceoRole = ceoMeta.role || 'CEO — Amiri Gems'
  const ceoText = ceoBlock?.content || ''
  const ceoImage = ceoBlock?.image || '/images/founder/gope-shahani.jpg'

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: '50vh', minHeight: 360 }}>
        <img
          src={heroImage}
          alt="Amiri Gems Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="luxury-label text-xs text-gold-light mb-3">Since 1994</p>
          <h1 className="font-serif text-white text-5xl md:text-7xl font-light tracking-widest uppercase">
            Heritage
          </h1>
        </div>
      </div>

      {/* ── Heritage Story ────────────────────────────────────────────────── */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <img
              src={heritageImage}
              alt="Amiri Gems Boutique"
              className="w-full shadow-xl object-cover"
              style={{ height: 480 }}
            />
          </div>
          <div className="pt-4">
            <h2 className="font-serif text-gray-800 text-3xl font-light mb-2 tracking-wide">
              {heritageTitle}
            </h2>
            <div className="w-10 h-px bg-gold mb-6" />
            <div className="text-sm text-gray-600 font-sans leading-loose space-y-4">
              <Paragraphs text={heritageText} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Chairman ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center font-serif text-3xl text-gray-800 tracking-wider uppercase mb-1">
            {chairmanName}
          </h2>
          <p className="text-center luxury-label text-xs text-gold mb-12">{chairmanRole}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="text-sm text-gray-600 font-sans leading-loose space-y-4">
              <Paragraphs text={chairmanText} />
            </div>
            <div>
              <img
                src={chairmanImage}
                alt={chairmanName}
                className="w-full shadow-xl object-cover object-top"
                style={{ height: 480 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CEO ───────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center font-serif text-3xl text-gray-800 tracking-wider uppercase mb-1">
            {ceoName}
          </h2>
          <p className="text-center luxury-label text-xs text-gold mb-12">{ceoRole}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <img
                src={ceoImage}
                alt={ceoName}
                className="w-full shadow-xl object-cover object-top"
                style={{ height: 480 }}
              />
            </div>
            <div className="text-sm text-gray-600 font-sans leading-loose space-y-4 pt-4">
              <Paragraphs text={ceoText} />
            </div>
          </div>
        </div>
      </section>

{/* ── Leadership Team ───────────────────────────────────────────── */}
<section className="py-20 bg-cream">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-14">
      <p className="luxury-label text-xs text-gold mb-3 tracking-widest">
        Leadership
      </p>
      <h2 className="font-serif text-4xl text-gray-800 font-light tracking-widest uppercase">
        The Leadership Team
      </h2>
      <div className="w-10 h-px bg-gold mx-auto mt-4" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* Elder */}
      <div className="text-center group">
        <div className="overflow-hidden bg-white shadow-lg">
          <img
            src="/images/founder/PGS.jpg"
            alt="PGS"
            className="w-full h-[420px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="pt-6">
          <h3 className="font-serif text-2xl text-gray-800 tracking-wide uppercase">
            PUNEET G SHAHNI
          </h3>

          <p className="luxury-label text-xs text-gold tracking-widest mt-2">
            Director
          </p>
        </div>
      </div>

      {/* SGS */}
      <div className="text-center group">
        <div className="overflow-hidden bg-white shadow-lg">
          <img
            src="/images/founder/SGS.jpg"
            alt="SGS"
            className="w-full h-[420px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="pt-6">
          <h3 className="font-serif text-2xl text-gray-800 tracking-wide uppercase">
            SIDDARTH G SHAHANI
          </h3>

          <p className="luxury-label text-xs text-gold tracking-widest mt-2">
            Director
          </p>
        </div>
      </div>

      {/* AGS */}
      <div className="text-center group">
        <div className="overflow-hidden bg-white shadow-lg">
          <img
            src="/images/founder/AGS.jpg"
            alt="AGS"
            className="w-full h-[420px] object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="pt-6">
          <h3 className="font-serif text-2xl text-gray-800 tracking-wide uppercase">
            AMAN G SHAHANI
          </h3>

          <p className="luxury-label text-xs text-gold tracking-widest mt-2">
            Director
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="luxury-label text-xs text-gold mb-4">A Legacy of Excellence</p>
          <h2 className="font-serif text-white text-4xl font-light mb-12">Our Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { year: '1994', desc: 'Amiri Gems founded by Sheikh Nawaf Bin Nasser Al Thani in Doha, Qatar.' },
              { year: '2000', desc: 'Expansion of portfolio to include prestigious international jewellery and watch brands.' },
              { year: 'Today', desc: 'Four boutique locations across Qatar and Oman, serving discerning clientele with the finest jewellery and watches.' },
            ].map(item => (
              <div key={item.year} className="flex flex-col items-center">
                <span className="font-serif text-gold text-3xl font-light mb-3">{item.year}</span>
                <div className="w-px h-8 bg-gold/30 mb-3" />
                <p className="text-sm text-white/70 font-sans leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
