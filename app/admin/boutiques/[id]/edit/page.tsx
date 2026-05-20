'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BoutiqueForm, { type BoutiqueFormData } from '@/components/admin/BoutiqueForm'

export default function EditBoutiquePage() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<BoutiqueFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/boutiques/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(b => {
        if (!b) return
        setData({
          id: b.id, name: b.name || '', slug: b.slug || '',
          city: b.city || '', country: b.country || 'Qatar',
          address: b.address || '', phone: b.phone || '',
          email: b.email || '', whatsapp: b.whatsapp || '',
          latitude: b.latitude?.toString() || '', longitude: b.longitude?.toString() || '',
          openingHours: typeof b.openingHours === 'object' ? JSON.stringify(b.openingHours, null, 2) : (b.openingHours || '{}'),
          brands: typeof b.brands === 'object' ? JSON.stringify(b.brands) : (b.brands || '[]'),
          services: typeof b.services === 'object' ? JSON.stringify(b.services) : (b.services || '[]'),
          galleryImages: (() => { try { const g = b.galleryImages; return Array.isArray(g) ? g : JSON.parse(g || '[]') } catch { return [] } })(),
          sortOrder: b.sortOrder ?? 0,
          isPublished: b.isPublished ?? true,
        })
      }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!data) return <div className="p-12 text-center text-sm text-gray-400">Boutique not found</div>
  return <BoutiqueForm initial={data} isEdit />
}
