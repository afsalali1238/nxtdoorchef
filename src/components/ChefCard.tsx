'use client'

// src/components/ChefCard.tsx
// Community chef card — shows name, cuisine, area, specialty

import Link from 'next/link'
import Image from 'next/image'
import WhatsAppButton from './WhatsAppButton'
import { CUISINES } from '@/lib/constants'
import type { Chef } from '@/types'

interface ChefCardProps {
  chef: Chef
  selected?: boolean
  onClick?: () => void
}

export default function ChefCard({ chef, selected, onClick }: ChefCardProps) {
  const fallbackPhoto = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop'
  const photo = chef.photo_url || fallbackPhoto
  const flag = (chef.cuisine_flag as string) || CUISINES.find(c => c.name === chef.cuisine_type)?.emoji || '🌍'

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl overflow-hidden shadow-sm border transition-all cursor-pointer
        hover:-translate-y-0.5 hover:shadow-md
        ${selected
          ? 'border-saffron shadow-[0_0_0_3px_#FEF3C7]'
          : 'border-[#E8DFD0] hover:border-saffron/50'
        }
      `}
    >
      <div className="relative aspect-[3/4]">
        <Image src={photo} alt={chef.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#1A1207] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {flag} {chef.cuisine_type}
        </span>
        
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-display text-2xl font-bold mb-1">{chef.name}</h3>
          <p className="text-sm text-white/90">{chef.area} • {chef.from_city || 'Dubai'}</p>
        </div>
      </div>

      <div className="p-4">
        {chef.specialty && (
          <p className="text-sm text-[#7A6550] line-clamp-2 mb-4 leading-relaxed">
            {chef.specialty}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/chefs/${chef.id}`}
            onClick={e => e.stopPropagation()}
            className="bg-[#F5F0E8] text-[#1A1207] text-center py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E8DFD0] transition-colors"
          >
            View profile
          </Link>
          <WhatsAppButton 
            chef={chef} 
            size="md" 
            label="Message" 
            className="justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm border-0 font-semibold" 
          />
        </div>
      </div>
    </div>
  )
}
