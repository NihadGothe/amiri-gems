'use client'
// components/public/BoutiqueMap.tsx
import { useEffect, useRef } from 'react'

interface Boutique {
  id: string
  name: string
  slug: string
  address?: string
  phone?: string
  latitude?: number
  longitude?: number
}

interface Props {
  boutiques: Boutique[]
  selected: Boutique | null
  onSelect: (b: Boutique) => void
}

export default function BoutiqueMap({ boutiques, selected, onSelect }: Props) {
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (mapRef.current) return

    import('leaflet').then(L => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      if (!mapContainerRef.current) return

      const map = L.map(mapContainerRef.current, {
        center: [25.2854, 51.531],
        zoom: 12,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined') return

    import('leaflet').then(L => {
      // Clear old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      const goldIcon = L.divIcon({
        className: '',
        html: `<div style="
          width: 32px; height: 32px;
          background: #B8974A;
          border: 2px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
      })

      const selectedIcon = L.divIcon({
        className: '',
        html: `<div style="
          width: 38px; height: 38px;
          background: #8B6E2F;
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 3px 12px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -40],
      })

      boutiques.forEach(b => {
        if (!b.latitude || !b.longitude) return
        const isSelected = selected?.id === b.id
        const marker = L.marker([b.latitude, b.longitude], {
          icon: isSelected ? selectedIcon : goldIcon,
        }).addTo(mapRef.current)

        marker.bindPopup(`
          <div style="font-family: 'Montserrat', sans-serif; padding: 4px; min-width: 180px;">
            <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; color: #1a1a1a; margin: 0 0 4px;">${b.name}</p>
            ${b.address ? `<p style="font-size: 11px; color: #666; margin: 0 0 4px;">${b.address}</p>` : ''}
            ${b.phone ? `<p style="font-size: 11px; color: #B8974A;">${b.phone}</p>` : ''}
          </div>
        `, { maxWidth: 220 })

        marker.on('click', () => onSelect(b))
        markersRef.current.push(marker)
      })
    })
  }, [boutiques, selected])

  // Pan to selected
  useEffect(() => {
    if (!mapRef.current || !selected?.latitude || !selected?.longitude) return
    mapRef.current.flyTo([selected.latitude, selected.longitude], 15, { duration: 1 })
  }, [selected])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '60vh' }} />
    </>
  )
}
