// src/app/map/page.tsx
// ADAPTED FROM cr8 /map — change centre + zoom only

import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import type { Chef } from '@/types'

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-amber-bg animate-pulse flex items-center justify-center">
      <p className="text-muted">Loading map…</p>
    </div>
  ),
})

export default async function MapPage() {
  const supabase = createClient()
  const { data: chefs } = await supabase
    .from('chefs')
    .select('id, name, cuisine_type, area, lat, lng, whatsapp, specialty, photo_url, cuisine_flag, posts(dish_name, photo_url, cultural_note)')
    .eq('is_approved', true)
    .eq('is_active', true)
    .not('lat', 'is', null)

  const activeChefs = (chefs ?? []).slice(0, 8) as unknown as Chef[]

  return (
    <div className="relative w-full h-[calc(100vh-62px)]">
      {/* Header Overlay */}
      <div className="absolute top-6 left-6 z-[1000] max-w-sm pointer-events-none hidden md:block">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg pointer-events-auto border border-white/20">
          <p className="text-[#D4780A] font-bold text-[11px] uppercase tracking-widest mb-1">Live map</p>
          <h1 className="font-display text-3xl font-bold mb-2 text-[#1A1207]">Find your neighbour</h1>
          <p className="text-sm text-[#7A6550]">Zoom in to see who is cooking near you tonight.</p>
        </div>
      </div>

      {/* Mobile Header Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none md:hidden">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg pointer-events-auto border border-white/20">
          <h1 className="font-display text-xl font-bold mb-1 text-[#1A1207]">Live map</h1>
          <p className="text-xs text-[#7A6550]">Zoom in to see who is cooking near you tonight.</p>
        </div>
      </div>

      {/* Active Chef Pill Row */}
      <div className="absolute bottom-6 left-0 right-0 md:top-6 md:bottom-auto md:left-auto md:right-6 z-[1000] w-full md:max-w-2xl overflow-x-auto hide-scrollbar pointer-events-auto pl-4 md:pl-0">
        <div className="flex gap-3 pr-6">
          {activeChefs.map(chef => {
            const flag = chef.cuisine_flag || '🌍'
            return (
              <button key={chef.id} className="bg-white/90 backdrop-blur-md flex items-center gap-2 p-1.5 pr-4 rounded-full shadow-md border border-[#E8DFD0] hover:-translate-y-0.5 transition-all flex-shrink-0">
                {chef.photo_url ? (
                  <img src={chef.photo_url} width={32} height={32} className="rounded-full object-cover w-8 h-8" alt={chef.name} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FFFBF5] flex items-center justify-center text-xs">👩‍🍳</div>
                )}
                <div className="text-left">
                  <p className="text-xs font-bold leading-none text-[#1A1207]">{chef.name}</p>
                  <p className="text-[10px] text-[#7A6550] mt-0.5">{flag} {chef.cuisine_type}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      
      <MapView
        chefs={(chefs ?? []) as unknown as Chef[]}
        height="100%"
      />
    </div>
  )
}
