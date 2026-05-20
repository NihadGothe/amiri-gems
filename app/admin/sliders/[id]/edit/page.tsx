'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import SliderForm, { type SliderFormData } from '@/components/admin/SliderForm'

export default function EditSliderPage() {
  const params = useParams() as { id: string }
  const [data, setData] = useState<SliderFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/sliders/${params.id}`)
      .then(async r => { if (!r.ok) { setNotFound(true); return null } return r.json() })
      .then(s => {
        if (!s) return
        setData({
          id: s.id,
          title: s.title || '',
          subtitle: s.subtitle || '',
          image: s.image || '',
          ctaText: s.ctaText || '',
          ctaLink: s.ctaLink || '',
          placement: s.placement || 'HOME',
          sortOrder: s.sortOrder ?? 0,
          isActive: s.isActive ?? true,
        })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-500">Loading...</div>
  if (notFound || !data) return <div className="p-12 text-center text-sm text-gray-500">Slider not found</div>

  return <SliderForm initial={data} isEdit />
}
