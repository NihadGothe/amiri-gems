'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductForm, { type ProductFormData } from '@/components/admin/ProductForm'

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

export default function EditProductPage() {
  const params = useParams() as { id: string }
  const [data, setData] = useState<ProductFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(async r => { if (!r.ok) { setNotFound(true); return null } return r.json() })
      .then(p => {
        if (!p) return
        let specsString = ''
        try {
          if (p.specifications) {
            const s = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications
            if (s && Object.keys(s).length > 0) specsString = JSON.stringify(s, null, 2)
          }
        } catch {}
        setData({
          id: p.id,
          name: p.name || '',
          slug: p.slug || '',
          brandId: p.brandId || '',
          categoryId: p.categoryId || '',
          type: p.type || 'JEWELLERY',
          shortDescription: p.shortDescription || '',
          fullDescription: p.fullDescription || '',
          images: parseImgs(p.images),
          price: p.price?.toString() || '',
          salePrice: p.salePrice?.toString() || '',
          sku: p.sku || '',
          stock: p.stock || 0,
          isFeatured: p.isFeatured ?? false,
          isPublished: p.isPublished ?? true,
          specifications: specsString,
        })
      })
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-500">Loading...</div>
  if (notFound || !data) return <div className="p-12 text-center text-sm text-gray-500">Product not found</div>

  return <ProductForm initial={data} isEdit />
}
