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
import { addCash, addCashType } from "@/app/(main)/expenses/_type";
import {
  addMainCashAction,
  addSubCashAction,
  getMainCash,
  getSubCash,
} from "@/app/(main)/expenses/_action";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useQuery } from "@tanstack/react-query";

type Props = {
  handleClose?: () => void;
  isMain: boolean;
};

export default function AddCashForm({ isMain, handleClose }: Props) {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["main-sub-cash"],
    queryFn: isMain ? getMainCash : getSubCash,
  });
  const [pendding, setPendding] = useTransition();
  const form = useForm<addCashType>({
    resolver: zodResolver(addCash),
    defaultValues: {
      amount: 0,
      type_action: "deposit",
    },
  });

  function onSubmit(values: addCashType) {
    setPendding(async () => {
      const result = isMain
        ? await addMainCashAction(values)
        : await addSubCashAction(values);
      if (result.success) {
        toast.success(result.message);
        refetch();
        handleClose && handleClose();
      } else {
        toast.error(result.message);
      }
    });
  }

  if (isError) {
    return <div className="text-center text-sm text-red-500">هەڵەیەک هەیە</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  px-6">
        <div className="grid grid-cols-1  gap-5">
          <div className="rounded-3xl bg-primary text-white dark:bg-white/5 dark:border p-10 flex flex-col justify-center items-center">
            <p className="text-softGray mb-2">بری پارەی ناو قاسە</p>
            <p className=" text-2xl">
              {isLoading ? (
                <LuLoaderCircle className="animate-spin transition-all duration-500" />
              ) : (
                data?.data?.amount?.toLocaleString() || 0
              )}
            </p>
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className=" w-full  max-w-full">
                <FormLabel>بڕی پارە</FormLabel>
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
          <div className="flex flex-col gap-4 ">
            <h1>دیاریکردنی ڕاکێشانی پارە:</h1>
            <FormField
              control={form.control}
              name="type_action"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-col gap-4 "
                      dir="rtl"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="deposit" />
                        </FormControl>
                        <FormLabel className="font-normal px-2">
                          زیادکردنی پارە بۆ قاسە
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="withdraw" />
                        </FormControl>
                        <FormLabel className="font-normal px-2">
                          کەم کردنی پارە لە قاسە
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className=" max-w-lg mx-auto gap-16 w-full mt-10 flex  justify-between items-center ">
          <Button
            type="submit"
            variant={"gooeyRight"}
            className="w-full py-[23px]"
          >
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : (
              " گۆرانکاری"
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
