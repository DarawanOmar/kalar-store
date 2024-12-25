"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { completeSale, completeSaleType } from "../../_type";
import { toast } from "sonner";
import { completeSaleInvoiceAction } from "../../_actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { LuLoaderCircle } from "react-icons/lu";
import { MdDone, MdDoneOutline } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Title from "@/components/reuseable/title";
import { FileText } from "lucide-react";

function CompleteSale() {
  const [pendding, setPendding] = useTransition();
  const form = useForm<completeSaleType>({
    resolver: zodResolver(completeSale),
    defaultValues: {
      discount: 0,
    },
  });
  function onSubmit(values: completeSaleType) {
    setPendding(async () => {
      const result = await completeSaleInvoiceAction(values.discount, 1);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <Title
          icon={<FileText size={18} />}
          text="تەواوکردنی فرۆشتن"
          className="mt-14 mb-5"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end md:max-w-max">
          <FormField
            control={form.control}
            name={"discount"}
            render={({ field }) => (
              <FormItem className=" w-full  max-w-full">
                <FormLabel>داشکاندن</FormLabel>
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
              </FormItem>
            )}
          />
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
