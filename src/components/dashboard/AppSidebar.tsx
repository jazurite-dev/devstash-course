import Link from "next/link";
import { Settings } from "lucide-react";

import { collections, currentUser, itemTypes } from "@/lib/mock-data";
import { typeIcons } from "@/lib/type-icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const RECENT_COLLECTIONS_LIMIT = 5;

export function AppSidebar() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections
    .filter((c) => !c.isFavorite)
    .slice(0, RECENT_COLLECTIONS_LIMIT);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = typeIcons[type.icon] ?? typeIcons.Code;
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      tooltip={type.name}
                      render={<Link href={`/items/${type.slug}`} />}
                    >
                      <Icon style={{ color: type.color }} />
                      <span>{type.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{type.itemCount}</SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteCollections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton tooltip={collection.name}>
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: collection.color }}
                    />
                    <span>{collection.name}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentCollections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton tooltip={collection.name}>
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: collection.color }}
                    />
                    <span>{collection.name}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar size="sm">
                <AvatarFallback>
                  {currentUser.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">
                  {currentUser.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
              <Settings className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
