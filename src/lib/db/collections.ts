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

export async function getRecentCollections(limit = 6): Promise<CollectionCard[]> {
  const rows = await prisma.collection.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          item: {
            include: { type: true },
          },
        },
      },
    },
  });

  return rows.map((col) => {
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
  });
}
