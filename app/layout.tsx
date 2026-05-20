// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: {
    default: 'Amiri Gems — The Home of Luxury Diamonds and Watches',
    template: '%s | Amiri Gems',
  },
  description:
    'Amiri Gems is Qatar\'s premier luxury jewellery and watch retailer, offering the finest diamonds, gemstones and prestigious timepieces since 1994.',
  keywords: ['luxury jewellery', 'watches', 'diamonds', 'Qatar', 'Doha', 'Amiri Gems'],
    icons: {
    icon: '/images/home/ag-gold.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_QA',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Amiri Gems',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
