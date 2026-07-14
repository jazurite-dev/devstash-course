import { getPinnedItems } from "@/lib/db/items";
import { ItemRow } from "@/components/dashboard/ItemRow";

export async function PinnedItems() {
  const pinnedItems = await getPinnedItems();

  if (pinnedItems.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Pinned</h2>
      <div className="divide-y divide-border rounded-lg border border-border">
        {pinnedItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
