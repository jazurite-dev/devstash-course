import { items, itemTypes } from "@/lib/mock-data";
import { ItemRow } from "@/components/dashboard/ItemRow";

const RECENT_ITEMS_LIMIT = 10;

export function RecentItems() {
  const recentItems = [...items]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, RECENT_ITEMS_LIMIT);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Recent Items</h2>
      <div className="divide-y divide-border rounded-lg border border-border">
        {recentItems.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            type={itemTypes.find((type) => type.id === item.typeId)}
          />
        ))}
      </div>
    </section>
  );
}
