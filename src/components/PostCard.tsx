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

  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-card border overflow-hidden transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-card-hover
        ${selected
          ? 'border-saffron shadow-[0_0_0_3px_#FEF3DC]'
          : 'border-border hover:border-saffron/50'
        }
      `}
    >
      {/* Photo */}
      <div className="h-[220px] bg-amber-bg w-full overflow-hidden">
        {post.photo_url ? (
          <Image
            src={post.photo_url}
            alt={post.dish_name}
            width={400}
            height={220}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-6xl">🍽️</div>
        )}
      </div>

      <div className="p-4">
        {/* Chef row */}
        {chef && (
          <Link href={`/chefs/${chef.id}`} className="flex items-center gap-2 mb-3 group">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-amber-bg flex items-center justify-center flex-shrink-0">
              {chef.photo_url ? (
                <Image src={chef.photo_url} alt={chef.name} width={28} height={28} className="object-cover w-full h-full" />
              ) : <span className="text-sm">👩‍🍳</span>}
            </div>
            <span className="font-medium text-sm text-dark group-hover:underline">{chef.name}</span>
            {chef.from_city && (
              <span className="text-xs text-muted">From {chef.from_city}</span>
            )}
            <span className="ml-auto text-xs bg-cream-dark text-muted px-2 py-0.5 rounded-chip">{chef.area}</span>
          </Link>
        )}

        {/* Dish name */}
        <h3 className="font-display text-lg font-bold text-dark mb-1">{post.dish_name}</h3>

        {/* Cultural note */}
        {post.cultural_note && (
          <p className="text-sm text-muted italic leading-relaxed line-clamp-2 mb-3">
            &ldquo;{post.cultural_note}&rdquo;
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted">{timeAgo(post.created_at)}</span>
          {chef && (
            <WhatsAppButton chef={chef as Chef} size="sm" label="Say hello" />
          )}
        </div>
      </div>
    </div>
  )
}
