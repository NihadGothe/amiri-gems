'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, MapPin, RotateCcw, Eye } from 'lucide-react'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'

interface Boutique { id: string; name: string; slug: string; city?: string; country?: string; phone?: string; latitude?: number; longitude?: number; isPublished: boolean; isDeleted: boolean }
const GOLD = '#b8974a', GOLD_DARK = '#a0832e'

export default function BoutiquesListPage() {
  const [boutiques, setBoutiques] = useState<Boutique[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleted, setShowDeleted] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null); const [restoreId, setRestoreId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000) }

  const fetchBoutiques = async () => {
    setLoading(true)
    const res = await fetch(`/api/boutiques?deleted=${showDeleted}`)
    const data = await res.json()
    setBoutiques(Array.isArray(data) ? data : []); setLoading(false)
  }

  useEffect(() => { fetchBoutiques() }, [showDeleted])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/boutiques/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !current }) })
    if (res.ok) setBoutiques(prev => prev.map(b => b.id === id ? { ...b, isPublished: !current } : b))
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/boutiques/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('Boutique moved to trash') : showToast('Failed', 'error')
    setDeleteId(null); fetchBoutiques()
  }

  const handleRestore = async () => {
    if (!restoreId) return
    const res = await fetch(`/api/boutiques/${restoreId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDeleted: false }) })
    res.ok ? showToast('Restored') : showToast('Failed', 'error')
    setRestoreId(null); fetchBoutiques()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div><h1 className="text-2xl font-semibold text-gray-800">Boutiques</h1><p className="text-sm text-gray-500 mt-0.5">{boutiques.length} boutique{boutiques.length !== 1 ? 's' : ''}</p></div>
        <Link href="/admin/boutiques/new" className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
          <Plus size={16} /> Add Boutique
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)} className="rounded" /> Show deleted
        </label>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : boutiques.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No boutiques found</div>
          : <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['Boutique','Location','Phone','Coordinates','Published','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {boutiques.map(b => (
                  <tr key={b.id} className={`hover:bg-gray-50 transition-colors ${b.isDeleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3"><p className="font-medium text-gray-800">{b.name}</p><p className="text-xs text-gray-400">/{b.slug}</p></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" /><span className="text-sm text-gray-600">{b.city}, {b.country}</span></div></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{b.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.latitude && b.longitude ? `${Number(b.latitude).toFixed(4)}, ${Number(b.longitude).toFixed(4)}` : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle(b.id, b.isPublished)} disabled={togglingId === b.id}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer"
                          style={{ backgroundColor: b.isPublished ? GOLD : '#d1d5db' }}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${b.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{b.isPublished ? 'Active' : 'Hidden'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {b.isDeleted ? (
                          <button onClick={() => setRestoreId(b.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors"><RotateCcw size={12} /> Restore</button>
                        ) : (
                          <>
                            <Link href={`/admin/boutiques/${b.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"><Eye size={12} /> View</Link>
                          <Link href={`/admin/boutiques/${b.id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}><Pencil size={12} /> Edit</Link>
                            <button onClick={() => setDeleteId(b.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={12} /> Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>}
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Move to Trash" message="Boutique will be soft deleted." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal isOpen={!!restoreId} title="Restore Boutique" message="Restore this boutique?" onConfirm={handleRestore} onCancel={() => setRestoreId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
