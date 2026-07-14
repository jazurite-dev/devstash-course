import { getRecentItems } from "@/lib/db/items";
import { ItemRow } from "@/components/dashboard/ItemRow";

export async function RecentItems() {
  const recentItems = await getRecentItems();

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Recent Items</h2>
      <div className="divide-y divide-border rounded-lg border border-border">
        {recentItems.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
