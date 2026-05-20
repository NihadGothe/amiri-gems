'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CategoryForm, { type CategoryFormData } from '@/components/admin/CategoryForm'

export default function EditCategoryPage() {
  const params = useParams() as { id: string }
  const [data, setData] = useState<CategoryFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/categories/${params.id}`)
      .then(async r => {
        if (!r.ok) { setNotFound(true); return null }
        return r.json()
      })
      .then(c => {
        if (!c) return
        setData({
          id: c.id,
          name: c.name || '',
          slug: c.slug || '',
          description: c.description || '',
          bannerImage: c.bannerImage || '',
          status: c.status ?? true,
          sortOrder: c.sortOrder ?? 0,
        })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (notFound || !data) return <div className="p-12 text-center text-sm text-gray-400">Category not found</div>

  return <CategoryForm initial={data} isEdit />
}
