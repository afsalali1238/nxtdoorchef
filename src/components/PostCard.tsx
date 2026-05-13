'use client'

import Image from 'next/image'
import Link from 'next/link'
import WhatsAppButton from './WhatsAppButton'
import type { Post, Chef } from '@/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const chef = post.chefs as Pick<Chef, 'id' | 'name' | 'area' | 'whatsapp' | 'photo_url'> | undefined

  return (
    <div className="bg-white rounded-[24px] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Photo area (80% visual weight) */}
      <div className="relative aspect-[4/5] bg-amber-bg w-full overflow-hidden">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.caption || 'Today\'s cooking'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-6xl">🥘</div>
        )}
        
        {/* Overlay chef info at top */}
        {chef && (
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <Link href={`/chefs/${chef.id}`} className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-white transition-colors bg-white flex items-center justify-center">
                {chef.photo_url ? (
                   <Image src={chef.photo_url} alt={chef.name} width={40} height={40} className="object-cover w-full h-full" />
                ) : <span className="text-xl">👩‍🍳</span>}
              </div>
              <div>
                <h3 className="font-medium text-white shadow-sm drop-shadow-md">{chef.name}</h3>
                <p className="text-xs text-white/90 drop-shadow-md">📍 {chef.area}</p>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Caption and action below image */}
      <div className="p-5">
        {post.caption && (
          <p className="text-sm text-dark mb-4 leading-relaxed line-clamp-3">
            {post.caption}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {new Date(post.created_at).toLocaleDateString('en-AE', { weekday: 'long' })}
          </span>
          {chef && (
            <WhatsAppButton chef={chef as Chef} size="sm" label="Say hello" />
          )}
        </div>
      </div>
    </div>
  )
}
