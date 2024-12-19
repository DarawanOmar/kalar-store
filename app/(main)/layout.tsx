import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import ToggleMode from "@/components/layout/toggle-mode";

export const sirwan_reguler = localFont({
  src: "./fonts/UniSIRWAN Expo Regular.ttf",
  variable: "--font-sirwan-reguler",
});
export const sirwan_meduim = localFont({
  src: "./fonts/UniSIRWAN Expo Medium.ttf",
  variable: "--font-sirwan-meduim",
});
export const sirwan_light = localFont({
  src: "./fonts/UniSIRWAN Expo Light.ttf",
  variable: "--font-sirwan-light",
});
export const sirwan_bold = localFont({
  src: "./fonts/UniSIRWAN Expo Bold.ttf",
  variable: "--font-sirwan-bold",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar side="right" />
      <main className="w-full mx-4 my-2">
        <div className="w-full flex  justify-between items-center ">
          <SidebarTrigger />
          <ToggleMode />
        </div>
        <div
          className={cn(
            `${sirwan_reguler.variable}  ${sirwan_bold.variable} ${sirwan_light.variable} ${sirwan_meduim.variable}  `
          )}
        >
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
