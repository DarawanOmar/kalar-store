"use client";
import * as React from "react";
import {
  Banknote,
  Bot,
  ChartBar,
  CreditCard,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  PieChart,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  SquarePercent,
} from "lucide-react";
import { NavMain } from "@/components/layout/nav-main";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-background ">
        <TeamSwitcher isName={false} />
      </SidebarHeader>
      <SidebarContent className="bg-background ">
        <NavMain items={data.projects} />
      </SidebarContent>
      <SidebarFooter className="bg-background ">
        <TeamSwitcher isName />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
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
      title: "بەرهەماکانمان",
      url: "/products",
      icon: ShoppingBasket,
      isActive: true,
    },
    {
      title: "بەرهەمە سڕاوەکان",
      url: "/trash-products",
      icon: Frame,
      isActive: true,
    },
    {
      title: "خەرجیەکان",
      url: "/expenses",
      icon: CreditCard,
    },
    {
      title: "قەرزەکان",
      url: "/loans",
      icon: Banknote,
    },

    {
      title: "ڕاپۆرتەکان",
      url: "/report",
      icon: ChartBar,
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
