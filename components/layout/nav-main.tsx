"use client";

import { LogOut, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { logout } from "@/lib/utils/cookies";
import { LuLoaderCircle } from "react-icons/lu";
import { Button } from "../ui/button";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  const pathName = usePathname();
  const [pendding, startTransition] = React.useTransition();
  const handleSignOut = () => {
    startTransition(async () => {
      logout();
    });
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>خزمەتگوزاریەکان</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Link href={item.url} key={item.title}>
            <SidebarMenuButton
              key={item.title}
              tooltip={item.title}
              className={cn(
                "py-[18px] hover:bg-soft_red hover:text-white  transition-all duration-500",
                {
                  "text-white bg-primary ": item.url === pathName,
                }
              )}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        ))}
        <SidebarMenuButton
          type="button"
          onClick={handleSignOut}
          tooltip="چوونەدەرەوە"
          className="py-[18px]   hover:bg-primary hover:text-white  transition-all duration-500"
        >
          {pendding ? (
            <LuLoaderCircle className="text-white animate-spin transition-all duration-500" />
          ) : (
            <LogOut />
          )}

          <span> چوونەدەرەوە</span>
        </SidebarMenuButton>
      </SidebarMenu>
    </SidebarGroup>
  );
}
