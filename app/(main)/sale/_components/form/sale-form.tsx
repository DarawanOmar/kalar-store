"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { CheckCheck } from "lucide-react";
import { addSale, addSaleType } from "../../_type";
import { createSaleInvoice } from "../../_actions";
import { TextField } from "@/components/reuseable/input-form-reusable";
import { SelectField } from "@/components/reuseable/select-form-field";

type Props = {
  info: Partial<addSaleType>;
};

export default function AddSaleInvoice({ info }: Props) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addSaleType>({
    resolver: zodResolver(addSale),
    defaultValues: getDefaultValues(info),
  });

  function onSubmit(values: addSaleType) {
    setPendding(async () => {
      const result = await createSaleInvoice(values);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5  gap-5 items-end">
          {Object.entries(form.getValues()).map(([key, value]) => {
            const isType = key === "type";
            if (isType) {
              return (
                <SelectField
                  key={key}
                  name={key}
                  label={labelTranslate(key)}
                  control={form.control}
                  options={[
                    { value: "cash", label: "کاش" },
                    { value: "loan", label: "قەرز" },
                  ]}
                />
              );
            }
            return (
              <TextField
                key={key}
                name={key}
                control={form.control}
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

const getDefaultValues = (values: Partial<addSaleType> = {}) => {
  const defaultValues: addSaleType = {
    invoice_number: "",
    name: "",
    place: "",
    type: "cash",
    type: "cash",
    phone: "",
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
    case "phone":
      return "ژمارەی مۆبایل";
    case "place":
      return "شوێن";
    case "type":
      return "جۆری پارەدان";
    case "type":
      return "جۆری پارەدان";
    case "invoice_number":
      return "ژمارەی پسووڵە";
    default:
      return name;
  }
}
