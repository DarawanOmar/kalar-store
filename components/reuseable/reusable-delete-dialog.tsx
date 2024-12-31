"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CustomDialog, { PropsCustomDialog } from "./resusable-dialog";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { LuLoaderCircle } from "react-icons/lu";
import { StopCircle, TrashIcon } from "lucide-react";

type DialogModalProps = {
  id: number;
  actionDelete: (
    id: number,
    options?: any
  ) => Promise<{ message: string; success: boolean }>;
  classButton?: string;
  title?: string;
  isDeActive?: boolean;
} & PropsCustomDialog;

function ReusableDeleteDailog({
  actionDelete,
  id,
  classButton,
  title = "دڵنیای لە سڕینەوەی فیلم!",
  isDeActive,
  ...props
}: DialogModalProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useTransition();
  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setPending(async () => {
      e.preventDefault();
      const res = await actionDelete(id);
      if (res.success) {
        toast.success(res.message);
        handleClose();
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };
  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      {...props}
      classContent="max-w-[433px] h-[293px] sm:rounded-xl p-0 "
      title=""
    >
      <div className="flex flex-col  justify-center items-center">
        {/* Trash Icon */}
        <div className="relative w-[70px] h-[70px] ">
          {/* Blue background with blur effect */}
          <div className="w-full h-full rounded-full bg-primary blur-md"></div>
          {/* Centered Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isDeActive ? (
              <StopCircle className="text-white" />
            ) : (
              <TrashIcon className="text-white" />
            )}
          </div>
        </div>

        {/*  Title*/}
        <div className="text-xl my-7 font-sirwan_meduim ">{title}</div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-between items-center gap-10  w-full px-10"
      >
        <Button
          type="submit"
          variant={"gooeyLeft"}
          className="gradient-blue-left text-lg w-full py-[23px] "
        >
          {pending ? (
            <LuLoaderCircle className="animate-spin transition-all duration-500" />
          ) : (
            "بەڵێ"
          )}
        </Button>
        <DialogClose asChild>
          <Button
            type="button"
            variant={"gooeyRight"}
            className="border border-dark_blue text-lg w-full py-[23px] "
          >
            نەخێر
          </Button>
        </DialogClose>
      </form>
    </CustomDialog>
  );
}

export default ReusableDeleteDailog;
