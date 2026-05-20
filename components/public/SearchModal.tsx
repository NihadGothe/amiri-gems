'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'

interface SearchResult {
  type: string; id: string; title: string; url: string; image?: string; subtitle?: string
}

interface Props { isOpen: boolean; onClose: () => void }

const QUICK_LINKS = [
  { label: 'Jewellery', url: '/jewellery' },
  { label: 'Watches', url: '/watches' },
  { label: 'Events', url: '/events' },
  { label: 'Boutiques', url: '/boutiques' },
  { label: 'Heritage', url: '/heritage' },
  { label: 'Media', url: '/media' },
]

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open')
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      document.body.classList.remove('modal-open')
      setQuery('')
      setResults([])
    }
    return () => { document.body.classList.remove('modal-open') }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(val), 350)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl shadow-2xl animate-slide-down max-h-[80vh] flex flex-col">

        {/* Input */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <Search size={18} className="text-gold flex-shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={handleChange}
            placeholder="Search brands, jewellery, watches, events..."
            className="flex-1 font-sans text-sm text-gray-800 placeholder:text-gray-400 outline-none bg-transparent" />
          {loading
            ? <Loader2 size={16} className="text-gray-400 animate-spin flex-shrink-0" />
            : <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"><X size={18} /></button>
          }
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1">
          {results.length > 0 ? (
            <div className="py-2">
              {/* Group by type */}
              {Array.from(new Set(results.map(r => r.type))).map(type => (
                <div key={type}>
                  <p className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 border-b border-gray-100">
                    {type}
                  </p>
                  {results.filter(r => r.type === type).map(result => (
                    <Link key={result.id + result.type} href={result.url} onClick={onClose}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-cream transition-colors group">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 overflow-hidden rounded">
                        {result.image ? (
                          <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-300 text-lg">◆</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-sans font-medium text-gray-800 group-hover:text-gold transition-colors truncate">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs text-gray-500 font-sans mt-0.5">{result.subtitle}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : query.length >= 2 && !loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 font-sans">No results for "{query}"</p>
              <p className="text-xs text-gray-400 font-sans mt-1">Try a brand name, jewellery type, or location</p>
            </div>
          ) : query.length === 0 ? (
            <div className="py-6 px-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Quick Navigation</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_LINKS.map(item => (
                  <Link key={item.url} href={item.url} onClick={onClose}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 text-sm font-sans text-gray-600 hover:border-gold hover:text-gold hover:bg-amber-50 transition-colors rounded">
                    <span className="text-gold text-xs">◆</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 font-sans">Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 text-xs">ESC</kbd> to close</p>
          {results.length > 0 && (
            <p className="text-xs text-gray-400">{results.length} result{results.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  )
}
