// app/page.tsx — redirects to public home
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/home')
}
