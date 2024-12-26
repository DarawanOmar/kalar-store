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
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
import { deleteEmptySaleInvoice } from "../_actions";
import { SaleInvoice } from "../_type";

type Props = {
  unFinishInvoice: SaleInvoice[];
};

function GetAllSaleinvoice({ unFinishInvoice }: Props) {
  const [pendding, setPendding] = useTransition();
  const [name, setName] = useQueryState("invoice_id", {
    clearOnDefault: true,
    defaultValue: "",
    shallow: false,
  });

  const deleteInvoice = () => {
    setPendding(async () => {
      const invoice_id = Number(name);
      const result = await deleteEmptySaleInvoice(invoice_id);
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
        className="rounded-md hover:bg-red-500 hover:text-white transition-all duration-500 w-16 border border-soft_red text-red-500"
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
          if (e === "0") {
            setName("");
            return;
          }
          setName(e);
        }}
        value={name}
      >
        <SelectTrigger className="rounded-md">
          <SelectValue placeholder="پسوڵە" />
        </SelectTrigger>
        <SelectContent className="min-w-max max-w-max">
          {unFinishInvoice.length === 0 ? (
            <div className="p-2 text-red-500 text-xs font-sirwan_meduim ">
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

export default GetAllSaleinvoice;
