'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Tag, Hash, Calendar } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  type: 'JEWELLERY' | 'WATCH'
  shortDescription?: string
  fullDescription?: string
  images?: string
  price?: any
  salePrice?: any
  sku?: string
  stock?: number
  specifications?: string
  isFeatured: boolean
  isPublished: boolean
  brand: { name: string; slug: string }
  category?: { name: string; slug: string }
  createdAt: string
  updatedAt: string
}

function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [] } catch { return [] }
}

function parseSpecs(v: any): Record<string, any> {
  if (!v) return {}
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return {} }
}

export default function ViewProductPage() {
  const params = useParams() as { id: string }
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setProduct(d))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-500">Loading...</div>
  if (!product) return <div className="p-12 text-center text-sm text-gray-500">Product not found</div>

  const images = parseImgs(product.images)
  const specs = parseSpecs(product.specifications)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-gray-500 hover:text-gold p-1 -ml-1">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-xl font-sans font-semibold text-gray-800">{product.name}</h2>
            <p className="text-sm text-gray-500">/{product.slug}</p>
          </div>
        </div>
        <Link href={`/admin/products/${product.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: "#b8974a" }}>
          <Pencil size={14} /> Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {images.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Images ({images.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded border border-gray-100" />
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Description</h3>
            <div className="space-y-3 text-sm">
              {product.shortDescription && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Short</p>
                  <p className="text-gray-700">{product.shortDescription}</p>
                </div>
              )}
              {product.fullDescription && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Full</p>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{product.fullDescription}</p>
                </div>
              )}
              {!product.shortDescription && !product.fullDescription && (
                <p className="text-gray-400 italic">No description provided</p>
              )}
            </div>
          </div>

          {Object.keys(specs).length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Specifications</h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-gray-100 py-1">
                    <dt className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                    <dd className="text-gray-800">{String(val)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 flex items-center gap-2"><Hash size={14} /> Type</dt>
                <dd>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.type === 'JEWELLERY' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                    {product.type === 'JEWELLERY' ? 'Jewellery' : 'Watch'}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 flex items-center gap-2"><Tag size={14} /> Brand</dt>
                <dd className="text-gray-800 font-medium">{product.brand?.name}</dd>
              </div>
              {product.category && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Category</dt>
                  <dd className="text-gray-800">{product.category.name}</dd>
                </div>
              )}
              {product.sku && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">SKU</dt>
                  <dd className="text-gray-800 font-mono text-xs">{product.sku}</dd>
                </div>
              )}
              {product.price && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Price</dt>
                  <dd className="text-gray-800 font-medium">QAR {product.price}</dd>
                </div>
              )}
              {product.salePrice && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500">Sale price</dt>
                  <dd className="text-rose-600 font-medium">QAR {product.salePrice}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Stock</dt>
                <dd className="text-gray-800">{product.stock ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Featured</dt>
                <dd className={product.isFeatured ? 'text-amber-500 font-semibold' : 'text-gray-400'}>
                  {product.isFeatured ? '★ Yes' : 'No'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd>
                  <span className={product.isPublished ? 'text-xs px-2 py-1 rounded-full bg-green-50 text-green-600' : 'text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500'}>
                    {product.isPublished ? 'Published' : 'Draft'}
                  </span>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Created</dt>
                <dd className="text-gray-800 text-xs">{new Date(product.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          <Link href={`/products/${product.slug}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded-lg border-2 text-amber-600 hover:bg-amber-50 transition-colors" style={{ borderColor: "#b8974a" }}>
            View on Site →
          </Link>
        </div>
      </div>
    </div>
  )
}
