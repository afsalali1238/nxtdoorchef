'use client'

import Image from 'next/image'
import Link from 'next/link'
import WhatsAppButton from './WhatsAppButton'
import { timeAgo } from '@/lib/utils'
import type { Post, Chef } from '@/types'

interface PostCardProps {
  post: Post & { chefs?: Chef }
  selected?: boolean
  onClick?: () => void
}

export default function PostCard({ post, selected, onClick }: PostCardProps) {
  const chef = post.chefs as Pick<Chef, 'id' | 'name' | 'area' | 'whatsapp' | 'from_city' | 'from_country' | 'photo_url' | 'lat' | 'lng' | 'cuisine_type'> | undefined

  const flag = ((chef as any)?.cuisine_flag as string) || '🌍';
  const cuisine = chef?.cuisine_type || 'Various';

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer shadow-sm
        hover:-translate-y-0.5 hover:shadow-md
        ${selected ? 'border-saffron shadow-[0_0_0_3px_#FEF3C7]' : 'border-[#E8DFD0] hover:border-saffron/50'}
      `}
    >
      {/* Photo + cuisine badge */}
      <div className="relative aspect-video">
        {post.photo_url ? (
          <Image src={post.photo_url} alt={post.dish_name} fill className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-[#FFFBF5] text-4xl">🍽️</div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm text-[#1A1207]">
          {flag} {cuisine}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Chef row */}
        {chef && (
          <div className="flex items-center justify-between mb-3">
            <Link href={`/chefs/${chef.id}`} onClick={e => e.stopPropagation()} className="flex items-center gap-2 group">
              {chef.photo_url ? (
                <Image src={chef.photo_url} alt={chef.name} width={32} height={32} className="rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#FFFBF5] flex items-center justify-center text-xs">👩‍🍳</div>
              )}
              <div>
                <p className="text-sm font-semibold text-[#1A1207] group-hover:underline">{chef.name}</p>
                <p className="text-xs text-[#7A6550]">{chef.area}</p>
              </div>
            </Link>
            <span className="text-xs text-[#7A6550] whitespace-nowrap ml-2">{timeAgo(post.created_at)}</span>
          </div>
        )}

        <h3 className="font-display text-xl font-bold mb-2 text-[#1A1207]">{post.dish_name}</h3>
        
        {/* Quote or cultural note */}
        {(post as any).quote || post.cultural_note ? (
          <p className="text-sm italic text-[#3D2C1A] mb-4 line-clamp-3">
            "{((post as any).quote || post.cultural_note)}"
          </p>
        ) : <div className="mb-4"></div>}

        {chef && (
          <WhatsAppButton 
            chef={chef as Chef} 
            size="md" 
            label="💬 Say hello" 
            className="w-full justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm border-0 font-semibold" 
          />
        )}
      </div>
    </div>
  )
}
