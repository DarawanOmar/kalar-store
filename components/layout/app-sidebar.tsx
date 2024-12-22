"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  PieChart,
  Settings2,
  ShoppingBag,
  ShoppingCart,
  SquarePercent,
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
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "بەرهەماکانمان",
      url: "/products",
      icon: Frame,
      isActive: true,
    },
    {
      title: "کڕین",
      url: "/purchase",
      icon: ShoppingBag,
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
      title: "پسووڵە فرۆشراوەکان",
      url: "/sale-invoice",
      icon: SquarePercent,
    },
    {
      title: "پسووڵە کڕدراوەکان",
      url: "/purchase-invoice",
      icon: ShoppingCart,
    },
    {
      title: "بەکارهێنەرەکان",
      url: "/users",
      icon: Bot,
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

      <SidebarRail />
    </Sidebar>
  );
}
