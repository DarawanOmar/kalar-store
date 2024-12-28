import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import ToggleMode from "@/components/layout/toggle-mode";
import TitlePage from "@/components/layout/title-page";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import QueryClientProviderWrapper from "@/providers/query_provider_wrapper";

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
    <QueryClientProviderWrapper>
      <SidebarProvider>
        <AppSidebar side="right" />
        <main className="w-full px-2 sm:px-4 py-2">
          <div className="w-full flex  justify-between items-center ">
            <SidebarTrigger />
            <TitlePage />
            <ToggleMode />
          </div>
          <div
            className={cn(
              `${sirwan_reguler.variable}  ${sirwan_bold.variable} ${sirwan_light.variable} ${sirwan_meduim.variable}  max-sm:px-2`
            )}
          >
            <NuqsAdapter>{children}</NuqsAdapter>
          </div>
        </main>
      </SidebarProvider>
    </QueryClientProviderWrapper>
  );
}
