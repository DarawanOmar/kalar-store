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

export const metadata: Metadata = {
  title: {
    default: "Kalar Store",
    template: "%s - Kalar Store",
  },
  description:
    "Kalar Store is a place where you can find all the products you need.",
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: (process.env.NEXT_PUBLIC_BASE_URL as string) || "",
    siteName: "Kalar Store",
  },
  metadataBase: new URL((process.env.NEXT_PUBLIC_BASE_URL as string) || ""),
  manifest: "/manifest.json",
};
