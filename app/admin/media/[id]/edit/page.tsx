'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MediaForm, { type MediaFormData } from '@/components/admin/MediaForm'

export default function EditMediaPage() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<MediaFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/media/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(m => {
        if (!m) return
        setData({
          id: m.id, title: m.title || '', slug: m.slug || '', type: m.type || 'NEWS',
          image: m.image || '', videoUrl: m.videoUrl || '', sourceUrl: m.sourceUrl || '', description: m.description || '',
          date: m.date ? new Date(m.date).toISOString().split('T')[0] : '',
          isPublished: m.isPublished ?? true,
        })
      }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!data) return <div className="p-12 text-center text-sm text-gray-400">Media not found</div>
  return <MediaForm initial={data} isEdit />
}