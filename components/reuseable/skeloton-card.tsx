import React from "react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  height?: string;
  className?: string;
};

function SkelotonCard({ className, height = "h-96" }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 my-10",
        className
      )}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-5 border border-zinc-300/30 rounded-xl p-6 bg-background"
        >
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-2 w-20 rounded" />
              <Skeleton className="h-2 w-40 rounded" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className={cn("h-96 w-full rounded-lg", height)} />
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-2 w-20 rounded" />
              <Skeleton className="h-2 w-40 rounded" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkelotonCard;

export const SkelotonSelect = ({ className }: { className?: string }) => {
  return (
    <div className={cn("", className)}>
      <Skeleton className="h-[56px] w-[180px] rounded-3xl" />
    </div>
  );
};
