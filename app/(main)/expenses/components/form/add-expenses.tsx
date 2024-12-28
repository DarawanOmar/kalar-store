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
import { addExpenses, addExpensesType } from "../../_type";
import { Textarea } from "@/components/ui/textarea";
import { addExpensesAction, updateExpenses } from "../../_action";

type filmFormProps = {
  isEdit?: boolean;
  info?: addExpensesType;
  handleClose?: () => void;
  id?: number;
};

export default function AddExpenses({
  isEdit,
  info,
  handleClose,
  id,
}: filmFormProps) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addExpensesType>({
    resolver: zodResolver(addExpenses),
    defaultValues: getDefaultValues(info),
  });

  function onSubmit(values: addExpensesType) {
    setPendding(async () => {
      const result = isEdit
        ? await updateExpenses(id as number, values)
        : await addExpensesAction(values);
      if (result.success) {
        toast.success(result.message);
        handleClose && handleClose();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  px-6">
        <div className="grid grid-cols-1  gap-5">
          {Object.entries(form.getValues())
            .slice(0, 3)
            .map(([key, value]) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {labelTranslate(
                    field.name as keyof typeof form.formState.errors
                  )}
                </FormLabel>
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
            variant={"gooeyRight"}
            className="w-full py-[23px]"
          >
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : isEdit ? (
              "گۆرانکاری"
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

const getDefaultValues = (values: Partial<addExpensesType> = {}) => {
  const defaultValues: addExpensesType = {
    name: "",
    price: 0,
    quantity: 0,
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
    case "price":
      return "نرخ";
    case "quantity":
      return "بڕ";
    default:
      return name;
  }
}
