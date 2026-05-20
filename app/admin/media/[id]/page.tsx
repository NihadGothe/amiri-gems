'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Globe, Calendar, Play } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface MediaItem {
  id: string; title: string; slug: string; type: string
  image?: string; videoUrl?: string; description?: string; date?: string
  isPublished: boolean; isDeleted: boolean; createdAt: string; updatedAt: string
}

const GOLD = '#b8974a'
const typeColors: Record<string, string> = {
  NEWS: 'bg-blue-50 text-blue-700',
  MAGAZINE: 'bg-purple-50 text-purple-700',
  EXHIBITION: 'bg-amber-50 text-amber-700',
  TV_COMMERCIAL: 'bg-red-50 text-red-700',
  PRESS: 'bg-green-50 text-green-700',
}

export default function ViewMediaPage() {
  const { id } = useParams() as { id: string }
  const [item, setItem] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/media/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setItem(d))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-12 text-center text-sm text-gray-400">Loading...</div>
  if (!item) return <div className="p-12 text-center text-sm text-gray-400">Media item not found</div>

  const embedUrl = item.videoUrl?.includes('youtube') || item.videoUrl?.includes('youtu.be')
    ? item.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : item.videoUrl

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Link href="/admin/media" className="text-gray-500 hover:text-gray-700 p-1 -ml-1"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{item.title}</h1>
            <p className="text-sm text-gray-500 mt-0.5">/media/{item.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/media/${item.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: GOLD }}>
            <Pencil size={14} /> Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">

          {/* Video */}
          {embedUrl && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="relative" style={{ paddingTop: '56.25%' }}>
                <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allowFullScreen title={item.title} />
              </div>
            </div>
          )}

          {/* Image (if no video) */}
          {!embedUrl && item.image && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-72 object-cover" />
            </div>
          )}

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Description</h3>
            {item.description ? (
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No description provided</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd><span className={`text-xs px-2 py-1 rounded-full ${typeColors[item.type] || 'bg-gray-100 text-gray-600'}`}>{item.type.replace('_', ' ')}</span></dd>
              </div>
              {item.date && (
                <div className="flex items-center justify-between">
                  <dt className="text-gray-500 flex items-center gap-1"><Calendar size={12} /> Date</dt>
                  <dd className="text-gray-800">{formatDate(item.date)}</dd>
                </div>
              )}
              {item.videoUrl && (
                <div>
                  <dt className="text-gray-500 flex items-center gap-1 mb-1"><Play size={12} /> Video URL</dt>
                  <dd className="text-xs text-gray-600 font-mono break-all bg-gray-50 rounded p-2">{item.videoUrl}</dd>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <dt className="text-gray-500">Status</dt>
                <dd><span className={`text-xs px-2 py-1 rounded-full ${item.isPublished ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{item.isPublished ? 'Published' : 'Draft'}</span></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-xs text-gray-800">{new Date(item.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>

          {/* Thumbnail if has video */}
          {embedUrl && item.image && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Thumbnail</h3>
              <img src={item.image} alt="" className="w-full h-32 object-cover rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
