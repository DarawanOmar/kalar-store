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
import { Textarea } from "@/components/ui/textarea";
import { payLoan, payLoanType } from "../../_type";
import { TextField } from "@/components/reuseable/input-form-reusable";
import { PropsPay } from "./modal-pay-form";
import { format } from "date-fns";
import { payLoanAction } from "../../_actions";
import { useRouter } from "next/navigation";

type filmFormProps = {
  info?: PropsPay["info"];
  handleClose?: () => void;
  id?: number;
};

export default function PayForm({ info, handleClose, id }: filmFormProps) {
  const router = useRouter();
  const [pendding, setPendding] = useTransition();
  const form = useForm<payLoanType>({
    resolver: zodResolver(payLoan),
    defaultValues: {
      amount: 0,
      note: "",
    },
  });

  function onSubmit(values: payLoanType) {
    setPendding(async () => {
      const result = await payLoanAction(info?.id as number, values);
      if (result.success) {
        toast.success(result.message);
        handleClose && handleClose();
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
          <div className="rounded-3xl bg-primary text-white dark:bg-white/5 dark:border p-8 flex flex-col justify-center items-center gap-3">
            <div className="flex flex-col justify-center items-center gap-1">
              <p className="text-softGray">کۆی گشتی</p>
              <p className=" text-2xl">
                {info?.totalAmount?.toLocaleString() || 0}
                <span className="text-sm mx-1 align-top">IQD</span>
              </p>
            </div>
            <div className="flex flex-col justify-center items-center gap-1">
              <p className="text-softGray ">بری پارەی ماوە</p>
              <p className=" text-2xl">
                {info?.remainingAmount?.toLocaleString() || 0}
                <span className="text-sm mx-1 align-top">IQD</span>
              </p>
            </div>
            <div className="flex justify-between items-center text-xs w-full">
              <div className="flex flex-col gap-1 items-center">
                <p>کۆتا بەرواری پارەدان</p>
                <p>{format(info?.lastPaymentDate as Date, "yyyy-MM-dd")}</p>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <p>کۆتا پارەدان</p>
                <p>{info?.lastPaymentAmount?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <TextField
            control={form.control}
            name="amount"
            label="بڕی پارە"
            placeholder="بڕی پارە"
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تێبینی</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="تێبینی"
                    className="resize-none border border-soft_red rounded-xl"
                    {...field}
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
              "تۆمارکردن"
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
