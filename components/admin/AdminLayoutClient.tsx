'use client'
// components/admin/AdminLayoutClient.tsx
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (status === 'loading') return
    if (!session && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [session, status, isLoginPage, router])

  if (isLoginPage) return <>{children}</>

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg width="32" height="28" viewBox="0 0 80 70" fill="none" className="animate-pulse">
            <polygon points="40,2 75,25 75,45 40,68 5,45 5,25" stroke="#B8974A" strokeWidth="1.5" fill="none"/>
          </svg>
          <p className="text-white/50 font-sans text-xs tracking-widest">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-auto flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}