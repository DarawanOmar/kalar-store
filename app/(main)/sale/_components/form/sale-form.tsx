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
import { CheckCheck } from "lucide-react";
import { addSale, addSaleType, SaleInvoiceItems } from "../../_type";
import { createSaleInvoice } from "../../_actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  info: Partial<addSaleType>;
};

export default function AddSale({ info }: Props) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5 items-end">
          {Object.entries(form.getValues()).map(([key, value]) => {
            const isType = key === "type";
            if (isType) {
              return (
                <FormField
                  key={key}
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labelTranslate(field.name)}</FormLabel>
                      <Select
                        dir="rtl"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="جۆری پارەدان" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="loan">قەرز </SelectItem>
                          <SelectItem value="cash">کاش</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              );
            }
            return (
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
    case "invoice_number":
      return "ژمارەی پسووڵە";
    default:
      return name;
  }
}
