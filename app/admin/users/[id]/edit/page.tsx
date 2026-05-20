'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import UserForm, { type UserFormData } from '@/components/admin/UserForm'

export default function EditUserPage() {
  const { id } = useParams() as { id: string }
  const [data, setData] = useState<UserFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(u => {
        if (!u) return
        setData({ id: u.id, name: u.name || '', email: u.email || '', password: '', role: u.role || 'EDITOR', isActive: u.isActive ?? true })
      }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!data) return <div className="p-12 text-center text-sm text-gray-400">User not found</div>
  return <UserForm initial={data} isEdit />
}
