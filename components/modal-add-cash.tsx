"use client";

import React from "react";
import { Edit, Plus } from "lucide-react";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import AddCashForm from "./form-add-cash";

function ModalAddCash({ isMain }: { isMain: boolean }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      isFreshButtonPass
      button={<Edit size={17} className="hover:text-primary cursor-pointer" />}
      classContent="max-w-md"
      title="گۆڕانکاری قاسە"
    >
      <AddCashForm isMain={isMain} handleClose={handleClose} />
    </CustomDialog>
  );
}

export default ModalAddCash;
