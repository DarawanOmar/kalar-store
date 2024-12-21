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
import { CheckCheck, FileText } from "lucide-react";
import { addSale, addSaleType } from "../../_type";
import Title from "@/components/reuseable/title";

type filmFormProps = {
  isEdit?: boolean;
  info?: addSaleType;
  handleClose?: () => void;
  id?: number;
};

export default function AddSale({
  isEdit,
  info,
  handleClose,
  id,
}: filmFormProps) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addSaleType>({
    resolver: zodResolver(addSale),
    defaultValues: {
      name: "",
      place: "",
      phone: "",
      note: "",
    },
  });

  function onSubmit(values: addSaleType) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="  px-6">
        <Title
          icon={<FileText size={18} />}
          text="دروستکردنی پسووڵە"
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
            <CheckCheck size={18} />

            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : isEdit ? (
              "گۆرانکاری"
            ) : (
              "تۆمارکردن"
            )}
          </Button>
        </div>
        <p className="text-muted-foreground font-normal my-5 text-sm">
          سەرەتا پسووڵە دروست بکە ئینجا بەرهەمەکە داخڵ بکە
        </p>
      </form>
    </Form>
  );
}

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
    default:
      return name;
  }
}
