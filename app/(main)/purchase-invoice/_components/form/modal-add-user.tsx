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
  FormMessage,
} from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { returnItemPurchaseInvoice } from "../../action";
import { returnItem, returnItemType } from "@/app/(main)/sale-invoice/_type";

type filmFormProps = {
  product_id: number;
  sale_invoice_item_id: number;
  handleClose: () => void;
};

export default function ReturnPurchaseItemForm({
  product_id,
  sale_invoice_item_id,
  handleClose,
}: filmFormProps) {
  const router = useRouter();
  const [pendding, setPendding] = useTransition();
  const form = useForm<returnItemType>({
    resolver: zodResolver(returnItem),
    defaultValues: {
      quantity: 0,
    },
  });

  function onSubmit(values: returnItemType) {
    setPendding(async () => {
      const result = await returnItemPurchaseInvoice(
        sale_invoice_item_id,
        product_id,
        values.quantity
      );
      if (result.success) {
        toast.success(result.message);
        handleClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  px-6">
        <div className="grid grid-cols-1  gap-5">
          <FormField
            control={form.control}
            name={"quantity"}
            render={({ field }) => (
              <FormItem className=" w-full  max-w-full">
                <FormLabel>بڕ</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className=" max-w-lg mx-auto gap-16 w-full mt-10 flex  justify-between items-center ">
          <Button
            type="submit"
            disabled={pendding}
            variant={"gooeyRight"}
            className="w-full py-[23px]"
          >
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : (
              "گەڕاندنەوە"
            )}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"gooeyRight"}
              className="w-full py-[23px] bg-transparent border border-primary "
            >
              ڕەتکردنەوە
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}
