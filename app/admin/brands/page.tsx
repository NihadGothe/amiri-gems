'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, Search, RotateCcw } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface Brand {
  id: string; name: string; slug: string; type: 'JEWELLERY' | 'WATCH'
  logo?: string | null; status: boolean; isDeleted: boolean
  sortOrder: number; _count?: { products: number }; createdAt: string
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'
const LIMIT = 10

export default function BrandsListPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const fetchBrands = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ paginate: 'true', page: String(p), limit: String(LIMIT), deleted: showDeleted ? 'true' : 'false' })
    if (typeFilter) params.set('type', typeFilter)
    const res = await fetch(`/api/brands?${params}`)
    const data = await res.json()
    setBrands(data.brands || []); setTotal(data.total || 0); setTotalPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { setPage(1); fetchBrands(1) }, [typeFilter, showDeleted])
  useEffect(() => { fetchBrands(page) }, [page])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/brands/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: !current }),
    })
    if (res.ok) setBrands(prev => prev.map(b => b.id === id ? { ...b, status: !current } : b))
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/brands/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Brand moved to trash') : showToast('Failed to delete', 'error')
    setDeleteId(null); fetchBrands(page)
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/brands/${restoreId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted: false }),
    })
    res.ok ? showToast('Brand restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchBrands(page)
  }

  const filtered = brands.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Brands</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} brand{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/admin/brands/new"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: GOLD }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}
        >
          <Plus size={16} /> Add Brand
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold transition-all" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-gold">
          <option value="">All types</option>
          <option value="JEWELLERY">Jewellery</option>
          <option value="WATCH">Watch</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" />
          Show deleted
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : filtered.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No brands found</div>
          : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Logo','Name','Type','Products','Status','Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(brand => (
                  <tr key={brand.id} className={`hover:bg-gray-50 transition-colors ${brand.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden">
                        {brand.logo
                          ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
                          : <span className="text-xs text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{brand.name}</p>
                      <p className="text-xs text-gray-400">/{brand.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${brand.type === 'JEWELLERY' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                        {brand.type === 'JEWELLERY' ? 'Jewellery' : 'Watch'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{brand._count?.products ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(brand.id, brand.status)}
                          disabled={togglingId === brand.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${togglingId === brand.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          style={{ backgroundColor: brand.status ? GOLD : '#d1d5db' }}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${brand.status ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{brand.status ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {brand.isDeleted ? (
                          <button onClick={() => setRestoreId(brand.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors">
                            <RotateCcw size={12} /> Restore
                          </button>
                        ) : (
                          <>
                            <Link href={`/admin/brands/${brand.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-gold hover:text-gold transition-colors">
                              <Eye size={12} /> View
                            </Link>
                            <Link href={`/admin/brands/${brand.id}/edit`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                              style={{ backgroundColor: GOLD }}
                              onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
                              onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
                              <Pencil size={12} /> Edit
                            </Link>
                            <button onClick={() => setDeleteId(brand.id)}
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
      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="This brand will be soft deleted. You can restore it later." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore Brand" message="Restore this brand?" onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
