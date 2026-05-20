// app/admin/layout.tsx
import type { Metadata } from 'next'
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: { default: 'Admin — Amiri Gems', template: '%s | Admin — Amiri Gems' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
