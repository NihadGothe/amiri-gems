// app/home/page.tsx — public home with Header/Footer
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import HomePage from '@/app/public/page'

export default function HomeRoute() {
  return (
    <>
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </>
  )
}
