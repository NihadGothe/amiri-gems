'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, MapPin, Phone, Mail, MessageCircle, Clock, Globe, Navigation } from 'lucide-react'

interface Boutique {
  id: string; name: string; slug: string; city?: string; country?: string
  address?: string; phone?: string; email?: string; whatsapp?: string
  latitude?: number; longitude?: number; openingHours?: any; brands?: any
  services?: any; galleryImages?: any; isPublished: boolean
  createdAt: string; updatedAt: string
}

const GOLD = '#b8974a'

function parseJson(v: any): any {
  if (!v) return null
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return null }
}

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default function ViewBoutiquePage() {
  const { id } = useParams() as { id: string }
  const [boutique, setBoutique] = useState<Boutique | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/boutiques/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setBoutique(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!boutique) return <div className="p-12 text-center text-sm text-gray-400">Boutique not found</div>

  const hours = parseJson(boutique.openingHours)
  const brands = parseJson(boutique.brands)
  const images = parseImgs(boutique.galleryImages)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/admin/boutiques" className="text-gray-500 hover:text-gray-700 p-1 -ml-1"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{boutique.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">/boutiques/{boutique.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/boutiques/${boutique.slug}`} target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors">
            <Globe size={14} /> View on Site
          </Link>
          <Link href={`/admin/boutiques/${boutique.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: GOLD }}>
            <Pencil size={14} /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left — main info */}
        <div className="xl:col-span-2 space-y-6">

          {/* Gallery Images */}
          {images.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Boutique Images ({images.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <img key={i} src={img} alt={`${boutique.name} ${i + 1}`}
                    className="w-full h-36 object-cover rounded-lg border border-gray-100" />
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Contact Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {boutique.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Address</p>
                    <p className="text-sm text-gray-700">{boutique.address}</p>
                  </div>
                </div>
              )}
              {boutique.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                    <a href={`tel:${boutique.phone}`} className="text-sm text-gray-700 hover:text-amber-600">{boutique.phone}</a>
                  </div>
                </div>
              )}
              {boutique.email && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Email</p>
                    <a href={`mailto:${boutique.email}`} className="text-sm text-gray-700 hover:text-amber-600">{boutique.email}</a>
                  </div>
                </div>
              )}
              {boutique.whatsapp && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">WhatsApp</p>
                    <a href={`https://wa.me/${boutique.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-700 hover:text-green-600">{boutique.whatsapp}</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Opening Hours */}
          {hours && Object.keys(hours).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Clock size={14} style={{ color: GOLD }} /> Opening Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(hours).map(([day, time]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                    <span className="text-sm text-gray-500">{String(time)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Brands Available */}
          {brands && brands.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Brands Available</h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((b: string) => (
                  <span key={b} className="px-3 py-1.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">City</dt>
                <dd className="text-gray-800 font-medium">{boutique.city || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Country</dt>
                <dd className="text-gray-800">{boutique.country || '—'}</dd>
              </div>
              {boutique.latitude && boutique.longitude && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Coordinates</dt>
                  <dd className="text-gray-800 text-xs font-mono">{Number(boutique.latitude).toFixed(4)}, {Number(boutique.longitude).toFixed(4)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd><span className={`text-xs px-2 py-1 rounded-full ${boutique.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{boutique.isPublished ? 'Published' : 'Hidden'}</span></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-800 text-xs">{new Date(boutique.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Updated</dt>
                <dd className="text-gray-800 text-xs">{new Date(boutique.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {boutique.latitude && boutique.longitude && (
            <a href={`https://maps.google.com/?q=${boutique.latitude},${boutique.longitude}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded-lg border-2 text-amber-600 hover:bg-amber-50 transition-colors"
              style={{ borderColor: GOLD }}>
              <Navigation size={14} /> Open in Google Maps
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
