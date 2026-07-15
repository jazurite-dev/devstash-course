# Current Feature

Stats & Sidebar — Live Data

## Status

Completed

## Goals

- Display main-area stats from real database data instead of `src/lib/mock-data.ts`
- Display system item types in the sidebar with their icons, linking to `/items/[typename]`
- Show real collection data (favorites/recents) in the sidebar instead of mock data
- Add a "View all collections" link under the sidebar collections list, going to `/collections`
- Keep star icons for favorite collections; for recent collections, show a colored circle based on the most-used item type in that collection
- Add data fetching functions to `src/lib/db/items.ts` (reference `src/lib/db/collections.ts` for pattern)
- Keep the existing design/layout — no visual changes

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
- Dashboard Items — Live Data — replaced mock pinned/recent item data with real Prisma data (`src/lib/db/items.ts`); item card icon/border derived from item type, tags pulled from `ItemTag`/`Tag`; pinned section hidden when empty; stats cards now use real item/collection counts (`getItemStats`, `getCollectionStats`); build and lint passing; merged to main
- Stats & Sidebar — Live Data — sidebar item types now come from `getItemTypesWithCounts` (`src/lib/db/items.ts`) linking to `/items/[typename]`; favorite/recent collections in sidebar use `getFavoriteCollections`/`getRecentNonFavoriteCollections` (`src/lib/db/collections.ts`); favorites show a star icon, recents show a dot colored by dominant item type; added "View all collections" link to `/collections`; build and lint passing
