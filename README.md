# NextDoorChef

A hyperlocal community directory for discovering home cultures through food in Dubai.

## Overview
NextDoorChef is a platform designed to connect people with the home chefs in their neighborhood. It acts as a non-transactional directory where home cooks can share their daily creations ("Today's Kitchen") and buyers can discover them. All communication and arrangements happen off-platform (via WhatsApp).

The platform strictly avoids e-commerce features (no pricing, no checkout) to comply with local regulations regarding home-based cooking.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database / Auth:** Supabase
- **Maps:** Leaflet & react-leaflet
- **Icons:** Lucide React
- **Emails:** Resend

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (copy `.env.example` to `.env.local` and fill in your Supabase credentials).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding Data
To populate the database with test chefs and posts:
```bash
node scripts/seed_posts.js
```

## Deployment
This project is configured for deployment on [Vercel](https://vercel.com).
Current live deployment: [nxtdoorchef.vercel.app](https://nxtdoorchef.vercel.app)
