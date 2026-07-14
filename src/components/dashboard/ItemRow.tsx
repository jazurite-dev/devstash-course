import { Pin, Star } from "lucide-react";

import type { ItemCard } from "@/lib/db/items";
import { formatShortDate } from "@/lib/format";
import { typeIcons } from "@/lib/type-icons";
import { Badge } from "@/components/ui/badge";

export function ItemRow({ item }: { item: ItemCard }) {
  const Icon = typeIcons[item.type.icon] ?? typeIcons.Code;

  return (
    <div className="flex items-start gap-3 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4" style={{ color: item.type.color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="font-medium">{item.title}</span>
          {item.isPinned && (
            <Pin className="size-3.5 text-muted-foreground" />
          )}
          {item.isFavorite && (
            <Star className="size-3.5 fill-current text-yellow-500" />
          )}
        </div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
        {item.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {formatShortDate(item.createdAt)}
      </span>
    </div>
  );
}
