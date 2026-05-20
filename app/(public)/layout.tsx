// app/(public)/layout.tsx
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import PageLoader from '@/components/public/PageLoader'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageLoader />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}