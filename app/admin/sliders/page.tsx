'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, RotateCcw } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface Slider {
  id: string; title?: string; subtitle?: string; image: string
  ctaText?: string; placement: string
  sortOrder: number; isActive: boolean; isDeleted: boolean; createdAt: string
}

const LIMIT = 10

export default function SlidersListPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [placementFilter, setPlacementFilter] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 3000)
  }

  const fetchSliders = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ admin: 'true', page: String(p), limit: String(LIMIT), deleted: showDeleted ? 'true' : 'false' })
    if (placementFilter) params.set('placement', placementFilter)
    const res = await fetch(`/api/sliders?${params}`)
    const data = await res.json()
    if (Array.isArray(data)) {
      setSliders(data); setTotal(data.length); setTotalPages(1)
    } else {
      setSliders(data.sliders || []); setTotal(data.total || 0); setTotalPages(data.pages || 1)
    }
    setLoading(false)
  }

  useEffect(() => { setPage(1); fetchSliders(1) }, [placementFilter, showDeleted])
  useEffect(() => { fetchSliders(page) }, [page])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/sliders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    })
    if (res.ok) {
      setSliders(prev => prev.map(s => s.id === id ? { ...s, isActive: !current } : s))
    }
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/sliders/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Slider moved to trash') : showToast('Failed', 'error')
    setDeleteId(null); fetchSliders(page)
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/sliders/${restoreId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDeleted: false }),
    })
    res.ok ? showToast('Slider restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchSliders(page)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Hero Sliders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} slider{total !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/sliders/new"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: '#b8974a' }}
        >
          <Plus size={16} /> Add Slider
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <select
          value={placementFilter}
          onChange={e => setPlacementFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-gold transition-all"
        >
          <option value="">All placements</option>
          {['HOME','JEWELLERY','WATCHES','BRANDS','EVENTS','MEDIA'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" />
          Show deleted
        </label>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
        ) : sliders.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">No sliders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Image', 'Title', 'Placement', 'Order', 'Active', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sliders.map(s => (
                  <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${s.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="w-20 h-12 bg-gray-50 rounded border border-gray-100 overflow-hidden">
                        {s.image && <img src={s.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{s.title || <span className="text-gray-400 italic text-xs">No title</span>}</p>
                      {s.ctaText && <p className="text-xs text-gray-400 mt-0.5">{s.ctaText}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">{s.placement}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{s.sortOrder}</td>
                    <td className="px-4 py-3">
                      {/* Toggle — same style as SliderForm */}
                      <button
                        onClick={() => handleToggle(s.id, s.isActive)}
                        disabled={togglingId === s.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                          togglingId === s.id ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                        } ${s.isActive ? 'bg-gold' : 'bg-gray-200'}`}
                        style={s.isActive ? { backgroundColor: '#b8974a' } : {}}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${s.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="ml-2 text-xs text-gray-500">{s.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {s.isDeleted ? (
                          <button
                            onClick={() => setRestoreId(s.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                          >
                            <RotateCcw size={12} /> Restore
                          </button>
                        ) : (
                          <>
                            <Link
                              href={`/admin/sliders/${s.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-gold hover:text-gold transition-colors"
                            >
                              <Eye size={12} /> View
                            </Link>
                            <Link
                              href={`/admin/sliders/${s.id}/edit`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                              style={{ backgroundColor: '#b8974a' }}
                              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a0832e')}
                              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#b8974a')}
                            >
                              <Pencil size={12} /> Edit
                            </Link>
                            <button
                              onClick={() => setDeleteId(s.id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            >
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

      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="Slider will be soft deleted. You can restore it anytime." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore Slider" message="This will restore the slider." onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
