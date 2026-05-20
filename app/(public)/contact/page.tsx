'use client'
// app/(public)/contact/page.tsx
import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Printer } from 'lucide-react'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const validate = (): boolean => {
    const errs: FormErrors = {}

    // Name
    if (!form.name.trim()) {
      errs.name = 'Full name is required'
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters'
    }

    // Email
    if (!form.email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address'
    }

    // Phone (optional but validate if filled)
    if (form.phone.trim()) {
      const cleaned = form.phone.trim().replace(/[\s\-\(\)\+]/g, '')
      if (!/^\d{7,15}$/.test(cleaned)) {
        errs.phone = 'Please enter a valid phone number (7–15 digits)'
      }
    }

    // Message
    if (!form.message.trim()) {
      errs.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(p => ({ ...p, [field]: value }))
    // Clear error on change
    if (errors[field]) setErrors(p => ({ ...p, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        setErrors({})
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const locations = [
    { name: 'Barwa Al Sadd — Flagship', address: 'Suhaim Bin Hamad Street, Barwa Al Sadd, P.O. Box 376, Doha', phone: '+974 4452 0000' },
    { name: 'The Gate Mall', address: 'Al Waab Street, Doha - Qatar', phone: '+974 4452 0014' },
    { name: 'Place Vendôme', address: 'Lusail City, Doha - Qatar', phone: '+974 4444 3607' },
    { name: 'Amiri Gems Oman', address: 'Salam Square, Madinat Sultan Qaboos, Muscat, Oman', phone: '+968 8005 8888' },
    // { name: 'Villaggio Mall', address: 'Al Waab Street, Doha - Qatar', phone: '+974 4452 0000' },
    // { name: 'Doha Festival City', address: 'Al Khor Highway, Doha - Qatar', phone: '+974 4452 0000' },
  ]

  const inputClass = (field: keyof FormErrors) =>
    `w-full border px-4 py-3 text-sm font-sans outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 bg-red-50'
        : 'border-gray-200 focus:border-gold'
    }`

  return (
    <>
      {/* Hero */}
      <div className="relative w-full" style={{ height: '35vh', minHeight: 240 }}>
        <img src="/images/sliders/dsc-0143-s.jpg" alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-serif text-white text-5xl md:text-7xl font-light tracking-widest uppercase">Contact</h1>
        </div>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-gray-800 text-3xl font-light mb-2">Get in Touch</h2>
            <div className="w-10 h-px bg-gold mb-8" />

            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-gold" />
                </div>
                <div>
                  <p className="luxury-label text-xs text-gray-500 mb-1">Main Address</p>
                  <p className="text-sm text-gray-700 font-sans leading-relaxed">
                    Barwa Al Sadd, Suhaim Bin Hamad Street<br />P.O. Box 376, Doha - Qatar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-gold" />
                </div>
                <div>
                  <p className="luxury-label text-xs text-gray-500 mb-1">Phone</p>
                  <a href="tel:+97444520000" className="text-sm text-gray-700 font-sans hover:text-gold transition-colors block">+974 4452 0000</a>
                  <a href="tel:+97444520014" className="text-sm text-gray-700 font-sans hover:text-gold transition-colors block">+974 4452 0014</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Printer size={14} className="text-gold" />
                </div>
                <div>
                  <p className="luxury-label text-xs text-gray-500 mb-1">Fax</p>
                  <p className="text-sm text-gray-700 font-sans">+974 4444 3607</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-gold" />
                </div>
                <div>
                  <p className="luxury-label text-xs text-gray-500 mb-1">Email</p>
                  <a href="mailto:info@amirigems.net" className="text-sm text-gray-700 font-sans hover:text-gold transition-colors">
                    info@amirigems.net
                  </a>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/97444520000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 transition-colors"
            >
              <MessageCircle size={16} />
              <span className="luxury-label text-xs">Chat on WhatsApp</span>
            </a>

            {/* Locations */}
            <div className="mt-12">
              <h3 className="font-serif text-gray-800 text-xl font-light mb-6">Our Locations</h3>
              <div className="space-y-4">
                {locations.map(loc => (
                  <div key={loc.name} className="border border-gray-100 p-4">
                    <p className="font-serif text-gray-800 font-light mb-1">{loc.name}</p>
                    <p className="text-xs text-gray-600 font-sans mb-1">{loc.address}</p>
                    <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="text-xs text-gold font-sans">{loc.phone}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-gray-800 text-3xl font-light mb-2">Send a Message</h2>
            <div className="w-10 h-px bg-gold mb-8" />

            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 p-6 text-center">
                <p className="font-serif text-green-800 text-xl font-light mb-2">Message Sent</p>
                <p className="text-sm text-green-700 font-sans">Thank you for contacting Amiri Gems. We will be in touch shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn-luxury mt-4 inline-block">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="luxury-label text-xs text-gray-500 block mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      className={inputClass('name')}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-sans">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="luxury-label text-xs text-gray-500 block mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      className={inputClass('email')}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-sans">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="luxury-label text-xs text-gray-500 block mb-2">
                      Phone Number <span className="text-gray-400 normal-case font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      className={inputClass('phone')}
                      placeholder="+974 XXXX XXXX"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-sans">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="luxury-label text-xs text-gray-500 block mb-2">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => handleChange('subject', e.target.value)}
                      className={inputClass('subject')}
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="luxury-label text-xs text-gray-500 block mb-2">
                    Message * <span className="text-gray-400 normal-case font-normal">(min. 10 characters)</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    className={`${inputClass('message')} resize-none`}
                    placeholder="Write your message here..."
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.message
                      ? <p className="text-red-500 text-xs font-sans">{errors.message}</p>
                      : <span />
                    }
                    <span className={`text-xs font-sans ml-auto ${form.message.length < 10 && form.message.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {form.message.length} / 10 min
                    </span>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-red-600 text-xs font-sans">Failed to send message. Please try again or email us directly at info@amirigems.net</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-luxury w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
