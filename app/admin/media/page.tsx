'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, RotateCcw, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface MediaItem { id: string; title: string; slug: string; type: string; image?: string; date?: string; isPublished: boolean; isDeleted: boolean }
const GOLD = '#b8974a', GOLD_DARK = '#a0832e', LIMIT = 12
const mediaTypes = ['NEWS','MAGAZINE','EXHIBITION','TV_COMMERCIAL','PRESS']

export default function MediaListPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [typeFilter, setTypeFilter] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null); const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000) }

  const fetchItems = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ paginate: 'true', page: String(p), limit: String(LIMIT), deleted: showDeleted ? 'true' : 'false' })
    if (typeFilter) params.set('type', typeFilter)
    const res = await fetch(`/api/media?${params}`)
    const data = await res.json()
    setItems(data.media || []); setTotal(data.total || 0); setTotalPages(data.pages || 1); setLoading(false)
  }

  useEffect(() => { setPage(1); fetchItems(1) }, [typeFilter, showDeleted])
  useEffect(() => { fetchItems(page) }, [page])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/media/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !current }) })
    if (res.ok) setItems(prev => prev.map(m => m.id === id ? { ...m, isPublished: !current } : m))
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/media/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Media moved to trash') : showToast('Failed', 'error')
    setDeleteId(null); fetchItems(page)
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/media/${restoreId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDeleted: false }) })
    res.ok ? showToast('Restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchItems(page)
  }

  const filtered = items.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div><h1 className="text-2xl font-semibold text-gray-800">Press / Media</h1><p className="text-sm text-gray-500 mt-0.5">{total} item{total !== 1 ? 's' : ''} total</p></div>
        <Link href="/admin/media/new" className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
          <Plus size={16} /> Add Media
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search media..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500 transition-all" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-amber-500">
          <option value="">All types</option>
          {mediaTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" /> Show deleted
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : filtered.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No media found</div>
          : <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['Image','Title','Type','Date','Published','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(item => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3"><div className="w-14 h-10 bg-gray-50 rounded border border-gray-100 overflow-hidden">{item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">—</div>}</div></td>
                    <td className="px-4 py-3"><p className="font-medium text-gray-800">{item.title}</p><p className="text-xs text-gray-400">/{item.slug}</p></td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{item.type.replace('_',' ')}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.date ? formatDate(item.date) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle(item.id, item.isPublished)} disabled={togglingId === item.id}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer"
                          style={{ backgroundColor: item.isPublished ? GOLD : '#d1d5db' }}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${item.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{item.isPublished ? 'Live' : 'Draft'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {item.isDeleted ? (
                          <button onClick={() => setRestoreId(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors"><RotateCcw size={12} /> Restore</button>
                        ) : (
                          <>
                            <Link href={`/admin/media/${item.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"><Eye size={12} /> View</Link>
                            <Link href={`/admin/media/${item.id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}><Pencil size={12} /> Edit</Link>
                            <button onClick={() => setDeleteId(item.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={12} /> Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} limit={LIMIT} onPageChange={setPage} />
      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="Media will be soft deleted." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore" message="Restore this media?" onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
