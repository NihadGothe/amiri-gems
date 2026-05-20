'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Star, RotateCcw, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'

interface Event { id: string; title: string; slug: string; date: string; location?: string; mainImage?: string; isFeatured: boolean; isPublished: boolean; isDeleted: boolean }
const GOLD = '#b8974a', GOLD_DARK = '#a0832e', LIMIT = 10

export default function EventsListPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [total, setTotal] = useState(0); const [page, setPage] = useState(1); const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true); const [search, setSearch] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null); const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000) }

  const fetchEvents = async (p = page) => {
    setLoading(true)
    const params = new URLSearchParams({ paginate: 'true', page: String(p), limit: String(LIMIT), deleted: showDeleted ? 'true' : 'false' })
    const res = await fetch(`/api/events?${params}`)
    const data = await res.json()
    setEvents(data.events || []); setTotal(data.total || 0); setTotalPages(data.pages || 1); setLoading(false)
  }

  useEffect(() => { setPage(1); fetchEvents(1) }, [showDeleted])
  useEffect(() => { fetchEvents(page) }, [page])

  const handleToggle = async (id: string, field: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/events/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: !current }) })
    if (res.ok) setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: !current } : e))
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/events/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Event moved to trash') : showToast('Failed', 'error')
    setDeleteId(null); fetchEvents(page)
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/events/${restoreId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDeleted: false }) })
    res.ok ? showToast('Event restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchEvents(page)
  }

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.location?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div><h1 className="text-2xl font-semibold text-gray-800">Events</h1><p className="text-sm text-gray-500 mt-0.5">{total} event{total !== 1 ? 's' : ''} total</p></div>
        <Link href="/admin/events/new" className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
          <Plus size={16} /> Add Event
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap items-center gap-3 shadow-sm">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500 transition-all" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" /> Show deleted
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : filtered.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No events found</div>
          : <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['Image','Title','Date','Location','Featured','Published','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(event => (
                  <tr key={event.id} className={`hover:bg-gray-50 transition-colors ${event.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3"><div className="w-14 h-10 bg-gray-50 rounded border border-gray-100 overflow-hidden">{event.mainImage ? <img src={event.mainImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">—</div>}</div></td>
                    <td className="px-4 py-3"><p className="font-medium text-gray-800">{event.title}</p><p className="text-xs text-gray-400">/{event.slug}</p></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(event.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.location || '—'}</td>
                    <td className="px-4 py-3"><button onClick={() => handleToggle(event.id, 'isFeatured', event.isFeatured)} className={`text-xl transition-colors ${event.isFeatured ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}`}>★</button></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle(event.id, 'isPublished', event.isPublished)} disabled={togglingId === event.id}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer"
                          style={{ backgroundColor: event.isPublished ? GOLD : '#d1d5db' }}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${event.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{event.isPublished ? 'Published' : 'Draft'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {event.isDeleted ? (
                          <button onClick={() => setRestoreId(event.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors"><RotateCcw size={12} /> Restore</button>
                        ) : (
                          <>
                            <Link href={`/admin/events/${event.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"><Eye size={12} /> View</Link>
                            <Link href={`/admin/events/${event.id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}><Pencil size={12} /> Edit</Link>
                            <button onClick={() => setDeleteId(event.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={12} /> Delete</button>
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
      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="Event will be soft deleted." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore Event" message="Restore this event?" onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
