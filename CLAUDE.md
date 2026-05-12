# CLAUDE.md — NextDoorChef (nextdoorchef.com)

> Primary instruction file for Google Antigravity, Claude Code, Cursor, and all AI agents.
> Read this file FULLY before touching any code.
> Then read: MEMORY.md → .agents/skills/cr8-reference.md → relevant skill files.
> These rules are non-negotiable.

---

## Project Identity

**Product:** NextDoorChef — "Find the home chef next door who cooks what you miss from home."
**Domain:** https://nextdoorchef.com
**Market:** UAE only. Dubai first. Abu Dhabi + Sharjah in Phase 2.
**Currency:** AED (Arab Emirates Dirham)
**Stack:** Next.js 14 · Supabase (PostgreSQL + PostGIS) · Vercel · Tailwind CSS · Leaflet.js · shadcn/ui · Framer Motion
**Phase:** Phase 1 MVP — Buyers discover home chefs. Contact via WhatsApp only. No payments.
**Owner:** Afsal (non-technical — every decision must be explainable in plain language)

---

## Reference Codebase: cr8 (CraftersUnited)

**CRITICAL:** Before writing any code, read `.agents/skills/cr8-reference.md`.

NextDoorChef is architecturally identical to CraftersUnited (https://github.com/afsalali1238/cr8).
Same stack. Same patterns. Same agent conventions. Different vertical (food vs crafts) and market (UAE vs India).

The cr8 repo is your blueprint. Clone it, study it, adapt it. Do NOT reinvent patterns that already work there.

---

## The Four Principles (Karpathy Rules)

### 1. Think Before Coding
- State all assumptions explicitly before writing a single line
- If two interpretations exist, present both and wait for clarification
- Never silently pick an approach — surface tradeoffs
- Stop when confused. Name what's unclear. Ask.

### 2. Simplicity First
- Minimum code that meets the stated goal. Nothing speculative.
- No abstractions for single-use code
- No "flexibility" or "configurability" that wasn't asked for
- If 200 lines could be 50, rewrite it
- **Test:** Would a senior engineer call this overcomplicated? If yes, simplify.

### 3. Surgical Changes
- Touch only what the task requires
- Do not "improve" adjacent code unless asked
- Match existing code style even if you'd do it differently
- Every changed line must trace back to the user's request

### 4. Goal-Driven Execution
- Transform every task into a verifiable success criterion before starting
- Multi-step tasks: write the plan, get approval, then execute
- Format for plans:
```
1. [Step] → verify: [how to confirm it worked]
2. [Step] → verify: [how to confirm it worked]
```

---

## Architecture Overview

```
nextdoorchef/
├── CLAUDE.md                         ← YOU ARE HERE. Read first.
├── MEMORY.md                         ← Project state, ADRs, session log
├── .env.example                      ← Required env vars (no values)
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
│
├── .agents/
│   └── skills/
│       ├── cr8-reference.md          ← READ SECOND. What to copy, what to change.
│       ├── supabase.md               ← DB queries, RLS, storage, area coords
│       ├── nextjs-patterns.md        ← App Router, server/client, data fetching
│       ├── leaflet-maps.md           ← Map component, pins, clusters, dynamic import
│       ├── design-system.md          ← Colors, fonts, tokens, component patterns
│       └── whatsapp-contact.md       ← URL builders, button component, phone validation
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                ← Root layout, Nav, Footer
│   │   ├── page.tsx                  ← / Homepage
│   │   ├── not-found.tsx
│   │   ├── globals.css
│   │   ├── chefs/
│   │   │   ├── page.tsx              ← /chefs — grid + sidebar map
│   │   │   └── [id]/page.tsx         ← /chefs/[id] — chef profile + menu
│   │   ├── dishes/
│   │   │   ├── page.tsx              ← /dishes — grid + sidebar map
│   │   │   └── [id]/page.tsx         ← /dishes/[id] — dish detail
│   │   ├── map/
│   │   │   └── page.tsx              ← /map — full-screen map
│   │   ├── join/
│   │   │   └── page.tsx              ← /join — chef onboarding form
│   │   └── admin/
│   │       └── page.tsx              ← /admin — approve/reject chefs
│   │
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── ChefCard.tsx
│   │   ├── ChefGrid.tsx
│   │   ├── DishCard.tsx
│   │   ├── DishGrid.tsx
│   │   ├── MapView.tsx               ← Leaflet ("use client")
│   │   ├── CuisineFilter.tsx         ← ("use client")
│   │   ├── AreaFilter.tsx            ← ("use client")
│   │   ├── WhatsAppButton.tsx
│   │   ├── ChefOnboardingForm.tsx    ← ("use client")
│   │   ├── SkeletonCard.tsx
│   │   └── SplitLayout.tsx           ← cards panel + map panel
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             ← Browser client
│   │   │   └── server.ts             ← Server component client
│   │   ├── utils.ts                  ← WhatsApp URL builders, phone validation
│   │   └── constants.ts              ← CUISINES, AREAS, DIETARY_TAGS arrays
│   │
│   └── types/
│       └── index.ts                  ← Chef, Dish TypeScript interfaces
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    ← Run once in Supabase SQL editor
│
├── public/
│   └── images/
│
└── docs/
    ├── ARCHITECTURE.md               ← Full ADR rationale
    └── SCHEMA.md                     ← Table reference, join queries
```

---

## Tech Stack — Canonical Decisions

| Layer | Tool | Reason | Free Tier |
|---|---|---|---|
| Frontend | Next.js 14 (App Router) | SSR for SEO, Vercel-native, same as cr8 | Unlimited |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, same as cr8 | Free |
| Animations | Framer Motion | Premium feel, same as cr8 | Free |
| Database | Supabase PostgreSQL + PostGIS | Auth + DB + Storage + geo, same as cr8 | 500MB |
| Auth | Supabase Auth (Phase 2) | Not needed in Phase 1 | Free |
| Storage | Supabase Storage | Chef photos + dish images | 1GB |
| Maps | Leaflet.js + OpenStreetMap | Free, no API key, same as cr8 | Unlimited |
| Hosting | Vercel | Auto-deploy from GitHub, same as cr8 | Free |
| Contact | WhatsApp `wa.me` deep links | Zero backend, UAE-native | Free |
| Admin | `/admin` page + Supabase table editor | Afsal approves chefs | Free |

**DO NOT introduce any tool not on this list without asking first.**

---

## Pages — Phase 1 Build Order

| # | Route | Description | Done When |
|---|---|---|---|
| 1 | `/` | Hero + search + cuisine strip + featured dishes + chef spotlight + how it works | 4 dish cards + 3 chef cards render from Supabase |
| 2 | `/chefs` | Chef grid (left) + map (right) + cuisine/area filters | Filters work; map pins match filtered cards |
| 3 | `/chefs/[id]` | Chef photo + bio + full dish menu + WhatsApp button | WA link opens with pre-filled message |
| 4 | `/dishes` | Dish grid (left) + map (right) + cuisine/dietary filters | Filter works; map shows chef location for each dish |
| 5 | `/dishes/[id]` | Dish photo + description + chef info + order button | "Order via WhatsApp" link works |
| 6 | `/map` | Full-screen map, all chef pins, popup with WA button | Pins load, cluster on zoom-out, popup works |
| 7 | `/join` | Chef onboarding form | Saves to Supabase `chefs` with `is_approved=false` |
| 8 | `/admin` | List pending chefs, approve/reject buttons | Approval sets `is_approved=true` in DB |

---

## What NOT to Build in Phase 1

- ❌ Payments / checkout / cart
- ❌ In-app messaging (WhatsApp replaces this)
- ❌ Reviews / ratings
- ❌ Chef self-service dashboard / login
- ❌ Email notifications
- ❌ Full-text search (filter chips only)
- ❌ Mobile app
- ❌ Google Maps (Leaflet is free and sufficient)
- ❌ Community / forums (different project)

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only
NEXT_PUBLIC_SITE_URL=https://nextdoorchef.com
```

---

## Deployment

1. Push to GitHub `main` branch
2. Vercel auto-deploys (connect repo in Vercel dashboard)
3. Set `nextdoorchef.com` as custom domain in Vercel
4. Run `001_initial_schema.sql` in Supabase SQL Editor once
5. Create storage buckets: `chef-photos`, `dish-images` (both public)

---

## Agent Execution Protocol

Every session:
1. **Read MEMORY.md** — check what's already done and any active decisions
2. **Read `.agents/skills/cr8-reference.md`** — identify what to reuse from cr8
3. **Read the relevant skill file** for the task (maps, supabase, design, etc.)
4. **State your plan** — get confirmation before writing code
5. **Build the minimum thing** that meets the success criterion
6. **Verify** the criterion explicitly
7. **Update MEMORY.md** — append progress, new decisions, blockers

Never start coding without a plan. Never declare success without verifying.
