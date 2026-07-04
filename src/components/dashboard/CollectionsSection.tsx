import Link from "next/link";
import { Star } from "lucide-react";

import { collections, items, itemTypes } from "@/lib/mock-data";
import { typeIcons } from "@/lib/type-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RECENT_COLLECTIONS_LIMIT = 6;

export function CollectionsSection() {
  const recentCollections = collections.slice(0, RECENT_COLLECTIONS_LIMIT);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Collections</h2>
        <Link
          href="/collections"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View all
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentCollections.map((collection) => {
          const collectionTypeIds = new Set(
            items
              .filter((item) => item.collectionIds.includes(collection.id))
              .map((item) => item.typeId)
          );
          const badgeTypes = itemTypes.filter((type) =>
            collectionTypeIds.has(type.id)
          );

          return (
            <Card
              key={collection.id}
              className="border-l-4"
              style={{ borderLeftColor: collection.color }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  {collection.name}
                  {collection.isFavorite && (
                    <Star className="size-3.5 fill-current text-yellow-500" />
                  )}
                </CardTitle>
                <CardDescription>{collection.itemCount} items</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>
                <div className="flex gap-1.5">
                  {badgeTypes.map((type) => {
                    const Icon = typeIcons[type.icon] ?? typeIcons.Code;
                    return (
                      <Icon
                        key={type.id}
                        className="size-4"
                        style={{ color: type.color }}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
