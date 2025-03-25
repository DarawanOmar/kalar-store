"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { completeSale, completeSaleType, SaleInvoiceItem } from "../../_type";
import { toast } from "sonner";
import { completeSaleInvoiceAction } from "../../_actions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LuLoaderCircle } from "react-icons/lu";
import { MdDoneOutline } from "react-icons/md";
import Title from "@/components/reuseable/title";
import { FileText } from "lucide-react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import TotalShown from "@/components/reuseable/total-shown";
import { TextField } from "@/components/reuseable/input-form-reusable";
import { cn } from "@/lib/utils";

function CompleteSale({
  total,
  type,
}: {
  type: "loan" | "cash";
  total: number;
}) {
  const router = useRouter();
  const [pendding, setPenddingComplete] = useTransition();
  const [invoice_id, setInvoice_Id] = useQueryState("invoice_id", {
    clearOnDefault: true,
    defaultValue: "",
    shallow: false,
  });
  const form = useForm<completeSaleType>({
    resolver: zodResolver(completeSale),
    defaultValues: {
      discount: 0,
      paid_amount: 0,
    },
  });

  function onSubmit(values: completeSaleType) {
    if (!invoice_id)
      return toast.error(" تکایە پسوڵەکە دیاری بکە یان دانەیەک دروست بکە");
    setPenddingComplete(async () => {
      const result = await completeSaleInvoiceAction(
        Number(invoice_id),
        values.discount as number,
        values.paid_amount as number
      );
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        form.reset();
        setInvoice_Id("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="sm:px-6">
        <Title
          icon={<FileText size={18} />}
          text="تەواوکردنی فرۆشتن"
          className="mt-14 mb-5"
        />
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-3 gap-5 items-end md:max-w-max",
            {
              "sm:grid-cols-4": type === "loan",
            }
          )}
        >
          <TextField
            control={form.control}
            name="discount"
            placeholder="داشکاندن"
          />
          {type === "loan" ? (
            <TextField
              control={form.control}
              name="paid_amount"
              placeholder="پارە بۆ دانەوە"
            />
          ) : null}
          <TotalShown text="کۆی گشتی" total={total || 0} />
          <Button type="submit" variant={"gooeyRight"} className="flex gap-1">
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : (
              <MdDoneOutline />
            )}
            فرۆشتن
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CompleteSale;
