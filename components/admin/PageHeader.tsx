'use client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  backHref?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, subtitle, backHref, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
      <div className="min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gold transition-colors mb-2"
          >
            <ChevronLeft size={14} /> Back
          </Link>
        )}
        <h1 className="text-2xl font-sans font-semibold text-gray-800 truncate">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
