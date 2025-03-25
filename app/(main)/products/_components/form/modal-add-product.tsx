"use client";

import React from "react";
import { Plus } from "lucide-react";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import AddProduct from "./add-product";

function ModalAddProcut() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      classContent="max-w-3xl"
      icon={<Plus size={20} strokeWidth={2.5} className="max-sm:hidden" />}
      text_button="زیادکردنی کاڵا"
      title="زیادکردنی کاڵا"
      className="max-sm:text-sm max-sm:max-w-max"
    >
      <AddProduct handleClose={handleClose} />
    </CustomDialog>
  );
}

export default ModalAddProcut;
