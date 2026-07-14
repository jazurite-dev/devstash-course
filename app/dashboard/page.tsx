export const dynamic = "force-dynamic";

import { CollectionsSection } from "@/components/dashboard/CollectionsSection";
import { PinnedItems } from "@/components/dashboard/PinnedItems";
import { RecentItems } from "@/components/dashboard/RecentItems";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
      <CollectionsSection />
      <PinnedItems />
      <RecentItems />
    </div>
  );
}
