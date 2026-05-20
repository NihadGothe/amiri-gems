'use client'

const GOLD = '#b8974a'
const GOLD_DARK = '#a0832e'

interface Props {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: Props) {
  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const pages: (number | '...')[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-700">{from}–{to}</span> of <span className="font-medium text-gray-700">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          style={{}}
          onMouseEnter={e => { if (page !== 1) { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '' }}
        >
          ‹ Prev
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-gray-400 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className="w-8 h-8 text-xs font-medium rounded-lg transition-all"
              style={p === page
                ? { backgroundColor: GOLD, color: 'white', border: `1px solid ${GOLD}` }
                : { backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb' }
              }
              onMouseEnter={e => { if (p !== page) { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD } }}
              onMouseLeave={e => { if (p !== page) { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#4b5563' } }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          onMouseEnter={e => { if (page !== totalPages) { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '' }}
        >
          Next ›
        </button>
      </div>
    </div>
  )
}

