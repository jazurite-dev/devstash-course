import { items, itemTypes } from "@/lib/mock-data";
import { ItemRow } from "@/components/dashboard/ItemRow";

export function PinnedItems() {
  const pinnedItems = items.filter((item) => item.isPinned);

  if (pinnedItems.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Pinned</h2>
      <div className="divide-y divide-border rounded-lg border border-border">
        {pinnedItems.map((item) => (
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
