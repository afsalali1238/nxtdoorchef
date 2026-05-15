// src/types/index.ts
// All shared TypeScript types for NextDoorChef
// ADAPTED FROM cr8: Artist → Chef, Listing → Dish

export interface Chef {
  id: string
  name: string
  bio: string | null
  whatsapp: string           // 971XXXXXXXXX — no +, no spaces
  photo_url: string | null   // Supabase storage: chef-photos/{id}/profile.jpg
  cuisine_type: string       // matches cuisine_types.name
  specialty: string | null   // "Known for Kerala fish curry" — one liner
  area: string               // Dubai neighbourhood, matches dubai_areas.name
  lat: number | null
  lng: number | null
  is_approved: boolean
  is_active: boolean
  from_city: string | null
  from_country: string | null
  emirate?: string | null
  cooking_philosophy: string | null
  cuisine_flag?: string | null
  created_at: string
  // joined relations
  dishes?: Dish[]
  posts?: Post[]
}

export interface Post {
  id: string
  chef_id: string
  photo_url: string
  dish_name: string
  cultural_note: string | null
  quote?: string | null
  cuisine_flag?: string | null
  created_at: string
  expires_at: string
  // joined relation
  chefs?: Pick<Chef, 'id' | 'name' | 'area' | 'whatsapp' | 'from_city' | 'from_country' | 'photo_url' | 'lat' | 'lng' | 'cuisine_type' | 'bio' | 'specialty'> & { cuisine_flag?: string | null }
}

export interface Dish {
  id: string
  chef_id: string
  name: string
  description: string | null
  price_aed: number | null   // display only — no checkout in Phase 1
  image_url: string | null   // Supabase storage: dish-images/{chef_id}/{dish_id}.jpg
  cuisine_type: string
  dietary_tags: DietaryTag[] // ['halal', 'vegetarian', ...]
  available_today: boolean
  created_at: string
  // joined relation (optional — only when fetched with chef info)
  chefs?: Pick<Chef, 'id' | 'name' | 'area' | 'whatsapp' | 'photo_url' | 'specialty'>
}

export interface CuisineType {
  id: number
  name: string
  emoji: string
  slug: string
}

export interface DubaiArea {
  id: number
  name: string
  lat: number
  lng: number
}

// Dietary tag options — used in filter chips and dish badges
export type DietaryTag = 'halal' | 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free'

// Chef onboarding form shape
export interface ChefFormData {
  name: string
  bio: string
  whatsapp: string
  cuisine_type: string
  specialty: string
  area: string
  from_city: string
  from_country: string
  cooking_philosophy: string
  photo?: File
}

// Filter state for /chefs and /dishes pages
export interface ChefFilters {
  cuisine: string   // 'All' or a cuisine name
  area: string      // 'All' or a Dubai area name
}

export interface DishFilters {
  cuisine: string      // 'All' or a cuisine name
  dietary: DietaryTag | 'All'
  available_today: boolean
}
