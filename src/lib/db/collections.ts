import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export interface CollectionCard {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  borderColor: string;
  types: { id: string; icon: string; color: string }[];
}

const FALLBACK_COLOR = "#6b7280";
const RECENT_COLLECTIONS_LIMIT = 6;

const collectionInclude = {
  items: {
    include: {
      item: {
        include: { type: true },
      },
    },
  },
} as const;

type CollectionRow = Prisma.CollectionGetPayload<{ include: typeof collectionInclude }>;

function toCollectionCard(col: CollectionRow): CollectionCard {
  const typeCounts = new Map<string, { id: string; icon: string; color: string; count: number }>();

  for (const { item } of col.items) {
    const t = item.type;
    const entry = typeCounts.get(t.id);
    if (entry) {
      entry.count++;
    } else {
      typeCounts.set(t.id, {
        id: t.id,
        icon: t.icon ?? "Code",
        color: t.color ?? FALLBACK_COLOR,
        count: 1,
      });
    }
  }

  let borderColor = FALLBACK_COLOR;
  let maxCount = 0;
  for (const entry of typeCounts.values()) {
    if (entry.count > maxCount) {
      maxCount = entry.count;
      borderColor = entry.color;
    }
  }

  return {
    id: col.id,
    name: col.name,
    description: col.description,
    isFavorite: col.isFavorite,
    itemCount: col.items.length,
    borderColor,
    types: [...typeCounts.values()].map(({ id, icon, color }) => ({ id, icon, color })),
  };
}

export async function getRecentCollections(limit = RECENT_COLLECTIONS_LIMIT): Promise<CollectionCard[]> {
  const rows = await prisma.collection.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: collectionInclude,
  });

  return rows.map(toCollectionCard);
}

export async function getFavoriteCollections(): Promise<CollectionCard[]> {
  const rows = await prisma.collection.findMany({
    where: { isFavorite: true },
    orderBy: { createdAt: "desc" },
    include: collectionInclude,
  });

  return rows.map(toCollectionCard);
}

export async function getRecentNonFavoriteCollections(limit = RECENT_COLLECTIONS_LIMIT): Promise<CollectionCard[]> {
  const rows = await prisma.collection.findMany({
    where: { isFavorite: false },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: collectionInclude,
  });

  return rows.map(toCollectionCard);
}

export async function getCollectionStats() {
  const [total, favorites] = await Promise.all([
    prisma.collection.count(),
    prisma.collection.count({ where: { isFavorite: true } }),
  ]);

  return { total, favorites };
}
