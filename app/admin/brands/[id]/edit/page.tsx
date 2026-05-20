'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BrandForm, { type BrandFormData } from '@/components/admin/BrandForm'

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default function EditBrandPage() {
  const params = useParams() as { id: string }
  const [data, setData] = useState<BrandFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/brands/${params.id}`)
      .then(async r => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then(b => {
        if (!b) return
        setData({
          id: b.id,
          name: b.name || '',
          slug: b.slug || '',
          type: b.type || 'JEWELLERY',
          shortDescription: b.shortDescription || '',
          fullDescription: b.fullDescription || '',
          logo: b.logo || '',           // null → ''
          status: b.status ?? true,
          sortOrder: b.sortOrder ?? 0,
          seoTitle: b.seoTitle || '',
          seoDescription: b.seoDescription || '',
          heroImages: parseImgs(b.heroImages),
          galleryImages: parseImgs(b.galleryImages),
        })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-500">Loading...</div>
  if (notFound || !data) return <div className="p-12 text-center text-sm text-gray-500">Brand not found</div>

  return <BrandForm initial={data} isEdit />
}
