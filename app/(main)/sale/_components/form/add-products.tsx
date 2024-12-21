"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { CheckCheck, FileText, Plus } from "lucide-react";
import Title from "@/components/reuseable/title";
import { addProductSale, addProductSaleType } from "../../_type";

type filmFormProps = {
  isEdit?: boolean;
  info?: addProductSaleType;
  handleClose?: () => void;
  id?: number;
};

export default function AddsaleProduct({
  isEdit,
  info,
  handleClose,
  id,
}: filmFormProps) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addProductSaleType>({
    resolver: zodResolver(addProductSale),
    defaultValues: {
      barcode: "",
      name: "",
      quantity: 0,
      purchase_price: 0,
      sale_price: 0,
    },
  });

  function onSubmit(values: addProductSaleType) {
    setPendding(async () => {
      //   const result = isEdit
      //     ? await updatedOffer(id as number, values)
      //     : await addOffer(values);
      //   if (result.success) {
      //     toast.success(result.message);
      //     handleClose && handleClose();
      //   } else {
      //     toast.error(result.message);
      //   }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="sm:px-6">
        <Title
          icon={<FileText size={18} />}
          text="زیادکردنی بەرهەم"
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5 items-end">
          {Object.entries(form.getValues()).map(([key, value]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as any}
              render={({ field }) => (
                <FormItem className=" w-full  max-w-full">
                  <FormLabel>{labelTranslate(field.name)}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn("w-full ", {
                        "border-red-500":
                          form.formState.errors[
                            field.name as keyof typeof form.formState.errors
                          ],
                      })}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
          ))}
          <Button type="submit" variant={"gooeyRight"} className="flex gap-1">
            <Plus size={18} strokeWidth={2.5} />

            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : isEdit ? (
              "گۆرانکاری"
            ) : (
              "زیادکردن"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function labelTranslate(name: string) {
  switch (name) {
    case "name":
      return "ناو";
    case "barcode":
      return "بارکۆد";
    case "description":
      return "تێبینی";
    case "purchase_price":
      return "نرخی کڕین";
    case "sale_price":
      return "نرخی فرۆشتن";
    case "quantity":
      return "بڕ";
    default:
      return name;
  }
}
