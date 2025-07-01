"use client";

import * as React from "react";
import { MonitorCog, UsersRound } from "lucide-react";
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
        {isName ? (
          <UsersRound className="mr-auto " />
        ) : (
          <MonitorCog className="mr-auto " />
        )}
      </SidebarMenuButton>
      <CustomDialog
        classContent="max-w-2xl bg-gradient-to-tr from-[#6e2c2a]/20 via-[#6e2c2a]/50 to-[#6e2c2a]/20 dark:bg-gradient-to-tr from-[#6e2c2a]/5 via-[#6e2c2a]/50 to-[#6e2c2a]/5"
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Darawan Omar"
        isWithouTrigger
      >
        <MeInfo />
      </CustomDialog>
    </>
  );
}

const MeInfo = () => {
  return (
    <div className="relative overflow-hidden ">
      {/* Animated Background Balls */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-spin"></div>
        <div className="absolute top-20 right-16 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-16 left-20 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-25 animate-spin duration-1000"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl opacity-35 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-20 animatebounce delay-700"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 backdrop-blur-sm bg-white/15 dark:bg-black/10 rounded-2xl border-white/10 p-8 mx-4 my-6 ">
        {/* Profile Image Container */}
        <div className="flex flex-col justify-center items-center mb-6 ">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full blur-md opacity-100 animate-pulse"></div>
            <Image
              src={"/dara.jpg"}
              alt="Kalar-Store"
              height={600}
              width={600}
              quality={100}
              className="relative h-32 w-32 object-cover object-top rounded-full border-4 border-white/20 shadow-2xl"
            />
          </div>
        </div>

        {/* Developer Info */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Darawan Omar
          </h3>

          <p className="text-gray-300 dark:text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Full Stack Web Developer passionate about building innovative web
            applications and system management solutions
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
            <Link
              target="_blank"
              href={"https://darawanomar.vercel.app/"}
              className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white transition duration-500 ease-out border-2 border-purple-500 rounded-full shadow-md hover:shadow-lg"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 -translate-x-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-500 transform group-hover:translate-x-full ease text-sm">
                Visit Portfolio
              </span>
              <span className="relative invisible text-sm">
                Visit Portfolio
              </span>
            </Link>

            <Link
              href="https://wa.me/9647512813327"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white transition duration-500 ease-out border-2 border-green-500 rounded-full shadow-md hover:shadow-lg"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-500 -translate-x-full bg-gradient-to-r from-green-500 to-emerald-500 group-hover:translate-x-0 ease">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-green-500 transition-all duration-500 transform group-hover:translate-x-full ease text-sm">
                WhatsApp
              </span>
              <span className="relative invisible text-sm">WhatsApp</span>
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 opacity-75">
            Crafted with ❤️ for modern web experiences
          </p>
        </div>
      </div>
    </div>
  );
};
