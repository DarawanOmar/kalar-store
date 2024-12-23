import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Empty from "@/public/empty-data.svg";

function EmptyImage({
  height = 300,
  width = 300,
  className,
}: {
  height?: number;
  width?: number;
  className?: string;
}) {
  return (
    <Image
      src={Empty}
      alt="Empty"
      width={width}
      height={height}
      className={cn("mx-auto pt-20", className)}
    />
  );
}

export default EmptyImage;
