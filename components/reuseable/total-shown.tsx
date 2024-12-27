import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  text: string;
  className?: string;
  total: number | string;
};

function TotalShown({ text = "کۆی گشتی", className, total }: Props) {
  return (
    <div className={cn("", className)}>
      <div
        className={cn(
          "bg-primary rounded-lg py-1 px-4 text-white flex flex-col items-center "
        )}
      >
        <span className="text-xs">{text}</span>
        {typeof total === "string" ? (
          <div className="text-xs ">{total}</div>
        ) : (
          <div className="flex gap-1 text-xs">
            <span>IQD</span>
            {Number(total).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

export default TotalShown;
