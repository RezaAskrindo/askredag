"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useSession } from "next-auth/react";
import { BookOpen } from "lucide-react";
import { useCMSStore } from "@/stores/cms-store-provider"
import { groupArrayByKey } from "@/lib/groupByKey"
import { CMSItem } from "@/stores/cms-store"

const user = {
  name: "Muhammad Reza",
  email: "muhammadreza@askrindo.co.id",
  avatar: "/1386.jpg",
};

function DataNavMainMap(DataCMSDashboard: CMSItem[]) {
  const groupNav = groupArrayByKey(DataCMSDashboard, "role");
  
  const groupNavRes = Object.keys(groupNav).map((key) => {
    const filterNav = DataCMSDashboard.filter((item) => item.role === key);
    const groupSubNav = groupArrayByKey(filterNav, "page");
    const items = Object.keys(groupSubNav).map((subKey) => {
      const subItems = groupSubNav[subKey];
      return{
        title: subKey,
        url: `/dashboard?page=${subKey}&type_page=${subItems[0].type_page}&role=${subItems[0].role}`,
      }}
    );
    return {
      title: key,
      url: "#",
      icon: BookOpen,
      items: items,
    }
  });

  return groupNavRes;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const items = useCMSStore((state) => state.items)

  const navMainCms = React.useMemo(
    () => DataNavMainMap(items),
    [items]
  );
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <span className="text-base font-semibold">PT ASKRINDO</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainCms} />
      </SidebarContent>
      <SidebarFooter>
        { session && <NavUser user={{
          name: session.user?.name || user.name,
          email: session.user?.email || user.email,
          avatar: session.user?.image || user.avatar,
        }} /> }
      </SidebarFooter>
    </Sidebar>
  )
}
