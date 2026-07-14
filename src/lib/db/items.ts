import { prisma } from "@/lib/prisma";

export interface ItemCard {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  tags: string[];
  type: { id: string; icon: string; color: string };
}

const FALLBACK_COLOR = "#6b7280";
const RECENT_ITEMS_LIMIT = 10;

function toItemCard(item: {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  type: { id: string; icon: string | null; color: string | null };
  tags: { tag: { name: string } }[];
}): ItemCard {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt.toISOString(),
    tags: item.tags.map(({ tag }) => tag.name),
    type: {
      id: item.type.id,
      icon: item.type.icon ?? "Code",
      color: item.type.color ?? FALLBACK_COLOR,
    },
  };
}

export async function getPinnedItems(): Promise<ItemCard[]> {
  const rows = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { createdAt: "desc" },
    include: { type: true, tags: { include: { tag: true } } },
  });

  return rows.map(toItemCard);
}

export async function getRecentItems(limit = RECENT_ITEMS_LIMIT): Promise<ItemCard[]> {
  const rows = await prisma.item.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { type: true, tags: { include: { tag: true } } },
  });

  return rows.map(toItemCard);
}

export async function getItemStats() {
  const [total, favorites] = await Promise.all([
    prisma.item.count(),
    prisma.item.count({ where: { isFavorite: true } }),
  ]);

  return { total, favorites };
}
