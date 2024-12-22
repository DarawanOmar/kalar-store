"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/utils/cookies";

export function TeamSwitcher({ isName }: { isName: boolean }) {
  const { open } = useSidebar();
  const [user, setUser] = React.useState({
    name: "",
    email: "",
  });
  React.useEffect(() => {
    const fetch = async () => {
      const user = await getSession();
      const spilt = user.token.split(",between,");
      setUser({
        name: spilt[0],
        email: spilt[1],
      });
    };
    fetch();
  }, []);
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
        {user.name == "" ? (
          <span className="h-3.5 bg-primary animate-pulse rounded-sm w-20  mb-1"></span>
        ) : (
          <span className="text-start">
            {isName ? user.name : "کەلار ستۆر"}
          </span>
        )}{" "}
        {user.email == "" ? (
          <span className="h-2 bg-primary animate-pulse rounded-sm w-32 "></span>
        ) : (
          <span className="truncate text-xs">
            {isName ? user.email : "داشبۆڕد سیستەم"}{" "}
          </span>
        )}
      </div>
      <ChevronsUpDown className="mr-auto" />
    </SidebarMenuButton>
  );
}
