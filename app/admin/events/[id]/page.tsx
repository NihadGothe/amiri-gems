'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Globe, Calendar, MapPin, Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Event {
  id: string; title: string; slug: string; date: string; location?: string
  shortDescription?: string; fullDescription?: string; mainImage?: string
  galleryImages?: any; isFeatured: boolean; isPublished: boolean; isDeleted: boolean
  createdAt: string; updatedAt: string
}

const GOLD = '#b8974a'

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default function ViewEventPage() {
  const { id } = useParams() as { id: string }
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setEvent(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!event) return <div className="p-12 text-center text-sm text-gray-400">Event not found</div>

  const galleryImages = parseImgs(event.galleryImages)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/admin/events" className="text-gray-500 hover:text-gray-700 p-1 -ml-1"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{event.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">/events/{event.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/events/${event.slug}`} target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors">
            <Globe size={14} /> View on Site
          </Link>
          <Link href={`/admin/events/${event.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: GOLD }}>
            <Pencil size={14} /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          {/* Main Image */}
          {event.mainImage && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <img src={event.mainImage} alt={event.title} className="w-full h-72 object-cover" />
            </div>
          )}

          {/* Descriptions */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 pb-2 border-b border-gray-100">Description</h3>
            {event.shortDescription && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Short Description</p>
                <p className="text-sm text-gray-700">{event.shortDescription}</p>
              </div>
            )}
            {event.fullDescription && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Full Description</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
              </div>
            )}
            {!event.shortDescription && !event.fullDescription && (
              <p className="text-sm text-gray-400 italic">No description provided</p>
            )}
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Gallery ({galleryImages.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img: string, i: number) => (
                  <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg border border-gray-100" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Event Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Calendar size={14} style={{ color: GOLD }} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Date</p>
                  <p className="text-gray-800 font-medium">{formatDate(event.date)}</p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={14} style={{ color: GOLD }} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-gray-800">{event.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500">Featured</span>
                <span className={event.isFeatured ? 'text-amber-500 font-semibold' : 'text-gray-300'}>
                  {event.isFeatured ? '★ Yes' : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full ${event.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {event.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-xs text-gray-800">{new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
