// app/public/boutiques/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const b = await prisma.boutique.findUnique({ where: { slug: params.slug } })
  return { title: b?.name || 'Boutique', description: b?.address || '' }
}

export default async function BoutiqueDetailPage({ params }: { params: { slug: string } }) {
  const boutique = await prisma.boutique.findUnique({ where: { slug: params.slug } })
  if (!boutique || !boutique.isPublished) notFound()

  const hours: Record<string, string> = (() => { try { return JSON.parse(boutique.openingHours as string || '{}') } catch { return {} } })()
  const brands: string[] = (() => { try { return JSON.parse(boutique.brands as string || '[]') } catch { return [] } })()
  const services: string[] = (() => { try { return JSON.parse(boutique.services as string || '[]') } catch { return [] } })()
  const gallery: string[] = (() => { try { return JSON.parse(boutique.galleryImages as string || '[]') } catch { return [] } })()

  return (
    <>
      {/* Hero */}
      <div className="relative w-full" style={{ height: '40vh', minHeight: 260 }}>
        <img
          src={gallery[0] || '/images/sliders/dsc-0143-s.jpg'}
          alt={boutique.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="luxury-label text-xs text-gold mb-3">{boutique.city}, {boutique.country}</p>
          <h1 className="font-serif text-white text-4xl md:text-5xl font-light">{boutique.name}</h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 py-4">
        <Link href="/boutiques" className="flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-gold transition-colors">
          <ArrowLeft size={12} /> Back to Boutiques
        </Link>
      </div>

      <section className="pb-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Address */}
              <div className="border border-gray-100 p-5">
                <h3 className="luxury-label text-xs text-gray-500 mb-4">Address</h3>
                <div className="space-y-2">
                  {boutique.address && (
                    <div className="flex items-start gap-2">
                      <MapPin size={13} className="text-gold mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-sans text-gray-700 leading-relaxed">{boutique.address}</p>
                    </div>
                  )}
                  {boutique.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-gold flex-shrink-0" />
                      <a href={`tel:${boutique.phone}`} className="text-sm font-sans text-gray-700 hover:text-gold transition-colors">{boutique.phone}</a>
                    </div>
                  )}
                  {boutique.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-gold flex-shrink-0" />
                      <a href={`mailto:${boutique.email}`} className="text-sm font-sans text-gray-700 hover:text-gold transition-colors">{boutique.email}</a>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  {boutique.latitude && boutique.longitude && (
                    <a href={`https://maps.google.com/?q=${boutique.latitude},${boutique.longitude}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-sans text-gold hover:text-gold-dark transition-colors">
                      <Navigation size={12} /> Get Directions
                    </a>
                  )}
                  {boutique.whatsapp && (
                    <a href={`https://wa.me/${boutique.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-sans text-green-600 hover:text-green-700 transition-colors">
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Hours */}
              {Object.keys(hours).length > 0 && (
                <div className="border border-gray-100 p-5">
                  <h3 className="luxury-label text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                    <Clock size={12} /> Opening Hours
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(hours).map(([day, time]) => (
                      <div key={day} className="flex items-start justify-between gap-2">
                        <span className="text-xs font-sans text-gray-600">{day}</span>
                        <span className="text-xs font-sans text-gray-800 font-medium text-right">{String(time)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div>
                <h3 className="font-serif text-gray-800 text-xl font-light mb-5">Brands Available</h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand: string) => (
                    <span key={brand} className="px-3 py-1.5 border border-gray-200 text-xs font-sans text-gray-700 hover:border-gold hover:text-gold transition-colors">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {services.length > 0 && (
              <div>
                <h3 className="font-serif text-gray-800 text-xl font-light mb-5">Services</h3>
                <div className="grid grid-cols-2 gap-2">
                  {services.map((service: string) => (
                    <div key={service} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      <span className="text-sm font-sans text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-4">
            <Link href="/contact" className="btn-luxury block text-center">Contact This Boutique</Link>
            {boutique.whatsapp && (
              <a href={`https://wa.me/${boutique.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-3 text-xs font-sans font-semibold tracking-widest uppercase transition-colors">
                <MessageCircle size={15} /> WhatsApp
              </a>
            )}
            {boutique.latitude && boutique.longitude && (
              <a href={`https://maps.google.com/?q=${boutique.latitude},${boutique.longitude}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full border border-gray-300 hover:border-gold text-gray-700 hover:text-gold py-3 text-xs font-sans font-semibold tracking-widest uppercase transition-colors">
                <Navigation size={15} /> Get Directions
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-heading gold-underline pb-2">Gallery</h2>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {gallery.map((img, i) => (
                <div key={i} className="overflow-hidden" style={{ paddingTop: '75%', position: 'relative' }}>
                  <img src={img} alt={`${boutique.name} ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
