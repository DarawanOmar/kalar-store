"use client";
import { Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

function TitlePage() {
  const pathname = usePathname();
  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg text-primary font-sirwan_meduim">
        {titleName(pathname)}
      </h1>
    </div>
  );
}

export default TitlePage;

function titleName(path: string) {
  switch (path) {
    case "/":
      return "ماڵەوە";
    case "/products":
      return "بەرهەمەکان";
    case "/purchase":
      return "کڕین";
    case "/sale":
      return "فرۆشتن";
    case "/expenses":
      return "خەرجیەکان";
    case "/sale-invoice":
      return "پسوولەی فرۆشراوەکان";
    case "/purchase-invoice":
      return "پسوولەی کڕدراوەکان";
    default:
      return "Page not found";
  }
}
