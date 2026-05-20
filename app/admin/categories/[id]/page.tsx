'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Globe, Tag, Hash } from 'lucide-react'

interface Category {
  id: string; name: string; slug: string; description?: string
  bannerImage?: string; status: boolean; sortOrder: number; isDeleted: boolean
  createdAt: string; updatedAt: string; _count?: { products: number }
}

const GOLD = '#b8974a'

export default function ViewCategoryPage() {
  const { id } = useParams() as { id: string }
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setCategory(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!category) return <div className="p-12 text-center text-sm text-gray-400">Category not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/admin/categories" className="text-gray-500 hover:text-gray-700 p-1 -ml-1"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{category.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">/jewellery/{category.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/jewellery/${category.slug}`} target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors">
            <Globe size={14} /> View on Site
          </Link>
          <Link href={`/admin/categories/${category.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: GOLD }}>
            <Pencil size={14} /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          {/* Banner Image */}
          {category.bannerImage && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Banner Image</h3>
              <img src={category.bannerImage} alt={category.name}
                className="w-full h-64 object-cover rounded-lg border border-gray-100" />
              <p className="text-xs text-gray-400 mt-2">Shown on homepage jewellery section and category page hero</p>
            </div>
          )}

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Description</h3>
            {category.description ? (
              <p className="text-sm text-gray-700 leading-relaxed">{category.description}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No description provided</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 flex items-center gap-2"><Tag size={13} /> Products</dt>
                <dd className="text-gray-800 font-semibold">{category._count?.products ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 flex items-center gap-2"><Hash size={13} /> Sort Order</dt>
                <dd className="text-gray-800">{category.sortOrder}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Status</dt>
                <dd><span className={`text-xs px-2 py-1 rounded-full ${category.status ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{category.status ? 'Active' : 'Inactive'}</span></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-xs text-gray-800">{new Date(category.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Updated</dt>
                <dd className="text-xs text-gray-800">{new Date(category.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {!category.bannerImage && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs text-amber-700 font-medium mb-1">No banner image</p>
              <p className="text-xs text-amber-600">Add a banner image so this category shows on the homepage jewellery section.</p>
              <Link href={`/admin/categories/${category.id}/edit`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-900">
                <Pencil size={11} /> Upload Image →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
