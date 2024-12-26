"use client";
import React, { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Invoice } from "../_type";
import { useQueryState } from "nuqs";
import { deletePurchaseInvoiceAction } from "../_actions";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";

type Props = {
  unFinishInvoice: Invoice[];
};

function GetAllinvoice({ unFinishInvoice }: Props) {
  const [pendding, setPendding] = useTransition();
  const [name, setName] = useQueryState("invoice_id", {
    clearOnDefault: true,
    defaultValue: "",
    shallow: false,
  });

  const deleteInvoice = () => {
    const invoice_id = Number(name);
    if (!invoice_id) {
      return toast.error(" تکایە پسوڵەکە دیاری بکە یان دانەیەک دروست بکە");
    }
    setPendding(async () => {
      const result = await deletePurchaseInvoiceAction(invoice_id);
      if (result.success) {
        toast.success(result.message);
        setName("");
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={deleteInvoice}
        size={"icon"}
        variant={"outline"}
        className="rounded-lg hover:bg-red-500 hover:text-white text-red-500 transition-all duration-500  border border-soft_red w-16"
      >
        {pendding ? (
          <LuLoaderCircle className="animate-spin transition-all duration-500" />
        ) : (
          <Trash size={16} strokeWidth={2} />
        )}
      </Button>
      <Select
        dir="rtl"
        onValueChange={(e) => {
          setName(e);
        }}
        value={name}
      >
        <SelectTrigger className="rounded-lg">
          <SelectValue placeholder="پسوڵە" />
        </SelectTrigger>
        <SelectContent className="min-w-max max-w-max">
          {unFinishInvoice.length === 0 ? (
            <div className="p-2 text-red-500 text-xs font-sirwan_meduim">
              پسوڵە نییە
            </div>
          ) : (
            unFinishInvoice.map((invoice) => (
              <SelectItem key={invoice.id} value={invoice.id.toString()}>
                {invoice.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default GetAllinvoice;
