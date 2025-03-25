"use client";

import React from "react";
import { CircleDollarSign, Plus } from "lucide-react";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import PayForm from "./pay-form";

export type PropsPay = {
  info: {
    id: number;
    totalAmount: number;
    lastPaymentAmount: number;
    lastPaymentDate: Date;
    remainingAmount: number;
  };
};

function ModalPayForm({ info }: PropsPay) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      classContent="max-w-lg"
      icon={<CircleDollarSign size={19} strokeWidth={1.5} />}
      text_button="پارەدان"
      title="پارەدان"
      className="max-sm:text-sm max-sm:max-w-w-full"
    >
      <PayForm handleClose={handleClose} info={info} />
    </CustomDialog>
  );
}

export default ModalPayForm;
