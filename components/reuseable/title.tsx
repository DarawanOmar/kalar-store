import { cn } from "@/lib/utils";
import { FileText, LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  text: string;
  icon: React.ReactNode;
  className?: string;
};

function Title({
  text = "داخڵکردنی بەرهەم",
  icon = <FileText size={18} />,
  className,
}: Props) {
  return (
    <p
      className={cn(
        "text-soft_primary font-normal max-sm:text-sm flex gap-1 items-center  border-b-2 border-soft_primary max-w-max pb-1",
        className
      )}
    >
      {icon}
      {text}
    </p>
  );
}

export default Title;
