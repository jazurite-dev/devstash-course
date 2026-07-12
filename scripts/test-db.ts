import "dotenv/config";
import { PrismaClient } from "../src/lib/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [userCount, itemTypeCount, collectionCount, itemCount, tagCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.itemType.count(),
      prisma.collection.count(),
      prisma.item.count(),
      prisma.tag.count(),
    ]);

  console.log("── Counts ──────────────────────────────");
  console.log(`Users:       ${userCount}`);
  console.log(`Item types:  ${itemTypeCount}`);
  console.log(`Collections: ${collectionCount}`);
  console.log(`Items:       ${itemCount}`);
  console.log(`Tags:        ${tagCount}`);

  const itemTypes = await prisma.itemType.findMany({
    select: { name: true, color: true, icon: true, isSystem: true },
    orderBy: { name: "asc" },
  });

  console.log("\n── Item types ──────────────────────────");
  for (const t of itemTypes) {
    console.log(`  ${t.isSystem ? "[system]" : "[custom]"} ${t.name.padEnd(10)} ${t.color}  ${t.icon}`);
  }

  const collections = await prisma.collection.findMany({
    select: {
      name: true,
      _count: { select: { items: true } },
    },
    orderBy: { name: "asc" },
  });

  console.log("\n── Collections ─────────────────────────");
  for (const c of collections) {
    console.log(`  ${c.name.padEnd(24)} ${c._count.items} items`);
  }

  const user = await prisma.user.findFirst({
    select: { email: true, name: true, isPro: true, createdAt: true },
  });

  if (user) {
    console.log("\n── Demo user ───────────────────────────");
    console.log(`  Email:   ${user.email}`);
    console.log(`  Name:    ${user.name}`);
    console.log(`  Pro:     ${user.isPro}`);
    console.log(`  Created: ${user.createdAt.toISOString()}`);
  }

  console.log("\n✓ Database connection verified");
}

main()
  .catch((e) => {
    console.error("✗ Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
