"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <div className="flex h-12 flex-1 items-center gap-2 px-2 group-data-[collapsible=icon]:hidden">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-2xl">
                Lynx AI
              </span>
            </div>
          </div>
          <SidebarTrigger className="h-8 w-8 group-data-[collapsible=icon]:m-0" />
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
