# Prisma + Neon PostgreSQL Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Prisma 7, configure Neon PostgreSQL, write the full schema (all app models + NextAuth models), create a Prisma client singleton, and run the initial migration.

**Architecture:** Prisma 7 generates a typed client from `prisma/schema.prisma` into `src/lib/generated/prisma/`. The singleton in `src/lib/prisma.ts` wraps `PrismaClient` with the `@prisma/adapter-neon` driver (using the pooled `DATABASE_URL` for the app). The Prisma CLI uses `DIRECT_URL` via `prisma.config.ts` for migrations.

**Tech Stack:** Prisma 7, `@prisma/adapter-neon`, `@neondatabase/serverless`, `dotenv`, Neon PostgreSQL, Next.js 16

## Global Constraints

- Prisma 7 — driver adapters are mandatory; `migrate dev` no longer auto-generates; import from generated path not `@prisma/client`
- Generator provider is `prisma-client` (not `prisma-client-js`); `output` field is required
- `prisma.config.ts` is required at the project root; uses `DIRECT_URL` for CLI operations
- App uses pooled `DATABASE_URL` (Neon pooler endpoint); CLI uses `DIRECT_URL` (direct endpoint)
- Always `prisma migrate dev` for schema changes — never `db push`
- Generated client at `src/lib/generated/prisma/` — gitignored, never committed
- No `any` types in TypeScript; strict mode enabled
- No AI/Claude references in commits

---

## Task 1: Create branch and install Prisma 7 packages

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `prisma` CLI available via `npx prisma`; `@prisma/client`, `@prisma/adapter-neon`, `@neondatabase/serverless` available as imports

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feature/database-setup
```

Expected: Switched to a new branch 'feature/database-setup'

- [ ] **Step 2: Install Prisma CLI as a dev dependency**

```bash
npm install --save-dev prisma@7
```

Expected: `prisma@7.x.x` in `devDependencies`

- [ ] **Step 3: Install runtime packages**

```bash
npm install @prisma/client@7 @prisma/adapter-neon @neondatabase/serverless dotenv
```

Expected: All four packages in `dependencies`

- [ ] **Step 4: Verify Prisma CLI works**

```bash
npx prisma --version
```

Expected: output includes `prisma: 7.x.x`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(db): install Prisma 7 and Neon adapter packages"
```

---

## Task 2: Initialize Prisma and create prisma.config.ts

**Files:**
- Create: `prisma/schema.prisma` (placeholder — will be replaced in Task 3)
- Create: `prisma.config.ts` (project root)

**Interfaces:**
- Produces: `prisma.config.ts` exports a `defineConfig` object; Prisma CLI reads `DIRECT_URL` from `.env` for all migration commands

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and `.env`. We will overwrite both in the next tasks.

Expected output: `✔ Your Prisma schema was created at prisma/schema.prisma`

- [ ] **Step 2: Create prisma.config.ts at the project root**

Create file `prisma.config.ts`:

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

- [ ] **Step 3: Add generated client to .gitignore**

Open `.gitignore` and add this block before the `# typescript` section:

```
# prisma generated client
/src/lib/generated/
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma.config.ts .gitignore
git commit -m "chore(db): initialize Prisma and add config"
```

---

## Task 3: Write the Prisma schema

**Files:**
- Modify: `prisma/schema.prisma` (replace the placeholder content)

**Interfaces:**
- Produces: All Prisma models with correct types, relations, indexes, and cascade rules; NextAuth models included

- [ ] **Step 1: Replace prisma/schema.prisma with the full schema**

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                   String    @id @default(cuid())
  name                 String?
  email                String    @unique
  emailVerified        DateTime?
  image                String?
  password             String?
  isPro                Boolean   @default(false)
  stripeCustomerId     String?
  stripeSubscriptionId String?

  accounts    Account[]
  sessions    Session[]
  items       Item[]
  itemTypes   ItemType[]
  collections Collection[]
  tags        Tag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Item {
  id          String  @id @default(cuid())
  title       String
  contentType String
  content     String?
  fileUrl     String?
  fileName    String?
  fileSize    Int?
  url         String?
  description String?
  isFavorite  Boolean @default(false)
  isPinned    Boolean @default(false)
  language    String?

  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  typeId String
  type   ItemType @relation(fields: [typeId], references: [id])

  collections ItemCollection[]
  tags        ItemTag[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@index([typeId])
}

model ItemType {
  id       String  @id @default(cuid())
  name     String
  icon     String?
  color    String?
  isSystem Boolean @default(false)

  userId String?
  user   User?   @relation(fields: [userId], references: [id], onDelete: Cascade)

  items Item[]

  @@index([userId])
}

model Collection {
  id            String  @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean @default(false)
  defaultTypeId String?

  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemCollection[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id   String @id @default(cuid())
  name String

  userId String
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  items ItemTag[]

  @@index([userId])
}

model ItemTag {
  itemId String
  tagId  String

  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([itemId, tagId])
}
```

- [ ] **Step 2: Validate the schema**

```bash
npx prisma validate
```

Expected: `The schema at prisma/schema.prisma is valid`

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(db): add full Prisma schema with app and NextAuth models"
```

---

## Task 4: Create the Prisma client singleton

**Files:**
- Create: `src/lib/prisma.ts`

**Interfaces:**
- Consumes: `@prisma/adapter-neon` → `PrismaNeon`; generated client at `./generated/prisma/client`
- Produces: `prisma` exported singleton — import as `import { prisma } from "@/lib/prisma"` anywhere in the app

- [ ] **Step 1: Create src/lib/prisma.ts**

```typescript
import { PrismaClient } from "./generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const createPrismaClient = () => {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
};

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
```

The global singleton pattern prevents multiple `PrismaClient` instances during Next.js hot reloads in development.

- [ ] **Step 2: Commit**

```bash
git add src/lib/prisma.ts
git commit -m "feat(db): add Prisma client singleton with Neon adapter"
```

---

## Task 5: Configure environment variables

**Files:**
- Modify: `.env` (created by `prisma init` — add `DIRECT_URL`, update `DATABASE_URL`)
- Create: `.env.example`

**Note:** `.env` is already covered by `.env*` in `.gitignore` — never committed.

**Interfaces:**
- Produces: `DATABASE_URL` (pooled Neon endpoint) and `DIRECT_URL` (direct Neon endpoint) available to both the app and Prisma CLI

- [ ] **Step 1: Get your Neon connection strings**

Go to your Neon dashboard → select your project → open the **dev branch** → click **Connect** → copy:
1. **Pooled connection string** → this is `DATABASE_URL` (URL contains `-pooler` in the host)
2. **Direct connection string** → this is `DIRECT_URL` (no `-pooler`)

Both strings look like:
```
postgres://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

- [ ] **Step 2: Update .env**

Replace the entire `.env` content with:

```
DATABASE_URL="postgres://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require"
DIRECT_URL="postgres://USER:PASSWORD@ep-xxx.REGION.aws.neon.tech/DBNAME?sslmode=require"
```

Fill in your actual credentials from the Neon dashboard.

- [ ] **Step 3: Create .env.example**

Create `.env.example` at the project root:

```
DATABASE_URL="postgres://USER:PASSWORD@ep-xxx-pooler.REGION.aws.neon.tech/DBNAME?sslmode=require"
DIRECT_URL="postgres://USER:PASSWORD@ep-xxx.REGION.aws.neon.tech/DBNAME?sslmode=require"
```

- [ ] **Step 4: Commit .env.example only**

```bash
git add .env.example
git commit -m "chore(db): add .env.example with required database env vars"
```

---

## Task 6: Run the initial migration and verify

**Files:**
- Created by Prisma: `prisma/migrations/TIMESTAMP_init/migration.sql`

**Interfaces:**
- Consumes: valid `DATABASE_URL` / `DIRECT_URL` in `.env`; valid schema from Task 3
- Produces: all tables created in Neon dev branch; typed client generated in `src/lib/generated/prisma/`

- [ ] **Step 1: Run the migration**

```bash
npx prisma migrate dev --name init
```

Expected output includes:
```
✔ Generated Prisma Client
The following migration(s) have been applied:
  migrations/TIMESTAMP_init/migration.sql
```

If Prisma says migrations are out of sync or asks to reset, type `y` to confirm reset on the dev branch.

- [ ] **Step 2: Generate the client explicitly**

```bash
npx prisma generate
```

Expected: `✔ Generated Prisma Client (vX.X.X) to ./src/lib/generated/prisma`

- [ ] **Step 3: Verify migration status**

```bash
npx prisma migrate status
```

Expected: `All migrations have been applied.` (no pending migrations)

- [ ] **Step 4: Verify the build still passes**

```bash
npm run build
```

Expected: Build completes with no errors. If TypeScript errors appear about the generated client not existing, ensure `prisma generate` ran successfully first.

- [ ] **Step 5: Commit the migration**

```bash
git add prisma/migrations/
git commit -m "feat(db): add initial database migration"
```

---

## Task 7: Merge and close branch

- [ ] **Step 1: Confirm build passes one final time**

```bash
npm run build
```

- [ ] **Step 2: Ask user to review and approve merge**

Show the user the diff with `git diff main` and wait for approval before merging.

- [ ] **Step 3: Merge to main**

```bash
git checkout main
git merge feature/database-setup
```

- [ ] **Step 4: Delete branch**

```bash
git branch -d feature/database-setup
```

- [ ] **Step 5: Update context/current-feature.md**

Mark status as **Completed** and add to History:

```
- Prisma + Neon PostgreSQL Setup — Prisma 7 with @prisma/adapter-neon; full schema (User, Item, ItemType, Collection, ItemCollection, Tag, ItemTag + NextAuth models); initial migration applied to dev branch; build passing
```
