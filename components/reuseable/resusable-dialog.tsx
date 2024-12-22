import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import React from "react";
import { Button } from "../ui/button";
import { MdClose } from "react-icons/md";

export type PropsCustomDialog = {
  button?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  text_button?: string;
  isFreshButtonPass?: boolean;
  classContent?: string;
  title?: string;
  closeButton?: boolean;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

function CustomDialog({
  icon,
  className,
  button,
  isFreshButtonPass,
  classContent,
  text_button,
  title = "زیادکردنی فیلم",
  closeButton = false,
  ...props
}: PropsCustomDialog) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        {isFreshButtonPass ? (
          <div>{button}</div>
        ) : (
          <Button
            variant={"gooeyRight"}
            className={cn(
              "flex items-center gap-2 gradient-blue px-4 py-2 rounded-xl cursor-pointer font-sirwan_reguler ",
              className
            )}
          >
            {icon}
            <span>{text_button}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          "font-sirwan_reguler max-w-4xl w-full overflow-x-hidden overflow-y-scroll  max-h-[95%] border-none ",
          classContent
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-sirwan_reguler text-[25px]">
            {title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {closeButton && (
          <DialogClose className="z-10 cursor-pointer" asChild>
            <div
              about="close button modal"
              className={cn(
                "flex items-center justify-center absolute top-4 size-7 start-5 bg-dark_gray rounded-full"
              )}
            >
              <MdClose className="size-4 p-1 text-dark_blue w-full h-full" />
            </div>
          </DialogClose>
        )}
        <div className="">{props.children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomDialog;
