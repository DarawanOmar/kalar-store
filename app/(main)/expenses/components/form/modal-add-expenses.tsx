"use client";

import React from "react";
import { Plus } from "lucide-react";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import AddExpenses from "./add-expenses";

function ModalAddExpenses() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      classContent="max-w-md"
      icon={<Plus size={20} strokeWidth={2.5} />}
      text_button="زیادکردنی خەرجی"
      title="زیادکردنی خەرجی"
      className="max-sm:text-sm max-sm:max-w-max"
    >
      <AddExpenses handleClose={handleClose} />
    </CustomDialog>
  );
}

export default ModalAddExpenses;
