"use client";
import React, { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import { MdDoneOutline } from "react-icons/md";
import Title from "@/components/reuseable/title";
import { FileText } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import TotalShown from "@/components/reuseable/total-shown";
import { completeInvoiceAction } from "../../_actions";

function CompletePurchase({ total }: { total: number }) {
  const router = useRouter();
  const [pendding, setPenddingComplete] = useTransition();
  const [invoice_id, setInvoice_Id] = useQueryState("invoice_id", {
    clearOnDefault: true,
    defaultValue: "",
    shallow: false,
  });

  function onSubmit() {
    if (!invoice_id)
      return toast.error(" تکایە پسوڵەکە دیاری بکە یان دانەیەک دروست بکە");
    setPenddingComplete(async () => {
      const result = await completeInvoiceAction(Number(invoice_id));
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        setInvoice_Id("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="sm:px-6">
      <Title
        icon={<FileText size={18} />}
        text="تەواوکردنی کڕین"
        className="mt-14 mb-5"
      />
      <div className="grid grid-cols-2  gap-5 items-end max-w-md">
        <TotalShown text="کۆی گشتی" total={total} />
        <Button
          type="button"
          onClick={onSubmit}
          variant={"gooeyRight"}
          className="flex gap-1"
        >
          {pendding ? (
            <LuLoaderCircle className="animate-spin transition-all duration-500" />
          ) : (
            <MdDoneOutline />
          )}
          کڕین
        </Button>
      </div>
    </div>
  );
}

export default CompletePurchase;
