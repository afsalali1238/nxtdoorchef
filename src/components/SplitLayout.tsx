// src/components/SplitLayout.tsx
// NEW — extracted from cr8 page-level pattern into a shared component
// Used by /chefs and /dishes pages (both are cards-left + map-right)
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Chef } from '@/types'

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-amber-bg animate-pulse flex items-center justify-center">
      <span className="text-muted text-sm">Loading map…</span>
    </div>
  ),
})

interface SplitLayoutProps {
  chefs: Chef[]
  selectedChefId?: string | null
  onChefSelect?: (id: string) => void
  panelHeader: React.ReactNode
  children: React.ReactNode
}

export default function SplitLayout({
  chefs,
  selectedChefId,
  onChefSelect,
  panelHeader,
  children,
}: SplitLayoutProps) {
  const [showMapOnMobile, setShowMapOnMobile] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-62px)] mt-nav relative">
      {/* Left: scrollable cards panel */}
      <div className={`w-full lg:w-[420px] h-full flex-shrink-0 flex-col bg-cream overflow-hidden ${showMapOnMobile ? 'hidden lg:flex' : 'flex'}`}>
        {/* Sticky filter header */}
        <div className="bg-white border-b border-border flex-shrink-0">
          {panelHeader}
        </div>
        {/* Scrollable cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24 lg:pb-3">
          {children}
        </div>
      </div>

      {/* Right: map */}
      <div className={`flex-1 relative h-full ${showMapOnMobile ? 'block' : 'hidden lg:block'}`}>
        <MapView
          chefs={chefs}
          selectedChefId={selectedChefId}
          onChefSelect={onChefSelect}
          height="100%"
        />
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <button 
          onClick={() => setShowMapOnMobile(!showMapOnMobile)}
          className="bg-dark text-white px-6 py-3 rounded-full font-medium shadow-xl border border-white/10 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          {showMapOnMobile ? '📄 Show List' : '🗺️ Show Map'}
        </button>
      </div>
    </div>
  )
}
