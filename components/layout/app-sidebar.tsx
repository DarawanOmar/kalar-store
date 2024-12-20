"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "کەلار ستۆر",
    email: "kalarstore@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  projects: [
    {
      title: "داشبۆڕد",
      url: "/",
      icon: Frame,
      isActive: true,
    },
    {
      title: "بەرهەماکانمان",
      url: "/products",
      icon: Frame,
      isActive: true,
    },
    {
      title: "فرۆشتن",
      url: "/sale",
      icon: PieChart,
    },
    {
      title: "خەرجیەکان",
      url: "/expenses",
      icon: CreditCard,
    },
    {
      title: "پسووڵەکان",
      url: "/invoice",
      icon: SquareTerminal,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-background ">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="bg-background ">
        <NavMain items={data.projects} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
