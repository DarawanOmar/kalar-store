"use client";

import * as React from "react";
import { ChevronsUpDown, MonitorCog } from "lucide-react";
import dara from "@/public/dara.jpg";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/utils/cookies";
import CustomDialog from "../reuseable/resusable-dialog";
import Link from "next/link";

export function TeamSwitcher({ isName }: { isName: boolean }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { open } = useSidebar();
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    image: null,
  });
  React.useEffect(() => {
    const fetch = async () => {
      const user = await getSession();
      const spilt = user.token.split(",between,");
      setUser({
        name: spilt[0],
        email: spilt[1],
        image: spilt[2] == "null" ? null : spilt[2],
      });
    };
    fetch();
  }, []);
  const handleOpenDialog = () => {
    setOpenDialog((prev) => !prev);
  };
  return (
    <>
      <SidebarMenuButton
        onClick={handleOpenDialog}
        size="lg"
        className="data-[state=open]:bg-primary data-[state=open]:text-sidebar-accent-foreground flex items-center"
      >
        <div
          className={cn(
            "flex aspect-square h-[36px] w-[36px] items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground",
            {
              "size-8": !open,
            }
          )}
        >
          {isName ? (
            <Image
              // src={"/logo.jpg"}
              src={!user.image ? "/logo.jpg" : user.image}
              alt="Kalar-Store"
              height={50}
              width={50}
              className={cn(
                "rounded-full object-cover object-top h-[36px] w-[36px]",
                {
                  "h-[30px] w-[30px]": !open,
                }
              )}
            />
          ) : (
            <Image
              src="/logo.jpg"
              alt="Kalar-Store"
              height={70}
              width={70}
              className="rounded-full"
            />
          )}
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
              {isName ? user.email : "داشبۆڕد سیستەم"}
            </span>
          )}
        </div>
        <MonitorCog className="mr-auto " />
      </SidebarMenuButton>
      <CustomDialog
        classContent="max-w-2xl bg-gradient-to-tr from-[#6e2c2a]/20 via-[#6e2c2a]/50 to-[#6e2c2a]/20 dark:bg-gradient-to-tr from-[#6e2c2a]/5 via-[#6e2c2a]/50 to-[#6e2c2a]/5"
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Darawan Omar"
        isWithouTrigger
      >
        <div className="flex flex-col justify-center items-center  rounded-lg p-4">
          <Image
            src={dara}
            alt="Kalar-Store"
            height={600}
            width={600}
            quality={100}
            className="h-44 w-44 object-cover object-top rounded-full"
          />
        </div>
        <p className="dark:text-muted-foreground text-center text-sm max-w-lg mx-auto mt-4 leading-6">
          Developed by <span className="text-white ">Darawa Omar</span> a Full
          Stack Web Developer who loves to build web applications and System
          management
        </p>
        <p className="text-center mt-3 text-xs dark:text-muted-foreground">
          You can Visit my portfolio to see more of my projects{" "}
          <Link
            target="_blank"
            href={"https://darawanomar.vercel.app/"}
            className="text-white underline px-1"
          >
            My Website
          </Link>
        </p>
        <p className="text-center mt-3 text-xs dark:text-muted-foreground">
          Contact me on WhatsApp{" "}
          <Link
            href="https://wa.me/9647512813327"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline"
          >
            My WhatsApp
          </Link>
        </p>
      </CustomDialog>
    </>
  );
}
