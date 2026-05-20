'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, Search, RotateCcw, Star } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface Product {
  id: string; name: string; slug: string; type: string
  images?: string; isFeatured: boolean; isPublished: boolean; isDeleted: boolean
  brand: { name: string }; category?: { name: string }
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'
const LIMIT = 10

function firstImage(v: any): string {
  if (!v) return ''
  if (Array.isArray(v)) return v[0] || ''
  try { const p = JSON.parse(v); return Array.isArray(p) ? p[0] || '' : '' } catch { return '' }
}

export default function ProductsListPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState(searchParams.get('featured') === 'true')
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT), deleted: showDeleted ? 'true' : 'false' })
    if (typeFilter) params.set('type', typeFilter)
    if (featuredFilter) params.set('featured', 'true')
    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()
    setProducts(data.products || []); setTotal(data.total || 0); setTotalPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { setPage(1); fetchProducts(1) }, [typeFilter, showDeleted, featuredFilter])
  useEffect(() => { fetchProducts(page) }, [page])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !current }),
    })
    if (res.ok) setProducts(prev => prev.map(p => p.id === id ? { ...p, isPublished: !current } : p))
    setTogglingId(null)
  }

  const handleFeaturedToggle = async (id: string, current: boolean) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    })
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !current } : p))
      showToast(!current ? 'Added to featured' : 'Removed from featured')
    } else {
      showToast('Failed to update', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Product moved to trash') : showToast('Failed', 'error')
    setDeleteId(null); fetchProducts(page)
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/products/${restoreId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted: false }),
    })
    res.ok ? showToast('Product restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchProducts(page)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} product{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/products/new"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: GOLD }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-all" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-gold">
          <option value="">All types</option>
          <option value="JEWELLERY">Jewellery</option>
          <option value="WATCH">Watch</option>
        </select>
        <button onClick={() => setFeaturedFilter(f => !f)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${featuredFilter ? 'border-amber-400 bg-amber-50 text-amber-700 font-medium' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
          <Star size={14} className={featuredFilter ? 'fill-amber-400 text-amber-400' : ''} />
          Featured only
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" />
          Show deleted
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : filtered.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No products found</div>
          : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Image','Name','Brand','Category','Type','Featured','Published','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${product.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 overflow-hidden">
                        {firstImage(product.images)
                          ? <img src={firstImage(product.images)} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">—</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">/{product.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.brand?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${product.type === 'JEWELLERY' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                        {product.type === 'JEWELLERY' ? 'Jewellery' : 'Watch'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {/* Featured star toggle */}
                      <button
                        onClick={() => handleFeaturedToggle(product.id, product.isFeatured)}
                        title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                        className={`text-xl transition-colors ${product.isFeatured ? 'text-amber-400 hover:text-amber-300' : 'text-gray-200 hover:text-amber-300'}`}
                      >
                        ★
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(product.id, product.isPublished)}
                          disabled={togglingId === product.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${togglingId === product.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          style={{ backgroundColor: product.isPublished ? GOLD : '#d1d5db' }}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${product.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{product.isPublished ? 'Published' : 'Draft'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {product.isDeleted ? (
                          <button onClick={() => setRestoreId(product.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors">
                            <RotateCcw size={12} /> Restore
                          </button>
                        ) : (
                          <>
                            <Link href={`/admin/products/${product.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-gold hover:text-gold transition-colors">
                              <Eye size={12} /> View
                            </Link>
                            <Link href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                              style={{ backgroundColor: GOLD }}
                              onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
                              onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
                              <Pencil size={12} /> Edit
                            </Link>
                            <button onClick={() => setDeleteId(product.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={12} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="Product will be soft deleted. You can restore it later." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore Product" message="Restore this product?" onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}