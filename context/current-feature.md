# Current Feature

Dashboard Items — Live Data

## Status

Completed

## Goals

- Replace dummy pinned/recent item data in the dashboard main area with real data from Neon/Prisma (currently from `src/lib/mock-data.ts`)
- Create `src/lib/db/items.ts` with data fetching functions
- Fetch items directly in a server component (no client-side fetching)
- Item card icon/border color derived from the item's type
- Display item type tags and other existing item card details (reference `@context/screenshots/dashboard-ui-main.png` if needed)
- If there are no pinned items, don't display the pinned section
- Update collection stats display
- Keep the existing design — layout is already there

## History

<!-- Keep this updated. Earliest to latest -->

- Project setup and boilerplate cleanup
- Initial Next.js Setup — scaffolded Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + ESLint; build passing, pushed to main
- Dashboard UI Layout - Phase 1 — shadcn/ui init (Button, Input), `/dashboard` route with TopBar (logo, search, New Item), dark mode by default, placeholder Sidebar/Main; build and lint passing
- Dashboard UI Layout - Phase 2 — shadcn/ui sidebar block (collapsible, drawer on mobile), AppSidebar with item type links, favorite/recent collections, user footer; build and lint passing
- Dashboard UI Layout - Phase 3 — stats cards, collections grid, pinned items, recent items (shadcn card/badge, shared ItemRow/type-icons/format utils); completes the 3-phase dashboard UI layout; build and lint passing
- Prisma + Neon PostgreSQL Setup — Prisma 7 with @prisma/adapter-neon; full schema (User, Item, ItemType, Collection, ItemCollection, Tag, ItemTag + NextAuth models); initial migration applied to dev branch; build passing
- Seed Sample Data — idempotent seed script (demo@devstash.io, 7 system types, 5 collections, 18 items, 8 tags); uses DIRECT_URL; run with `npx prisma db seed`
- Database Test Script — `scripts/test-db.ts` verifies connection and prints model counts, item types, collections, and demo user details
- Dashboard Collections — Live Data — replaced mock collection cards with real Prisma data; border color derived from dominant content type; type icons shown per collection; build and lint passing
- Dashboard Items — Live Data — replaced mock pinned/recent item data with real Prisma data (`src/lib/db/items.ts`); item card icon/border derived from item type, tags pulled from `ItemTag`/`Tag`; pinned section hidden when empty; stats cards now use real item/collection counts (`getItemStats`, `getCollectionStats`); build and lint passing
