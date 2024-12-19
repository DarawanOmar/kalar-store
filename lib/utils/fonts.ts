import LocalFont from "next/font/local";
import { Poppins } from "next/font/google";

export const unisirwan = LocalFont({
  src: [
    {
      path: "../../public/fonts/uniSIRWAN_Regular.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/fonts/uniSIRWAN_Bold.ttf",
      style: "bold",
      weight: "700",
    },
  ],
  variable: "--font-unisirwan",
  display: "swap",
  preload: true,
});

export const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
  fallback: ["sans-serif"],
});
