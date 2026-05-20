'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EventForm, { type EventFormData } from '@/components/admin/EventForm'

export default function EditEventPage() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<EventFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(e => {
        if (!e) return
        setData({
          id: e.id, title: e.title || '', slug: e.slug || '',
          date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
          location: e.location || '', shortDescription: e.shortDescription || '',
          fullDescription: e.fullDescription || '', mainImage: e.mainImage || '',
          galleryImages: (() => { try { const g = e.galleryImages; return Array.isArray(g) ? g : JSON.parse(g || '[]') } catch { return [] } })(),
          isFeatured: e.isFeatured ?? false, isPublished: e.isPublished ?? true,
        })
      }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!data) return <div className="p-12 text-center text-sm text-gray-400">Event not found</div>
  return <EventForm initial={data} isEdit />
}
