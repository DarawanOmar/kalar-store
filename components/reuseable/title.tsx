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
        "text-primary font-normal  flex gap-1 items-center  border-b-2 border-primary max-w-max pb-1",
        className
      )}
    >
      {icon}
      {text}
    </p>
  );
}

export default Title;
