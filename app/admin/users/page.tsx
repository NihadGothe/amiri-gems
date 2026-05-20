'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Shield, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast from '@/components/admin/Toast'

interface AdminUser { id: string; name?: string; email: string; role: string; isActive: boolean; createdAt: string }
const GOLD = '#b8974a', GOLD_DARK = '#a0832e'

export default function UsersListPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000) }

  const fetchUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : []); setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggle = async (id: string, current: boolean) => {
    setTogglingId(id)
    const res = await fetch(`/api/admin/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !current }) })
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !current } : u))
    setTogglingId(null)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/admin/users/${deleteId}`, { method: 'DELETE' })
    res.ok ? showToast('User deleted') : showToast('Failed to delete', 'error')
    setDeleteId(null); fetchUsers()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div><h1 className="text-2xl font-semibold text-gray-800">Admin Users</h1><p className="text-sm text-gray-500 mt-0.5">{users.length} user{users.length !== 1 ? 's' : ''}</p></div>
        <Link href="/admin/users/new" className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}>
          <Plus size={16} /> Add User
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
          : users.length === 0 ? <div className="p-12 text-center text-sm text-gray-400">No users found</div>
          : <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['User','Role','Status','Created','Actions'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: GOLD }}>
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div><p className="font-medium text-gray-800">{user.name || '—'}</p><p className="text-xs text-gray-400">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        <Shield size={10} /> {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggle(user.id, user.isActive)} disabled={togglingId === user.id}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer"
                          style={{ backgroundColor: user.isActive ? GOLD : '#d1d5db' }}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${user.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className="text-xs text-gray-500">{user.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/users/${user.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-colors"><Eye size={12} /> View</Link>
                        <Link href={`/admin/users/${user.id}/edit`} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors" style={{ backgroundColor: GOLD }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD_DARK)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = GOLD)}><Pencil size={12} /> Edit</Link>
                        <button onClick={() => setDeleteId(user.id)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={12} /> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>}
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Delete User" message="This user will be permanently deleted." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
