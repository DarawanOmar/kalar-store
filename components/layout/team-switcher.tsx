"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  const { open } = useSidebar();
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-primary data-[state=open]:text-sidebar-accent-foreground "
    >
      <div
        className={cn(
          "flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
          {
            "size-8": !open,
          }
        )}
      >
        <Image
          src={"/logo.jpg"}
          alt="Kalar-Store"
          height={70}
          width={70}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-start">کەلار ستۆر</span>
        <span className="truncate text-xs">داشبۆڕد سیستەم </span>
      </div>
      <ChevronsUpDown className="mr-auto" />
    </SidebarMenuButton>
  );
}
