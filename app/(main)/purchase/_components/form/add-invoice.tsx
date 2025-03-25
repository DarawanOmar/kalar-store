"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { addInvoice, addInvoiceType } from "../../_type";
import { CheckCheck } from "lucide-react";
import { addInvoiceAction } from "../../_actions";

import { TextField } from "@/components/reuseable/input-form-reusable";

type Props = {
  invoice: {
    invoice_number: string;
    name: string;
    place: string;
    note: string;
  };
};

export default function Addinvoice({ invoice }: Props) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addInvoiceType>({
    resolver: zodResolver(addInvoice),
    defaultValues: getDefaultValues(invoice),
  });

  function onSubmit(values: addInvoiceType) {
    setPendding(async () => {
      const result = await addInvoiceAction(values);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5 items-end">
          {Object.entries(form.getValues()).map(([key, value]) => {
            return (
              <TextField
                control={form.control}
                key={key}
                name={key}
                // label={labelTranslate(key)}
                placeholder={labelTranslate(key)}
              />
            );
          })}
          <Button type="submit" variant={"gooeyRight"} className="flex gap-1">
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : (
              <CheckCheck size={18} />
            )}
            تۆمارکردن
          </Button>
        </div>
        <p className="text-muted-foreground font-normal my-5 text-sm">
          سەرەتا پسووڵە دروست بکە ئینجا بەرهەمەکە داخڵ بکە
        </p>
      </form>
    </Form>
  );
}

const getDefaultValues = (values: Partial<addInvoiceType> = {}) => {
  const defaultValues: addInvoiceType = {
    invoice_number: "",
    name: "",
    place: "",
    type: "Cash",
    note: "",
  };

  return { ...defaultValues, ...values };
};

function labelTranslate(name: string) {
  switch (name) {
    case "name":
      return "ناو";
    case "note":
      return "تێبینی";
    case "invoice_number":
      return "ژمارەی پسووڵە";
    case "place":
      return "شوێن";
    case "type":
      return "پارەدان";
    case "type":
      return "پارەدان";
    default:
      return name;
  }
}
