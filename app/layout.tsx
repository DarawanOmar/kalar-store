import { cn } from "@/lib/utils";
import {
  sirwan_bold,
  sirwan_light,
  sirwan_meduim,
  sirwan_reguler,
} from "./(main)/layout";
import { ThemeProvider } from "@/providers/theme-providers";
import { Toaster } from "sonner";
import { Metadata } from "next";

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
    url: "https://kalar-store.vercel.app",
    siteName: "Kalar Store",
  },
  metadataBase: new URL("https://kalar-store.vercel.app"),
  manifest: "/manifest.json",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"en"} suppressHydrationWarning dir="rtl">
      <body
        className={cn(
          `${sirwan_reguler.variable}  ${sirwan_bold.variable} ${sirwan_light.variable} ${sirwan_meduim.variable} font-sirwan_meduim `,
          {
            "debug-screens": process.env.NODE_ENV === "development",
          }
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>
            {children}
            <Toaster dir="rtl" className="font-sirwan_meduim" />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
