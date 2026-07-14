import { Folder, Heart, LayoutGrid, Star } from "lucide-react";

import { getCollectionStats } from "@/lib/db/collections";
import { getItemStats } from "@/lib/db/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function StatsCards() {
  const [itemStats, collectionStats] = await Promise.all([
    getItemStats(),
    getCollectionStats(),
  ]);

  const stats = [
    { label: "Items", value: itemStats.total, icon: LayoutGrid },
    { label: "Collections", value: collectionStats.total, icon: Folder },
    { label: "Favorite Items", value: itemStats.favorites, icon: Heart },
    { label: "Favorite Collections", value: collectionStats.favorites, icon: Star },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-semibold">{stat.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
