'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Shield, Mail, Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface AdminUser {
  id: string; name?: string; email: string; role: string
  isActive: boolean; createdAt: string; updatedAt: string
}

const GOLD = '#b8974a'

export default function ViewUserPage() {
  const { id } = useParams() as { id: string }
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setUser(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!user) return <div className="p-12 text-center text-sm text-gray-400">User not found</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/admin/users" className="text-gray-500 hover:text-gray-700 p-1 -ml-1"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{user.name || user.email}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Admin User</p>
          </div>
        </div>
        <Link href={`/admin/users/${user.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
          style={{ backgroundColor: GOLD }}>
          <Pencil size={14} /> Edit
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: GOLD }}>
            {(user.name || user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">{user.name || '—'}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <dl className="space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-gray-500 flex items-center gap-2"><Shield size={14} /> Role</dt>
            <dd>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500 flex items-center gap-2"><Mail size={14} /> Email</dt>
            <dd className="text-gray-800">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500 flex items-center gap-2"><User size={14} /> Status</dt>
            <dd><span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Created</dt>
            <dd className="text-gray-800">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500">Last Updated</dt>
            <dd className="text-gray-800">{formatDate(user.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
