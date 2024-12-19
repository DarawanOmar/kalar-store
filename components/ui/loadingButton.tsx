import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "./button";
import { LuLoaderCircle } from "react-icons/lu";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={"gooeyRight"}
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading ? (
        <LuLoaderCircle className="size-5 animate-spin" />
      ) : (
        props.children
      )}
    </Button>
  );
}
