"use client";

import React from "react";
import { Plus } from "lucide-react";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import AddUser from "./add-user";

function ModalAddUser() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      classContent="max-w-md"
      icon={<Plus size={20} strokeWidth={2.5} className="max-sm:hidden" />}
      text_button="زیادکردنی بەکارهێنەر"
      title="زیادکردنی بەکارهێنەر"
      className="max-sm:text-xs max-sm:max-w-w-full"
    >
      <AddUser handleClose={handleClose} />
    </CustomDialog>
  );
}

export default ModalAddUser;
