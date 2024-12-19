import { cn } from "@/lib/utils";
import {
  sirwan_bold,
  sirwan_light,
  sirwan_meduim,
  sirwan_reguler,
} from "./(main)/layout";
import { ThemeProvider } from "@/providers/theme-providers";
import { Toaster } from "sonner";

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
