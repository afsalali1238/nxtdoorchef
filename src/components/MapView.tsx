// src/components/MapView.tsx
// ADAPTED FROM cr8:
//   - Pin emoji: 🎨 → 👩‍🍳
//   - Map centre: Kerala → Dubai [25.2048, 55.2708]
//   - Zoom: 8 (country) → 11 (city)
//   - Popup content: chef info instead of artist info
// Everything else: identical to cr8
'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import WhatsAppButton from './WhatsAppButton'
import { DUBAI_MAP_CENTER, DUBAI_MAP_ZOOM, CHEF_PIN_EMOJI } from '@/lib/constants'
import type { Chef } from '@/types'

// Chef map pin — divIcon avoids broken default Leaflet icons in webpack
function chefPin(active = false, hasPost = false) {
  return L.divIcon({
    className: '',
    html: `<div style="position: relative;">
      <div style="
        background: ${active ? '#C4522A' : '#E8960A'};
        width: 40px; height: 40px;
        border-radius: 50%;
        border: 2.5px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,.22);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
        transition: all .2s;
      ">${CHEF_PIN_EMOJI}</div>
      ${hasPost ? `<div style="position: absolute; top: -2px; right: -2px; width: 14px; height: 14px; background: #22c55e; border: 2px solid white; border-radius: 50%;"></div>` : ''}
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  })
}

interface MapViewProps {
  chefs: Chef[]
  selectedChefId?: string | null
  onChefSelect?: (chefId: string) => void
  activeChefIds?: string[]
  height?: string
}

export default function MapView({
  chefs,
  selectedChefId,
  onChefSelect,
  activeChefIds = [],
  height = '100%',
}: MapViewProps) {
  const validChefs = chefs.filter(c => c.lat && c.lng)

  return (
    <MapContainer
      center={DUBAI_MAP_CENTER}
      zoom={DUBAI_MAP_ZOOM}
      style={{ height, width: '100%' }}
      zoomControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
      />

      {validChefs.map(chef => (
        <Marker
          key={chef.id}
          position={[chef.lat!, chef.lng!]}
          icon={chefPin(chef.id === selectedChefId, activeChefIds.includes(chef.id))}
          eventHandlers={{ click: () => onChefSelect?.(chef.id) }}
        >
          <Popup maxWidth={240}>
            <ChefPopup chef={chef} />
          </Popup>
        </Marker>
      ))}

      {/* Fly to selected chef pin */}
      <FlyToChef chef={validChefs.find(c => c.id === selectedChefId)} />
    </MapContainer>
  )
}

// Flies the map to the selected chef
function FlyToChef({ chef }: { chef?: Chef }) {
  const map = useMap()
  useEffect(() => {
    if (chef?.lat && chef?.lng) {
      map.flyTo([chef.lat, chef.lng], 15, { duration: 0.8 })
    }
  }, [chef, map])
  return null
}

// Popup content shown when a pin is clicked
function ChefPopup({ chef }: { chef: Chef }) {
  const latestPost = chef.posts?.[0]
  const flag = chef.cuisine_flag || '🌍'

  return (
    <div style={{ fontFamily: 'var(--font-body, DM Sans, sans-serif)', minWidth: '220px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        {chef.photo_url ? (
          <img src={chef.photo_url} alt={chef.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFFBF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👩‍🍳</div>
        )}
        <div>
          <p style={{ fontWeight: 700, fontSize: '15px', margin: 0, color: '#1A1207' }}>{chef.name}</p>
          <p style={{ fontSize: '11px', color: '#7A6550', margin: '2px 0 0 0' }}>
            {flag} {chef.cuisine_type} · {chef.area}
          </p>
        </div>
      </div>

      {latestPost ? (
        <div style={{ marginBottom: '12px', background: '#F5F0E8', borderRadius: '8px', overflow: 'hidden' }}>
          {latestPost.photo_url && (
            <div style={{ position: 'relative', width: '100%', height: '100px' }}>
              <img src={latestPost.photo_url} alt={latestPost.dish_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>Today's Dish</div>
            </div>
          )}
          <div style={{ padding: '8px' }}>
            <p style={{ fontWeight: 600, fontSize: '13px', margin: '0 0 4px 0', color: '#1A1207' }}>{latestPost.dish_name}</p>
            {((latestPost as any).quote || latestPost.cultural_note) && (
              <p style={{ fontSize: '11px', fontStyle: 'italic', color: '#3D2C1A', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                "{((latestPost as any).quote || latestPost.cultural_note)}"
              </p>
            )}
          </div>
        </div>
      ) : chef.specialty ? (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.5, color: '#7A6550' }}>{chef.specialty}</p>
        </div>
      ) : null}

      <div style={{ width: '100%' }}>
        <WhatsAppButton chef={chef} size="sm" />
      </div>
    </div>
  )
}
