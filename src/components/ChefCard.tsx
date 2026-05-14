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
  const flag = CUISINES.find(c => c.name === chef.cuisine_type)?.emoji || '🌍'
  const fallbackPhoto = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop'
  const photo = chef.photo_url || fallbackPhoto

  return (
    <div
      onClick={onClick}
      className={`
        bg-white border rounded-[16px] overflow-hidden transition-all cursor-pointer shadow-[0_4px_20px_rgba(26,10,0,.07)]
        hover:-translate-y-0.5 hover:shadow-card-hover
        ${selected
          ? 'border-saffron shadow-[0_0_0_3px_#FEF3C7]'
          : 'border-border hover:border-saffron/50'
        }
      `}
    >
      <div className="relative h-[130px] bg-spice overflow-hidden">
        <Image src={photo} alt={chef.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/10 to-transparent" />
        
        <span className="absolute top-2.5 left-2.5 text-xl bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-lg">
          {flag}
        </span>
        
        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-verified text-white px-2 py-0.5 rounded-full shadow-sm">
          🏛 Licensed
        </span>
        
        <div className="absolute bottom-2.5 left-3 text-white">
          <h3 className="text-[15px] font-bold drop-shadow-md">{chef.name}</h3>
        </div>
      </div>

      <div className="p-3">
        <div className="text-[11px] text-muted mb-1 font-medium">📍 {chef.area}, Dubai</div>
        
        {chef.specialty && (
          <p className="text-xs text-ink-mid leading-relaxed mb-3 line-clamp-2">
            {chef.specialty}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-auto">
          <Link
            href={`/chefs/${chef.id}`}
            onClick={e => e.stopPropagation()}
            className="text-xs text-saffron font-medium hover:text-[#b86505] transition-colors"
          >
            View profile →
          </Link>
          <WhatsAppButton chef={chef} size="sm" />
        </div>
      </div>
    </div>
  )
}
