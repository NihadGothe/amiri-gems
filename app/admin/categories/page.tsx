'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, RotateCcw, Eye } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface Category {
  id: string; name: string; slug: string
  description?: string; bannerImage?: string
  status: boolean; isDeleted: boolean; sortOrder: number
  _count?: { products: number }
}

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'
const LIMIT = 10

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const fetchCats = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ paginate: 'true', page: String(p), limit: String(LIMIT), deleted: showDeleted ? 'true' : 'false' })
    const res = await fetch(`/api/categories?${params}`)
    const data = await res.json()
    setCategories(data.categories || []); setTotal(data.total || 0); setTotalPages(data.pages || 1)
    setLoading(false)
  }

  useEffect(() => { setPage(1); fetchCats(1) }, [showDeleted])
  useEffect(() => { fetchCats(page) }, [page])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: !current }),
    })
    if (res.ok) setCategories(prev => prev.map(c => c.id === id ? { ...c, status: !current } : c))
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Category moved to trash') : showToast('Failed', 'error')
    setDeleteId(null); fetchCats(page)
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/categories/${restoreId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted: false }),
    })
    res.ok ? showToast('Restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchCats(page)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} categor{total !== 1 ? 'ies' : 'y'} total</p>
        </div>
        <Link href="/admin/categories/new"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: GOLD }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}
        >
          <Plus size={16} /> Add Category
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" />
          Show deleted
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : categories.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No categories found</div>
          : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Banner', 'Name', 'Products', 'Order', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(cat => (
                  <tr key={cat.id} className={`hover:bg-gray-50 transition-colors ${cat.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="w-16 h-12 bg-gray-50 rounded border border-gray-100 overflow-hidden">
                        {cat.bannerImage
                          ? <img src={cat.bannerImage} alt={cat.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">No img</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{cat.name}</p>
                      <p className="text-xs text-gray-400">/jewellery/{cat.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{cat._count?.products ?? 0}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggle(cat.id, cat.status)}
                          disabled={togglingId === cat.id}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${togglingId === cat.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          style={{ backgroundColor: cat.status ? GOLD : '#d1d5db' }}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${cat.status ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{cat.status ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {cat.isDeleted ? (
                          <button onClick={() => setRestoreId(cat.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors">
                            <RotateCcw size={12} /> Restore
                          </button>
                        ) : (
                          <>
                            <Link href={`/admin/categories/${cat.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"><Eye size={12} /> View</Link>
                          <Link href={`/admin/categories/${cat.id}/edit`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                              style={{ backgroundColor: GOLD }}
                              onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)}
                              onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
                              <Pencil size={12} /> Edit
                            </Link>
                            <button onClick={() => setDeleteId(cat.id)}
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
      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="Category will be soft deleted." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore Category" message="Restore this category?" onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
