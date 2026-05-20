'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Globe, Package, Hash, Calendar } from 'lucide-react'

interface Brand {
  id: string; name: string; slug: string; type: 'JEWELLERY' | 'WATCH'
  shortDescription?: string; fullDescription?: string; logo?: string
  heroImages?: any; galleryImages?: any; status: boolean; sortOrder: number
  seoTitle?: string; seoDescription?: string; createdAt: string; updatedAt: string
  _count?: { products: number }
}
const GOLD = '#b8974a'
function parseImgs(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter(Boolean) : [] } catch { return [] }
}
export default function ViewBrandPage() {
  const { id } = useParams() as { id: string }
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`/api/brands/${id}`).then(r => r.ok ? r.json() : null).then(d => setBrand(d)).finally(() => setLoading(false))
  }, [id])
  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!brand) return <div className="p-12 text-center text-sm text-gray-400">Brand not found</div>
  const heroImages = parseImgs(brand.heroImages)
  const galleryImages = parseImgs(brand.galleryImages)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/admin/brands" className="text-gray-500 hover:text-gray-700 p-1 -ml-1"><ArrowLeft size={20} /></Link>
          <div><h1 className="text-2xl font-semibold text-gray-800">{brand.name}</h1><p className="text-sm text-gray-500 mt-0.5">/{brand.slug}</p></div>
        </div>
        <div className="flex gap-2">
          <Link href={`/brands/${brand.slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"><Globe size={14} /> View on Site</Link>
          <Link href={`/admin/brands/${brand.id}/edit`} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: GOLD }}><Pencil size={14} /> Edit</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Description</h3>
            {brand.shortDescription && <div className="mb-4"><p className="text-xs text-gray-400 mb-1">Short</p><p className="text-sm text-gray-700">{brand.shortDescription}</p></div>}
            {brand.fullDescription && <div><p className="text-xs text-gray-400 mb-1">Full</p><p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{brand.fullDescription}</p></div>}
            {!brand.shortDescription && !brand.fullDescription && <p className="text-sm text-gray-400 italic">No description provided</p>}
          </div>
          {heroImages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Hero Images ({heroImages.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{heroImages.map((img, i) => <img key={i} src={img} alt="" className="w-full h-36 object-cover rounded-lg border border-gray-100" />)}</div>
            </div>
          )}
          {galleryImages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Gallery ({galleryImages.length})</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">{galleryImages.map((img, i) => <img key={i} src={img} alt="" className="w-full h-24 object-cover rounded-lg border border-gray-100" />)}</div>
            </div>
          )}
          {(brand.seoTitle || brand.seoDescription) && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">SEO</h3>
              {brand.seoTitle && <div className="mb-3"><p className="text-xs text-gray-400 mb-1">Title</p><p className="text-sm text-gray-700">{brand.seoTitle}</p></div>}
              {brand.seoDescription && <div><p className="text-xs text-gray-400 mb-1">Description</p><p className="text-sm text-gray-700">{brand.seoDescription}</p></div>}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Logo</h3>
            <div className="bg-gray-50 rounded-xl border border-gray-100 aspect-square flex items-center justify-center overflow-hidden">
              {brand.logo ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-6" /> : <span className="text-sm text-gray-300 italic">No logo</span>}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><dt className="text-gray-500">Type</dt><dd><span className={`text-xs px-2 py-1 rounded-full ${brand.type === 'JEWELLERY' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{brand.type === 'JEWELLERY' ? 'Jewellery' : 'Watch'}</span></dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500 flex items-center gap-2"><Package size={13} /> Products</dt><dd className="font-semibold text-gray-800">{brand._count?.products ?? 0}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">Status</dt><dd><span className={`text-xs px-2 py-1 rounded-full ${brand.status ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{brand.status ? 'Active' : 'Inactive'}</span></dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">Sort Order</dt><dd className="text-gray-800">{brand.sortOrder}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">Created</dt><dd className="text-xs text-gray-800">{new Date(brand.createdAt).toLocaleDateString()}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-gray-500">Updated</dt><dd className="text-xs text-gray-800">{new Date(brand.updatedAt).toLocaleDateString()}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
